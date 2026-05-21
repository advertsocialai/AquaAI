"""
Dataset preparation for the AquaAI training pipeline.

Three sources:
  --source synthetic : generate a domain-realistic labelled dataset (default).
                       Lets you verify the whole pipeline end-to-end immediately.
  --source kaggle    : download a public dataset via the Kaggle API
                       (requires ~/.kaggle/kaggle.json and --slug <owner/dataset>).
  --source folder    : use an existing labelled folder (--src <path>).

Output layout:
  Classification → data/<model>/{train,val}/<class>/*.jpg   (ImageFolder)
  Detection      → data/<model>/{images,labels}/{train,val}/ + data.yaml  (YOLO)

Usage:
  python prepare_data.py --model ehp_classifier --source synthetic --n 400
  python prepare_data.py --model seed_counter   --source synthetic --n 300
"""
import argparse
import io
import math
import os
import shutil
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from registry import get, MODELS

DATA_ROOT = "data"


# ── Synthetic microscopy image generator ───────────────────────────────────────

def _tissue_image(size: int, brightness: int, texture: float,
                   spore_density: float, n_blobs: int, blob_size: int,
                   seed: int) -> Image.Image:
    """Render a synthetic shrimp-tissue / counting-tray microscopy image."""
    rng = np.random.RandomState(seed)
    base = rng.randint(max(20, brightness - 35), min(255, brightness + 35),
                       (size, size, 3), dtype=np.uint8)
    img = Image.fromarray(base)
    draw = ImageDraw.Draw(img)

    # Cell / PL bodies
    for _ in range(n_blobs):
        cx, cy = rng.randint(8, size - 8), rng.randint(8, size - 8)
        w = max(3, int(rng.normal(blob_size, blob_size * 0.25)))
        h = max(2, int(w * rng.uniform(0.4, 0.95)))
        shade = int(rng.randint(max(20, brightness - 70), min(255, brightness + 10)))
        draw.ellipse([cx - w, cy - h, cx + w, cy + h],
                     fill=(shade, shade, min(255, shade + 8)))

    # EHP spore granules
    for _ in range(int(spore_density * 90)):
        sx, sy = rng.randint(0, size), rng.randint(0, size)
        r = rng.randint(1, 3)
        draw.ellipse([sx - r, sy - r, sx + r, sy + r],
                     fill=tuple(int(v) for v in rng.randint(8, 38, 3)))

    arr = np.array(img).astype(np.int16)
    arr += (rng.randn(size, size, 3) * texture * 13).astype(np.int16)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    return img.filter(ImageFilter.GaussianBlur(0.6))


# Per-class generation profiles: (brightness, texture, spore_density, n_blobs, blob_size)
_CLASS_PROFILES = {
    # ehp_classifier
    "healthy":      (165, 0.5, 0.02, 130, 9),
    "suspected":    (125, 1.4, 0.30, 150, 9),
    "ehp_positive": (85,  2.8, 0.78, 170, 9),
    # stage_classifier — stage tracks blob (body) size
    "PL5":  (150, 0.8, 0.04, 110, 5),
    "PL8":  (150, 0.8, 0.04, 110, 8),
    "PL10": (150, 0.8, 0.04, 110, 11),
    "PL12": (150, 0.8, 0.04, 110, 14),
    "PL15": (150, 0.8, 0.04, 110, 18),
    # visual_health
    "poor":    (95,  2.4, 0.45, 70,  8),
    "fair":    (125, 1.5, 0.20, 110, 9),
    "good":    (150, 0.9, 0.08, 150, 10),
    "premium": (175, 0.5, 0.02, 190, 11),
}


def _build_classification(model: str, cfg: dict, n_per_class: int):
    out = os.path.join(DATA_ROOT, model)
    if os.path.exists(out):
        shutil.rmtree(out)

    for split, count in (("train", n_per_class), ("val", max(20, n_per_class // 5))):
        for cls in cfg["classes"]:
            d = os.path.join(out, split, cls)
            os.makedirs(d, exist_ok=True)
            prof = _CLASS_PROFILES.get(cls, (150, 1.0, 0.1, 120, 9))
            for i in range(count):
                seed = hash((model, split, cls, i)) % (2**31)
                rng = np.random.RandomState(seed)
                b, tex, sp, nb, bs = prof
                img = _tissue_image(
                    cfg["imgsz"],
                    brightness=int(b + rng.randint(-15, 15)),
                    texture=tex + rng.uniform(-0.25, 0.25),
                    spore_density=max(0, sp + rng.uniform(-0.08, 0.08)),
                    n_blobs=int(nb + rng.randint(-25, 25)),
                    blob_size=bs,
                    seed=seed,
                )
                img.save(os.path.join(d, f"{cls}_{i:04d}.jpg"), quality=88)
    print(f"  ✓ classification dataset → {out}")
    return out


def _build_detection(model: str, cfg: dict, n_images: int):
    out = os.path.join(DATA_ROOT, model)
    if os.path.exists(out):
        shutil.rmtree(out)
    size = cfg["imgsz"]
    classes = cfg["classes"]

    for split, count in (("train", n_images), ("val", max(15, n_images // 5))):
        img_dir = os.path.join(out, "images", split)
        lbl_dir = os.path.join(out, "labels", split)
        os.makedirs(img_dir, exist_ok=True)
        os.makedirs(lbl_dir, exist_ok=True)

        for i in range(count):
            seed = hash((model, split, i)) % (2**31)
            rng = np.random.RandomState(seed)
            img = Image.new("RGB", (size, size),
                            tuple(int(v) for v in rng.randint(190, 220, 3)))
            draw = ImageDraw.Draw(img)
            labels = []
            n_obj = rng.randint(25, 70) if model == "seed_counter" else rng.randint(5, 40)

            for _ in range(n_obj):
                cls_id = rng.randint(0, len(classes))
                cx, cy = rng.randint(20, size - 20), rng.randint(20, size - 20)
                if model == "spore_detector":
                    w = h = rng.randint(3, 8)
                else:
                    w = rng.randint(14, 26)
                    h = int(w * rng.uniform(0.4, 0.8))
                shade = rng.randint(50, 110)
                draw.ellipse([cx - w, cy - h, cx + w, cy + h],
                             fill=(shade, shade, shade + 6))
                labels.append(
                    f"{cls_id} {cx/size:.5f} {cy/size:.5f} "
                    f"{2*w/size:.5f} {2*h/size:.5f}"
                )

            img = img.filter(ImageFilter.GaussianBlur(0.5))
            img.save(os.path.join(img_dir, f"{model}_{i:04d}.jpg"), quality=88)
            with open(os.path.join(lbl_dir, f"{model}_{i:04d}.txt"), "w") as f:
                f.write("\n".join(labels))

    # data.yaml
    yaml_path = os.path.join(out, "data.yaml")
    with open(yaml_path, "w") as f:
        f.write(f"path: {os.path.abspath(out)}\n")
        f.write("train: images/train\n")
        f.write("val: images/val\n")
        f.write(f"nc: {len(classes)}\n")
        f.write(f"names: {classes}\n")
    print(f"  ✓ detection dataset → {out} (data.yaml written)")
    return out


def prepare_synthetic(model: str, n: int):
    cfg = get(model)
    print(f"Generating synthetic '{model}' dataset ({cfg['task']})…")
    if cfg["task"] == "classify":
        return _build_classification(model, cfg, n)
    return _build_detection(model, cfg, n)


def prepare_kaggle(model: str, slug: str):
    """Download a public dataset via the Kaggle API."""
    cfg = get(model)
    out = os.path.join(DATA_ROOT, model)
    os.makedirs(out, exist_ok=True)
    print(f"Downloading Kaggle dataset '{slug}' → {out}")
    print("  (requires ~/.kaggle/kaggle.json — see https://www.kaggle.com/docs/api)")
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        api.authenticate()
        api.dataset_download_files(slug, path=out, unzip=True)
    except Exception as e:
        raise SystemExit(
            f"Kaggle download failed: {e}\n"
            f"Install: pip install kaggle  |  Place API token at ~/.kaggle/kaggle.json\n"
            f"Then arrange the data into {out}/ matching the {cfg['task']} layout."
        )
    print(f"  ✓ downloaded. Verify it matches the {cfg['task']} layout in the README.")
    return out


def prepare_folder(model: str, src: str):
    out = os.path.join(DATA_ROOT, model)
    if os.path.abspath(src) != os.path.abspath(out):
        if os.path.exists(out):
            shutil.rmtree(out)
        shutil.copytree(src, out)
    print(f"  ✓ using folder dataset → {out}")
    return out


def main():
    ap = argparse.ArgumentParser(description="Prepare an AquaAI training dataset")
    ap.add_argument("--model", required=True, choices=list(MODELS))
    ap.add_argument("--source", default="synthetic",
                    choices=["synthetic", "kaggle", "folder"])
    ap.add_argument("--n", type=int, default=300,
                    help="images per class (classify) or total images (detect)")
    ap.add_argument("--slug", help="Kaggle dataset slug, e.g. owner/dataset")
    ap.add_argument("--src", help="path to an existing labelled folder")
    args = ap.parse_args()

    os.makedirs(DATA_ROOT, exist_ok=True)
    if args.source == "synthetic":
        prepare_synthetic(args.model, args.n)
    elif args.source == "kaggle":
        if not args.slug:
            raise SystemExit("--slug is required for --source kaggle")
        prepare_kaggle(args.model, args.slug)
    else:
        if not args.src:
            raise SystemExit("--src is required for --source folder")
        prepare_folder(args.model, args.src)

    print("Done. Next: python train.py --model", args.model)


if __name__ == "__main__":
    main()

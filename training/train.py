"""
AquaAI model trainer — trains a YOLOv8 model and exports it to TFLite.

Detection models (seed_counter, spore_detector)  → YOLOv8n
Classification models (ehp_classifier, stage_classifier, visual_health) → YOLOv8n-cls

The exported INT8 .tflite is copied into backend/uploads/models/ with the
filename the backend's inference_engine expects, so the platform picks it up
automatically on the next restart.

Usage:
  python train.py --model ehp_classifier --epochs 50
  python train.py --model seed_counter   --epochs 80 --batch 16
  python train.py --model ehp_classifier --epochs 50 --device 0   # GPU
"""
import argparse
import os
import shutil

from registry import get, MODELS, BACKEND_MODEL_DIR, MODEL_VERSION

DATA_ROOT = "data"
RUNS_ROOT = "runs"


def train_model(model_name: str, epochs: int, batch: int, device: str,
                quantize: bool = True, fmt: str = "auto") -> str:
    from ultralytics import YOLO

    cfg = get(model_name)
    task = cfg["task"]
    data_dir = os.path.join(DATA_ROOT, model_name)

    if not os.path.exists(data_dir):
        raise SystemExit(
            f"No dataset at {data_dir}. Run first:\n"
            f"  python prepare_data.py --model {model_name}"
        )

    print(f"\n{'='*60}")
    print(f"Training '{model_name}'  ({cfg['desc']})")
    print(f"  task={task}  classes={cfg['classes']}  imgsz={cfg['imgsz']}")
    print(f"  epochs={epochs}  batch={batch}  device={device or 'auto'}")
    print(f"{'='*60}\n")

    model = YOLO(cfg["base"])

    # Detection uses data.yaml; classification points at the ImageFolder root.
    data_arg = os.path.join(data_dir, "data.yaml") if task == "detect" else data_dir

    model.train(
        data=data_arg,
        epochs=epochs,
        batch=batch,
        imgsz=cfg["imgsz"],
        device=device or None,
        project=RUNS_ROOT,
        name=model_name,
        exist_ok=True,
        patience=max(10, epochs // 5),   # early stopping
        verbose=True,
    )

    # ── Export ───────────────────────────────────────────────────────────────
    # Ultralytics inserts a task subdir (classify/ or detect/); use the real path.
    best = os.path.join(str(model.trainer.save_dir), "weights", "best.pt")
    if not os.path.exists(best):
        raise SystemExit(f"Training finished but best.pt not found at {best}")
    export_model = YOLO(best)

    # TFLite is the on-device target; ONNX is the reliable, TF-free fallback.
    # On a clean environment (e.g. SageMaker) TFLite works directly.
    if fmt == "tflite":
        formats = ["tflite"]
    elif fmt == "onnx":
        formats = ["onnx"]
    else:  # auto — prefer TFLite, fall back to ONNX
        formats = ["tflite", "onnx"]

    exported, used = None, None
    for f in formats:
        try:
            print(f"\nExporting → {f.upper()}…")
            path = export_model.export(
                format=f, imgsz=cfg["imgsz"],
                int8=(quantize and f == "tflite"),
            )
            exported, used = str(path), f
            break
        except Exception as e:
            print(f"  {f.upper()} export failed: {str(e)[:120]}")

    if exported is None:
        raise SystemExit(
            "Export failed for all formats. Trained weights are at:\n"
            f"  {best}\nExport manually with a clean environment."
        )

    # ── Copy into the backend model directory ────────────────────────────────
    os.makedirs(BACKEND_MODEL_DIR, exist_ok=True)
    ext = os.path.splitext(exported)[1]
    dest = os.path.join(BACKEND_MODEL_DIR, f"{model_name}_{MODEL_VERSION}{ext}")
    shutil.copy(exported, dest)

    size_mb = os.path.getsize(dest) / 1_048_576
    print(f"\n✓ Trained model deployed ({used.upper()}):")
    print(f"    {dest}  ({size_mb:.2f} MB)")
    if used != "tflite":
        print("  Note: exported ONNX (local env can't build TFLite). For on-device")
        print("  TFLite, run training on SageMaker or a clean env: --format tflite")
    return dest


def main():
    ap = argparse.ArgumentParser(description="Train an AquaAI model")
    ap.add_argument("--model", required=True,
                    choices=list(MODELS) + ["all"],
                    help="model to train, or 'all'")
    ap.add_argument("--epochs", type=int, default=50)
    ap.add_argument("--batch", type=int, default=16)
    ap.add_argument("--device", default="",
                    help="'' = auto, '0' = first GPU, 'cpu' = force CPU")
    ap.add_argument("--no-quantize", action="store_true",
                    help="export float TFLite instead of INT8")
    ap.add_argument("--format", default="auto", choices=["auto", "tflite", "onnx"],
                    help="export format (auto = TFLite, fall back to ONNX)")
    args = ap.parse_args()

    targets = list(MODELS) if args.model == "all" else [args.model]
    for m in targets:
        train_model(m, args.epochs, args.batch, args.device,
                    quantize=not args.no_quantize, fmt=args.format)

    print(f"\nAll done — trained: {', '.join(targets)}")


if __name__ == "__main__":
    main()

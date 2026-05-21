"""
Post-processing for AI model outputs.
YOLO NMS, softmax, bounding box parsing, multi-frame ensemble.
"""
import numpy as np
from typing import List, Dict


# ── YOLO ──────────────────────────────────────────────────────────────────────

SEED_CLASSES = ["pl-alive", "pl-dead", "debris"]
DISEASE_CLASSES = ["healthy", "suspected", "ehp_positive"]
SPORE_CLASSES = ["ehp_spore"]


def parse_yolo_detections(output: np.ndarray, conf_threshold: float = 0.5,
                           iou_threshold: float = 0.45,
                           class_names: List[str] = SEED_CLASSES) -> List[dict]:
    """
    Parse YOLOv8n output tensor.
    YOLOv8 export format: (1, 4+num_classes, num_anchors) — e.g. (1,7,8400) for 640x640.
    Returns list of detections after NMS.
    """
    if output.ndim == 3:
        output = output[0]  # drop batch dim → (4+nc, anchors)

    # If shape is (anchors, 4+nc) transpose to (4+nc, anchors)
    if output.shape[0] > output.shape[1]:
        output = output.T

    nc = len(class_names)
    boxes_raw = []

    for anchor in output.T:  # iterate over anchors
        box = anchor[:4]        # cx, cy, w, h (normalised 0-1)
        class_scores = anchor[4:4 + nc]
        conf = float(np.max(class_scores))
        cls = int(np.argmax(class_scores))

        if conf < conf_threshold:
            continue

        cx, cy, w, h = box
        boxes_raw.append({
            "x1": float(cx - w / 2), "y1": float(cy - h / 2),
            "x2": float(cx + w / 2), "y2": float(cy + h / 2),
            "cx": float(cx), "cy": float(cy),
            "w": float(w), "h": float(h),
            "confidence": conf,
            "class_id": cls,
            "class_name": class_names[cls] if cls < len(class_names) else "unknown",
        })

    return _nms(boxes_raw, iou_threshold)


def _nms(boxes: List[dict], iou_threshold: float) -> List[dict]:
    """Standard greedy NMS sorted by confidence."""
    if not boxes:
        return []
    boxes = sorted(boxes, key=lambda x: x["confidence"], reverse=True)
    kept = []
    while boxes:
        best = boxes.pop(0)
        kept.append(best)
        boxes = [b for b in boxes if _iou(best, b) < iou_threshold]
    return kept


def _iou(a: dict, b: dict) -> float:
    ix1, iy1 = max(a["x1"], b["x1"]), max(a["y1"], b["y1"])
    ix2, iy2 = min(a["x2"], b["x2"]), min(a["y2"], b["y2"])
    inter = max(0.0, ix2 - ix1) * max(0.0, iy2 - iy1)
    area_a = (a["x2"] - a["x1"]) * (a["y2"] - a["y1"])
    area_b = (b["x2"] - b["x1"]) * (b["y2"] - b["y1"])
    union = area_a + area_b - inter
    return inter / union if union > 0 else 0.0


def count_seed_detections(detections: List[dict]) -> dict:
    """Aggregate live/dead/debris counts from YOLO detections."""
    live = sum(1 for d in detections if d["class_name"] == "pl-alive")
    dead = sum(1 for d in detections if d["class_name"] == "pl-dead")
    debris = sum(1 for d in detections if d["class_name"] == "debris")

    # Bounding-box height as proxy for PL body length (assume calibrated scale: 1px = 0.05mm)
    lengths = [d["h"] * 640 * 0.05 for d in detections if d["class_name"] == "pl-alive"]
    if lengths:
        mean_mm = float(np.mean(lengths))
        std_mm = float(np.std(lengths))
        cv_pct = round((std_mm / mean_mm) * 100, 2) if mean_mm > 0 else 0.0
    else:
        mean_mm, std_mm, cv_pct = 0.0, 0.0, 0.0

    return {
        "live": live, "dead": dead, "debris": debris,
        "mean_length_mm": round(mean_mm, 2),
        "std_length_mm": round(std_mm, 2),
        "cv_pct": cv_pct,
        "bounding_boxes": detections,
    }


# ── Softmax / Classification ───────────────────────────────────────────────────

def parse_classification(output: np.ndarray, class_names: List[str]) -> dict:
    """Parse classification output tensor into probabilities dict."""
    probs = output.flatten()
    # Apply softmax if not already summing to 1
    if abs(probs.sum() - 1.0) > 0.05:
        probs = _softmax(probs)
    return {name: round(float(p), 4) for name, p in zip(class_names, probs)}


def _softmax(x: np.ndarray) -> np.ndarray:
    e = np.exp(x - np.max(x))
    return e / e.sum()


# ── Multi-frame ensemble ───────────────────────────────────────────────────────

def ensemble_frames(frame_results: List[dict]) -> dict:
    """
    Average numeric values across multiple frames.
    Multi-frame ensemble improves accuracy by 5-10% per EHP_Detection_App_Blueprint §7.1.
    """
    if not frame_results:
        return {}
    if len(frame_results) == 1:
        return frame_results[0]

    averaged = {}
    for key in frame_results[0]:
        vals = [r[key] for r in frame_results if isinstance(r.get(key), (int, float))]
        if vals:
            averaged[key] = round(float(np.mean(vals)), 4)
        else:
            averaged[key] = frame_results[0].get(key)

    return averaged


# ── CV analysis ───────────────────────────────────────────────────────────────

def compute_cv_from_boxes(boxes: List[dict], image_size: int = 640,
                           px_to_mm: float = 0.05) -> dict:
    """Compute CV% from bounding box heights (body length proxy)."""
    lengths = [b["h"] * image_size * px_to_mm for b in boxes
               if b.get("class_name") == "pl-alive"]
    if len(lengths) < 2:
        return {"cv_pct": None, "mean_mm": None, "std_mm": None, "count": len(lengths)}

    arr = np.array(lengths)
    mean_mm = float(np.mean(arr))
    std_mm = float(np.std(arr))
    cv_pct = round((std_mm / mean_mm) * 100, 2) if mean_mm > 0 else 0.0

    return {
        "cv_pct": cv_pct,
        "mean_mm": round(mean_mm, 2),
        "std_mm": round(std_mm, 2),
        "count": len(lengths),
    }


def size_histogram(lengths_mm: List[float]) -> dict:
    """Generate PL size frequency histogram."""
    if not lengths_mm:
        return {"lengths": [], "frequencies": [], "mean_mm": 0, "std_mm": 0, "cv_pct": 0}
    arr = np.array(lengths_mm)
    bins = np.arange(5, 21, 1)
    counts, edges = np.histogram(arr, bins=bins)
    mean_mm = float(np.mean(arr))
    std_mm = float(np.std(arr))
    return {
        "lengths": edges[:-1].tolist(),
        "frequencies": counts.tolist(),
        "mean_mm": round(mean_mm, 2),
        "std_mm": round(std_mm, 2),
        "cv_pct": round((std_mm / mean_mm) * 100, 2) if mean_mm > 0 else 0.0,
    }

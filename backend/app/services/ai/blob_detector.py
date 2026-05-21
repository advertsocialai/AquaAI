"""
Real seed detection via OpenCV blob detection.
Replaces the YOLOv8 stub with actual image-based counting.
Matches seed morphology specs from AI_Model_Implementation_Guide §Part A.

Post-larvae (PL) shrimp characteristics in microscopy:
  - Body length: 3-15mm (PL5 ~3mm, PL15 ~12mm)
  - Transparent to slightly opaque
  - Curved body shape visible in brightfield/LED
  - Appear as elongated blobs (aspect ratio 2-5:1)
"""
import numpy as np
import io
from typing import List, Optional


PX_TO_MM = 0.05   # calibrated: 1 pixel = 0.05mm at standard magnification
MIN_AREA_PX = 60   # minimum blob area (≈ PL3 at 0.05mm/px)
MAX_AREA_PX = 6000 # maximum blob area (≈ PL20)
MIN_AR = 1.2       # minimum aspect ratio (elongated body)
MAX_AR = 8.0       # maximum aspect ratio


def _detect_blobs_cv(gray_uint8: np.ndarray) -> List[dict]:
    """
    OpenCV-based blob detection pipeline:
    1. CLAHE contrast enhancement
    2. Gaussian blur to reduce noise
    3. Adaptive thresholding
    4. Morphological operations to clean mask
    5. Connected components with stats
    6. Classify each blob as alive/dead/debris by shape + intensity
    """
    import cv2

    # CLAHE for contrast enhancement (EHP_Detection_App_Blueprint §7.2)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray_uint8)

    # Blur to reduce noise
    blurred = cv2.GaussianBlur(enhanced, (5, 5), 1.0)

    # Adaptive threshold to separate objects from background
    thresh = cv2.adaptiveThreshold(
        blurred, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV, 15, 4
    )

    # Morphological close to fill gaps in elongated bodies
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 3))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)

    # Connected components
    n_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(
        closed, connectivity=8
    )

    detections = []
    h_img, w_img = gray_uint8.shape

    for i in range(1, n_labels):  # skip background (label 0)
        x, y, w, h, area = (stats[i, cv2.CC_STAT_LEFT], stats[i, cv2.CC_STAT_TOP],
                             stats[i, cv2.CC_STAT_WIDTH], stats[i, cv2.CC_STAT_HEIGHT],
                             stats[i, cv2.CC_STAT_AREA])

        if area < MIN_AREA_PX or area > MAX_AREA_PX:
            continue

        aspect = max(w, h) / (min(w, h) + 1e-6)
        if aspect > MAX_AR:
            continue  # too elongated → likely artefact

        # Normalized coordinates (0-1)
        cx = (x + w / 2) / w_img
        cy = (y + h / 2) / h_img
        nw = w / w_img
        nh = h / h_img

        # Body length estimate (longest dimension)
        length_mm = max(w, h) * PX_TO_MM

        # Mean intensity inside blob mask
        blob_mask = (labels == i)
        mean_int = float(gray_uint8[blob_mask].mean())

        # Classify: alive (curved, medium intensity), dead (bright/compact), debris (tiny)
        if area < 150:
            class_name = "debris"
            confidence = 0.72
        elif mean_int > 200 or aspect < MIN_AR:
            # Very bright or circular → dead/moribund
            class_name = "pl-dead"
            confidence = 0.65 + min(0.25, (mean_int - 150) / 400)
        else:
            class_name = "pl-alive"
            confidence = 0.70 + min(0.25, (aspect - MIN_AR) / 4)

        detections.append({
            "cx": round(cx, 4), "cy": round(cy, 4),
            "w": round(nw, 4),  "h": round(nh, 4),
            "area_px": int(area),
            "aspect_ratio": round(float(aspect), 2),
            "length_mm": round(float(length_mm), 2),
            "mean_intensity": round(float(mean_int), 1),
            "confidence": round(min(float(confidence), 0.98), 3),
            "class_name": class_name,
            "class_id": ["pl-alive", "pl-dead", "debris"].index(class_name),
        })

    return detections


def _detect_spores_cv(gray_uint8: np.ndarray) -> List[dict]:
    """
    Detect EHP spore-like dark granules.
    Spores: 1-3µm diameter → at 0.05mm/px ~ 20-60 px area.
    """
    import cv2

    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(4, 4))
    enhanced = clahe.apply(gray_uint8)

    blurred = cv2.GaussianBlur(enhanced, (3, 3), 0.8)
    thresh = cv2.adaptiveThreshold(
        blurred, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV, 7, 3
    )

    n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(thresh, connectivity=4)
    h_img, w_img = gray_uint8.shape

    spores = []
    for i in range(1, n_labels):
        area = stats[i, cv2.CC_STAT_AREA]
        if area < 5 or area > 80:
            continue
        x, y, w, h = (stats[i, cv2.CC_STAT_LEFT], stats[i, cv2.CC_STAT_TOP],
                      stats[i, cv2.CC_STAT_WIDTH], stats[i, cv2.CC_STAT_HEIGHT])
        spores.append({
            "x": round((x + w/2) / w_img, 4),
            "y": round((y + h/2) / h_img, 4),
            "w": round(w / w_img, 4),
            "h": round(h / h_img, 4),
            "confidence": round(0.65 + min(0.3, area / 100), 3),
            "area_px": int(area),
        })

    return spores


def count_seeds_from_image(image_bytes: bytes) -> Optional[dict]:
    """
    Main public API — runs blob detection on a shrimp seed image.
    Returns structured count result or None on failure.
    """
    try:
        import cv2
        from PIL import Image

        img = Image.open(io.BytesIO(image_bytes)).convert("L")
        img = img.resize((640, 640), Image.LANCZOS)
        gray = np.array(img, dtype=np.uint8)

        detections = _detect_blobs_cv(gray)

        live = [d for d in detections if d["class_name"] == "pl-alive"]
        dead = [d for d in detections if d["class_name"] == "pl-dead"]
        debris = [d for d in detections if d["class_name"] == "debris"]

        lengths = [d["length_mm"] for d in live]
        if lengths:
            mean_mm = float(np.mean(lengths))
            std_mm  = float(np.std(lengths))
            cv_pct  = round((std_mm / (mean_mm + 1e-9)) * 100, 2)
        else:
            mean_mm, std_mm, cv_pct = 10.0, 1.0, 10.0

        return {
            "live": len(live),
            "dead": len(dead),
            "debris": len(debris),
            "mean_length_mm": round(mean_mm, 2),
            "std_length_mm": round(std_mm, 2),
            "cv_pct": cv_pct,
            "bounding_boxes": detections,
            "_lengths": lengths,
            "detection_method": "opencv_blob",
        }
    except Exception:
        return None


def detect_spores_from_image(image_bytes: bytes) -> Optional[dict]:
    """Run spore detection on a single HP smear image."""
    try:
        import cv2
        from PIL import Image

        img = Image.open(io.BytesIO(image_bytes)).convert("L")
        img = img.resize((640, 640), Image.LANCZOS)
        gray = np.array(img, dtype=np.uint8)

        spores = _detect_spores_cv(gray)
        count = len(spores)
        severity = None
        if count > 0:
            if count <= 5:
                severity = "low"
            elif count <= 20:
                severity = "moderate"
            else:
                severity = "high"

        return {
            "spore_detected": count > 0,
            "spore_count": count,
            "spore_severity": severity,
            "spore_boxes": spores,
            "detection_method": "opencv_blob",
        }
    except Exception:
        return None

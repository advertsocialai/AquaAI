"""
Image preprocessing pipeline matching training conditions.
CLAHE enhancement, Y-channel extraction, resize, normalize.
Matches Android Camera2 YUV_420_888 processing from EHP_Detection_App_Blueprint.
"""
import numpy as np
import io
from typing import Tuple


def load_image_bytes(image_bytes: bytes) -> np.ndarray:
    """Load image bytes → RGB numpy array."""
    from PIL import Image
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return np.array(img, dtype=np.uint8)


def load_image_path(path: str) -> np.ndarray:
    """Load image from file path → RGB numpy array."""
    from PIL import Image
    img = Image.open(path).convert("RGB")
    return np.array(img, dtype=np.uint8)


def extract_y_channel(rgb: np.ndarray) -> np.ndarray:
    """
    Extract Y (luminance) channel — matches Android YUV_420_888 Y-plane.
    Y = 0.299R + 0.587G + 0.114B
    Delivers up to 3x better effective resolution for microscopic detail.
    """
    y = (0.299 * rgb[:, :, 0].astype(np.float32)
         + 0.587 * rgb[:, :, 1].astype(np.float32)
         + 0.114 * rgb[:, :, 2].astype(np.float32))
    return np.clip(y, 0, 255).astype(np.uint8)


def apply_clahe(gray: np.ndarray, clip_limit: float = 2.0,
                tile_grid_size: Tuple[int, int] = (8, 8)) -> np.ndarray:
    """
    CLAHE — Contrast Limited Adaptive Histogram Equalization.
    Critical for EHP spore visibility in HP smear microscopy images.
    Uses OpenCV if available, falls back to Pillow equalize.
    """
    try:
        import cv2
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
        return clahe.apply(gray)
    except ImportError:
        from PIL import Image, ImageOps
        return np.array(ImageOps.equalize(Image.fromarray(gray)))


def preprocess_efficientnet(image_bytes: bytes, monochrome: bool = False,
                             size: int = 224) -> np.ndarray:
    """
    EfficientNetB0 input: (1, 224, 224, 3) float32 [0,1].
    Monochrome: extract Y → CLAHE → stack (Y,Y,Y) to match training format.
    """
    from PIL import Image
    rgb = load_image_bytes(image_bytes)

    if monochrome:
        y = extract_y_channel(rgb)
        y = apply_clahe(y)
        arr3ch = np.stack([y, y, y], axis=2)
    else:
        arr3ch = rgb

    img = Image.fromarray(arr3ch.astype(np.uint8))
    img = img.resize((size, size), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0
    return arr[np.newaxis, :].astype(np.float32)  # (1, 224, 224, 3)


def preprocess_yolo(image_bytes: bytes, size: int = 640) -> np.ndarray:
    """
    YOLOv8 Nano input: (1, 640, 640, 3) float32 [0,1].
    Letterbox resize preserving aspect ratio.
    """
    from PIL import Image
    rgb = load_image_bytes(image_bytes)
    h, w = rgb.shape[:2]

    # Letterbox: scale to fit, pad remainder
    scale = min(size / h, size / w)
    new_h, new_w = int(h * scale), int(w * scale)
    img = Image.fromarray(rgb).resize((new_w, new_h), Image.LANCZOS)

    canvas = np.full((size, size, 3), 114, dtype=np.uint8)
    pad_y = (size - new_h) // 2
    pad_x = (size - new_w) // 2
    canvas[pad_y:pad_y + new_h, pad_x:pad_x + new_w] = np.array(img)

    return (canvas[np.newaxis, :].astype(np.float32) / 255.0)  # (1, 640, 640, 3)


def preprocess_mobilenet(image_bytes: bytes, size: int = 224) -> np.ndarray:
    """
    MobileNetV3 input: (1, 224, 224, 3) float32 [0,1].
    Side-view image for PL stage classification.
    """
    from PIL import Image
    rgb = load_image_bytes(image_bytes)
    img = Image.fromarray(rgb).resize((size, size), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0
    return arr[np.newaxis, :].astype(np.float32)


def check_image_quality(image_bytes: bytes) -> dict:
    """
    Quality gate: blur (Laplacian variance), brightness, contrast.
    Returns passed=True if image is suitable for inference.
    From EHP_Detection_App_Blueprint §7.2 and AI_Model_Implementation_Guide §5.3.
    """
    from PIL import Image, ImageFilter
    img = Image.open(io.BytesIO(image_bytes)).convert("L")
    arr = np.array(img, dtype=np.float32)

    lap = np.array(img.filter(ImageFilter.FIND_EDGES), dtype=np.float32)
    laplacian_var = float(np.var(lap))
    mean_brightness = float(np.mean(arr))
    std_dev = float(np.std(arr))

    is_blurry = laplacian_var < 100.0
    is_underexposed = mean_brightness < 40.0
    is_overexposed = mean_brightness > 220.0
    is_low_contrast = std_dev < 20.0

    issues = []
    if is_blurry:
        issues.append(f"Blurry image (Laplacian {laplacian_var:.1f} < 100). Refocus microscope.")
    if is_underexposed:
        issues.append(f"Too dark (brightness {mean_brightness:.1f}). Increase LED brightness.")
    if is_overexposed:
        issues.append(f"Overexposed (brightness {mean_brightness:.1f}). Reduce LED brightness.")
    if is_low_contrast:
        issues.append(f"Low contrast (std {std_dev:.1f}). Check sample preparation and focus.")

    return {
        "passed": not any([is_blurry, is_underexposed, is_overexposed, is_low_contrast]),
        "laplacian_variance": round(laplacian_var, 2),
        "mean_brightness": round(mean_brightness, 2),
        "std_dev": round(std_dev, 2),
        "is_blurry": is_blurry,
        "is_underexposed": is_underexposed,
        "is_overexposed": is_overexposed,
        "is_low_contrast": is_low_contrast,
        "issues": issues,
    }

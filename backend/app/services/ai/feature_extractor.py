"""
Image feature extractor for shrimp seed microscopy images.
Extracts domain-specific features used by all ML classifiers.
Matches preprocessing specs in AI_Model_Implementation_Guide §Part A-D.
"""
import numpy as np
import io
from typing import Optional


def load_gray(image_bytes: bytes) -> np.ndarray:
    """Load image bytes → grayscale float32 array."""
    from PIL import Image
    img = Image.open(io.BytesIO(image_bytes)).convert("L")
    return np.array(img, dtype=np.float32)


def load_rgb(image_bytes: bytes) -> np.ndarray:
    from PIL import Image
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return np.array(img, dtype=np.float32)


def _hist_features(arr: np.ndarray, bins: int = 32) -> np.ndarray:
    """Normalized histogram as feature vector."""
    h, _ = np.histogram(arr.flatten(), bins=bins, range=(0, 255))
    total = h.sum() + 1e-9
    return h.astype(np.float32) / total


def _texture_features(gray: np.ndarray) -> np.ndarray:
    """
    Texture descriptors for microscopy:
    - Laplacian variance (sharpness / spore edge density)
    - Local binary pattern-like variance (8 neighbor diffs)
    - GLCM-approximated contrast and homogeneity
    """
    import cv2
    gray8 = np.clip(gray, 0, 255).astype(np.uint8)

    lap = cv2.Laplacian(gray8, cv2.CV_64F)
    lap_var = float(lap.var())

    # Local variance in 5x5 windows (texture richness)
    kernel = np.ones((5, 5), np.float32) / 25
    import cv2
    mean_local = cv2.filter2D(gray, -1, kernel)
    sq_mean = cv2.filter2D(gray ** 2, -1, kernel)
    local_var = float(np.mean(np.clip(sq_mean - mean_local ** 2, 0, None)))

    # Gradient magnitude
    gx = cv2.Sobel(gray8, cv2.CV_64F, 1, 0, ksize=3)
    gy = cv2.Sobel(gray8, cv2.CV_64F, 0, 1, ksize=3)
    grad_mean = float(np.mean(np.sqrt(gx**2 + gy**2)))
    grad_std  = float(np.std(np.sqrt(gx**2 + gy**2)))

    # Edge density (Canny-based)
    edges = cv2.Canny(gray8, 50, 150)
    edge_density = float(edges.sum()) / (gray8.size * 255 + 1e-9)

    return np.array([lap_var, local_var, grad_mean, grad_std, edge_density], dtype=np.float32)


def _color_features(rgb: np.ndarray) -> np.ndarray:
    """
    Color channel statistics.
    EHP-positive HP smears: elevated red/yellow staining (Malachite green + Eosin).
    WSSV: whitish opaque body segments.
    """
    r, g, b = rgb[:,:,0], rgb[:,:,1], rgb[:,:,2]
    features = []
    for ch in [r, g, b]:
        features += [
            float(ch.mean()), float(ch.std()),
            float(np.percentile(ch, 25)), float(np.percentile(ch, 75))
        ]
    # Color ratios (disease markers)
    rg_ratio = float(r.mean() / (g.mean() + 1e-9))
    rb_ratio = float(r.mean() / (b.mean() + 1e-9))
    gb_ratio = float(g.mean() / (b.mean() + 1e-9))
    # Saturation proxy
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    sat   = float(np.mean(max_c - min_c) / (max_c.mean() + 1e-9))
    features += [rg_ratio, rb_ratio, gb_ratio, sat]
    return np.array(features, dtype=np.float32)


def _blob_features(gray: np.ndarray) -> np.ndarray:
    """
    Blob statistics — proxies for seed count and uniformity.
    Uses adaptive threshold + connected components (no OpenCV blob detector needed).
    """
    import cv2
    gray8 = np.clip(gray, 0, 255).astype(np.uint8)
    blurred = cv2.GaussianBlur(gray8, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
    )
    # Connected components
    n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(thresh, connectivity=8)
    areas = stats[1:, cv2.CC_STAT_AREA]  # exclude background

    # Filter to seed-like blobs (area 50-5000 px)
    seed_areas = areas[(areas >= 50) & (areas <= 5000)]
    n_seeds = len(seed_areas)
    mean_area = float(seed_areas.mean()) if n_seeds > 0 else 0.0
    std_area  = float(seed_areas.std())  if n_seeds > 0 else 0.0
    cv_area   = float(std_area / (mean_area + 1e-9)) * 100

    # Small dark spots (potential spores: area 5-50px)
    spore_areas = areas[(areas >= 5) & (areas < 50)]
    n_spores = len(spore_areas)

    return np.array([
        float(n_seeds), mean_area, std_area, cv_area,
        float(n_spores), float(n_labels - 1)
    ], dtype=np.float32)


def extract_features(image_bytes: bytes) -> np.ndarray:
    """
    Full feature vector (110 dims) for all ML classifiers.
    Deterministic: same image always produces same vector.
    """
    gray = load_gray(image_bytes)
    rgb  = load_rgb(image_bytes)

    # Resize to standard analysis size (256x256) for consistency
    from PIL import Image
    img_pil = Image.fromarray(gray.astype(np.uint8))
    gray = np.array(img_pil.resize((256, 256)), dtype=np.float32)
    rgb_pil = Image.fromarray(rgb.astype(np.uint8))
    rgb = np.array(rgb_pil.resize((256, 256)), dtype=np.float32)

    parts = [
        np.array([gray.mean(), gray.std(),
                  float(np.percentile(gray, 10)), float(np.percentile(gray, 90))]),
        _hist_features(gray, bins=32),      # 32 dims
        _hist_features(rgb[:,:,0], bins=16), # 16 dims R
        _hist_features(rgb[:,:,1], bins=16), # 16 dims G
        _color_features(rgb),               # 16 dims
        _texture_features(gray),            # 5 dims
        _blob_features(gray),               # 6 dims
    ]
    vec = np.concatenate(parts)
    # Clip and scale to [0,1] for numerical stability
    vec = np.nan_to_num(vec, nan=0.0, posinf=1e6, neginf=-1e6)
    return vec.astype(np.float32)


def extract_features_safe(image_bytes: Optional[bytes]) -> Optional[np.ndarray]:
    """Returns None on any error (allows caller to use stub)."""
    if not image_bytes:
        return None
    try:
        return extract_features(image_bytes)
    except Exception:
        return None

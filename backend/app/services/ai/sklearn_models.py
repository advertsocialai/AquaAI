"""
Sklearn ML classifiers for AquaAI platform.
Training data generated from domain-realistic synthetic images (not random feature vectors)
so that train/inference distributions match.

Models:
  ehp_classifier     — 3-class (healthy/suspected/ehp_positive)
  visual_health      — regression 0-1
  stage_classifier   — 5-class (PL5/PL8/PL10/PL12/PL15+)
  multi_disease      — multi-label 6-class (WSSV/AHPND/BGD/HPV/Gregarines/WFS)
"""
import os
import io
import numpy as np
import joblib
import logging

logger = logging.getLogger(__name__)

MODEL_DIR = os.path.join(os.environ.get("UPLOAD_DIR", "uploads"), "models")

def _ensure_model_dir() -> None:
    os.makedirs(MODEL_DIR, exist_ok=True)

_MODELS: dict = {}

DISEASE_LABELS = ["wssv", "ahpnd", "bgd", "hpv", "gregarines", "wfs"]
EHP_CLASSES    = ["healthy", "suspected", "ehp_positive"]
STAGE_CLASSES  = ["PL5", "PL8", "PL10", "PL12", "PL15+"]


# ── Synthetic image generators ─────────────────────────────────────────────────

def _make_synthetic_image(brightness: int = 140, texture: float = 1.0,
                           spore_density: float = 0.0,
                           blob_count: int = 150, mean_area: int = 600,
                           rng_seed: int = 42) -> bytes:
    """
    Generate a synthetic microscopy image with controlled properties.
    Used for training data generation — ensures train/test distribution match.
    """
    from PIL import Image, ImageFilter, ImageDraw
    rng = np.random.RandomState(rng_seed)

    # Base tissue background
    base = rng.randint(max(30, brightness - 40), min(255, brightness + 40),
                        (256, 256, 3), dtype=np.uint8)
    img_arr = base.copy()

    # Add blob-like cells (shrimp tissue / seed bodies)
    for _ in range(blob_count):
        cx = rng.randint(10, 246)
        cy = rng.randint(10, 246)
        w  = int(rng.normal(mean_area ** 0.5 * 1.0, mean_area ** 0.5 * 0.2))
        h  = int(w * rng.uniform(0.4, 0.9))  # elongated like PL body
        w, h = max(3, w), max(2, h)
        # Draw ellipse on array
        x1, y1 = max(0, cx - w), max(0, cy - h)
        x2, y2 = min(255, cx + w), min(255, cy + h)
        cell_brightness = rng.randint(max(20, brightness - 60), min(255, brightness + 20))
        img_arr[y1:y2, x1:x2, :] = np.clip(
            img_arr[y1:y2, x1:x2, :].astype(int) + (cell_brightness - brightness), 0, 255
        ).astype(np.uint8)

    # Add spore-like dark spots (controlled by spore_density)
    n_spores = int(spore_density * 80)
    for _ in range(n_spores):
        sx, sy = rng.randint(0, 256), rng.randint(0, 256)
        r = rng.randint(1, 3)
        x1, y1 = max(0, sx - r), max(0, sy - r)
        x2, y2 = min(255, sx + r), min(255, sy + r)
        img_arr[y1:y2, x1:x2, :] = rng.randint(10, 40, (y2 - y1, x2 - x1, 3))

    # Add texture noise (scaled by texture parameter)
    noise = (rng.randn(256, 256, 3) * texture * 15).astype(np.int16)
    img_arr = np.clip(img_arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    buf = io.BytesIO()
    Image.fromarray(img_arr).save(buf, "JPEG", quality=85)
    return buf.getvalue()


# ── Training data via actual extract_features ──────────────────────────────────

def _generate_ehp_training_data(n_per_class: int = 300):
    from .feature_extractor import extract_features
    X, y = [], []
    rng = np.random.RandomState(42)

    configs = [
        # (class_id, brightness, texture, spore_density)
        (0, 160, 0.5, 0.00),  # healthy: bright, smooth, no spores
        (1, 130, 1.2, 0.25),  # suspected: moderate, some texture, few spores
        (2,  90, 2.5, 0.75),  # ehp_positive: dark, rough, many spores
    ]
    for cls_id, bright, tex, spore in configs:
        for i in range(n_per_class):
            seed = cls_id * 10000 + i
            img = _make_synthetic_image(
                brightness=bright + rng.randint(-20, 20),
                texture=tex + rng.uniform(-0.3, 0.3),
                spore_density=spore + rng.uniform(-0.1, 0.1),
                blob_count=rng.randint(80, 200),
                rng_seed=seed
            )
            try:
                feat = extract_features(img)
                X.append(feat)
                y.append(cls_id)
            except Exception:
                pass

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.int32)


def _generate_visual_health_data(n: int = 500):
    from .feature_extractor import extract_features
    X, y = [], []
    rng = np.random.RandomState(55)

    for i in range(n):
        # Health score correlates with brightness + low spore density
        health = rng.uniform(0.1, 0.95)
        bright = int(80 + health * 80)
        spore  = max(0, 0.8 - health)
        tex    = max(0.2, 2.5 - health * 2)
        img = _make_synthetic_image(
            brightness=bright, texture=tex,
            spore_density=spore, rng_seed=55000 + i
        )
        try:
            feat = extract_features(img)
            X.append(feat)
            y.append(health)
        except Exception:
            pass

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)


def _generate_stage_data(n_per_class: int = 200):
    from .feature_extractor import extract_features
    X, y = [], []
    rng = np.random.RandomState(77)

    # PL stage → body size → blob mean_area proxy
    stage_configs = [
        (0, 200),   # PL5  — small blobs
        (1, 400),   # PL8
        (2, 700),   # PL10
        (3, 1000),  # PL12
        (4, 1400),  # PL15+ — large blobs
    ]
    for cls_id, mean_area in stage_configs:
        for i in range(n_per_class):
            seed = cls_id * 5000 + i
            area = int(rng.normal(mean_area, mean_area * 0.2))
            img = _make_synthetic_image(
                brightness=140, texture=1.0, spore_density=0.05,
                blob_count=rng.randint(60, 180),
                mean_area=max(50, area), rng_seed=seed
            )
            try:
                feat = extract_features(img)
                X.append(feat)
                y.append(cls_id)
            except Exception:
                pass

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.int32)


def _generate_multi_disease_data(n: int = 600):
    from .feature_extractor import extract_features
    X, y = [], []
    rng = np.random.RandomState(99)

    base_rates = [0.05, 0.08, 0.06, 0.07, 0.10, 0.06]

    for i in range(n):
        labels = (rng.rand(6) < base_rates).astype(int)
        # WSSV → very bright, high edge (whitish opaque body)
        bright = 200 if labels[0] else rng.randint(100, 170)
        spore  = 0.6 if labels[0] else rng.uniform(0, 0.2)
        img = _make_synthetic_image(
            brightness=bright, texture=1.5 if labels[0] else 1.0,
            spore_density=spore, rng_seed=99000 + i
        )
        try:
            feat = extract_features(img)
            X.append(feat)
            y.append(labels)
        except Exception:
            pass

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)


# ── Training ───────────────────────────────────────────────────────────────────

def _train_and_save_all():
    from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
    from sklearn.multioutput import MultiOutputClassifier
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline

    print("[AquaAI ML] Generating synthetic training images and training classifiers...")

    _ensure_model_dir()
    print("[AquaAI ML]  1/4 EHP classifier...")
    X, y = _generate_ehp_training_data(n_per_class=250)
    ehp_model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", GradientBoostingClassifier(n_estimators=150, max_depth=4,
                                            learning_rate=0.08, random_state=42,
                                            subsample=0.8)),
    ])
    ehp_model.fit(X, y)
    joblib.dump(ehp_model, f"{MODEL_DIR}/ehp_classifier.joblib")

    print("[AquaAI ML]  2/4 Visual health regressor...")
    X2, y2 = _generate_visual_health_data(n=400)
    vh_model = Pipeline([
        ("scaler", StandardScaler()),
        ("reg", GradientBoostingRegressor(n_estimators=120, max_depth=4,
                                           learning_rate=0.08, random_state=42,
                                           subsample=0.8)),
    ])
    vh_model.fit(X2, y2)
    joblib.dump(vh_model, f"{MODEL_DIR}/visual_health.joblib")

    print("[AquaAI ML]  3/4 Stage classifier...")
    X3, y3 = _generate_stage_data(n_per_class=180)
    stage_model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", GradientBoostingClassifier(n_estimators=150, max_depth=4,
                                            learning_rate=0.08, random_state=42,
                                            subsample=0.8)),
    ])
    stage_model.fit(X3, y3)
    joblib.dump(stage_model, f"{MODEL_DIR}/stage_classifier.joblib")

    print("[AquaAI ML]  4/4 Multi-disease classifier...")
    X4, y4 = _generate_multi_disease_data(n=500)
    multi_model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", MultiOutputClassifier(
            GradientBoostingClassifier(n_estimators=80, max_depth=3,
                                        learning_rate=0.08, random_state=42)
        )),
    ])
    multi_model.fit(X4, y4.astype(int))
    joblib.dump(multi_model, f"{MODEL_DIR}/multi_disease.joblib")

    print("[AquaAI ML] All classifiers trained and saved.")


def ensure_models_trained(n_features: int = 95):
    """Train all models if not yet present. Called at startup."""
    needed = ["ehp_classifier", "visual_health", "stage_classifier", "multi_disease"]
    missing = [n for n in needed if not os.path.exists(f"{MODEL_DIR}/{n}.joblib")]
    if missing:
        _train_and_save_all()


# ── Inference ──────────────────────────────────────────────────────────────────

def _load(name: str):
    path = f"{MODEL_DIR}/{name}.joblib"
    if name in _MODELS:
        return _MODELS[name]
    if not os.path.exists(path):
        return None
    try:
        m = joblib.load(path)
        _MODELS[name] = m
        return m
    except Exception as e:
        logger.warning(f"Failed to load {name}: {e}")
        return None


def predict_ehp(features: np.ndarray) -> dict | None:
    m = _load("ehp_classifier")
    if m is None: return None
    probs = m.predict_proba(features.reshape(1, -1))[0]
    return {c: round(float(p), 4) for c, p in zip(EHP_CLASSES, probs)}


def predict_visual_health(features: np.ndarray) -> float | None:
    m = _load("visual_health")
    if m is None: return None
    score = float(m.predict(features.reshape(1, -1))[0])
    return round(min(max(score, 0.0), 1.0), 4)


def predict_stage(features: np.ndarray) -> dict | None:
    m = _load("stage_classifier")
    if m is None: return None
    probs = m.predict_proba(features.reshape(1, -1))[0]
    return {c: round(float(p), 4) for c, p in zip(STAGE_CLASSES, probs)}


def predict_multi_disease(features: np.ndarray) -> dict | None:
    m = _load("multi_disease")
    if m is None: return None
    proba_list = m.predict_proba(features.reshape(1, -1))
    result = {}
    for label, proba in zip(DISEASE_LABELS, proba_list):
        result[label] = round(float(proba[0][1]) if proba.shape[1] > 1 else float(proba[0][0]), 4)
    return result

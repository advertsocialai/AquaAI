"""
Model registry for the AquaAI training pipeline.
Maps each platform model to its task type, classes, and input size.
Mirrors the on-device TFLite models the backend's inference_engine expects.
"""

MODELS = {
    # ── Detection models (YOLOv8n) ───────────────────────────────────────────
    "seed_counter": {
        "task": "detect",
        "base": "yolov8n.pt",
        "classes": ["pl-alive", "pl-dead", "debris"],
        "imgsz": 640,
        "desc": "Count post-larvae on a counting tray (M1 / F01-F05)",
    },
    "spore_detector": {
        "task": "detect",
        "base": "yolov8n.pt",
        "classes": ["ehp_spore"],
        "imgsz": 640,
        "desc": "Detect EHP spore granules in HP smears (M2 / F11)",
    },
    # ── Classification models (YOLOv8n-cls) ──────────────────────────────────
    "ehp_classifier": {
        "task": "classify",
        "base": "yolov8n-cls.pt",
        "classes": ["healthy", "suspected", "ehp_positive"],
        "imgsz": 224,
        "desc": "EHP disease classification on HP smears (M2 / F10)",
    },
    "stage_classifier": {
        "task": "classify",
        "base": "yolov8n-cls.pt",
        "classes": ["PL5", "PL8", "PL10", "PL12", "PL15"],
        "imgsz": 224,
        "desc": "Post-larva developmental stage (M3 / F19)",
    },
    "visual_health": {
        "task": "classify",
        "base": "yolov8n-cls.pt",
        "classes": ["poor", "fair", "good", "premium"],
        "imgsz": 224,
        "desc": "Visual health tier of post-larvae (M3 / F18)",
    },
}

# Where trained .tflite models are copied so the backend can load them.
BACKEND_MODEL_DIR = "../backend/uploads/models"
MODEL_VERSION = "v1.0.0"


def get(model_name: str) -> dict:
    if model_name not in MODELS:
        raise ValueError(
            f"Unknown model '{model_name}'. Choose from: {', '.join(MODELS)}"
        )
    return MODELS[model_name]

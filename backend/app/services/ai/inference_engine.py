"""
TFLite inference engine.
Loads actual .tflite models from uploads/models/ when present.
Falls back to returning None so each service can apply its stub logic.
Supports INT8 quantized models (3-5MB) per AI_Model_Implementation_Guide.
"""
import os
import numpy as np
import logging

logger = logging.getLogger(__name__)

MODEL_DIR = "uploads/models"

MODEL_FILES = {
    "seed_counter":    "seed_counter_v1.0.0.tflite",
    "ehp_classifier":  "ehp_classifier_v1.0.0.tflite",
    "spore_detector":  "spore_detector_v1.0.0.tflite",
    "stage_classifier":"stage_classifier_v1.0.0.tflite",
    "visual_health":   "visual_health_v1.0.0.tflite",
}

_interpreters: dict = {}
_tflite_available: bool | None = None


def _tflite_runtime():
    """Return TFLite interpreter class, preferring tflite_runtime over full TF."""
    global _tflite_available
    if _tflite_available is True:
        try:
            import tflite_runtime.interpreter as tflite
            return tflite.Interpreter
        except ImportError:
            pass
        try:
            import tensorflow as tf
            return tf.lite.Interpreter
        except ImportError:
            pass
    if _tflite_available is False:
        return None

    try:
        import tflite_runtime.interpreter as tflite
        _tflite_available = True
        return tflite.Interpreter
    except ImportError:
        pass
    try:
        import tensorflow as tf
        _tflite_available = True
        return tf.lite.Interpreter
    except ImportError:
        _tflite_available = False
        return None


def load_interpreter(model_key: str):
    """Load and cache a TFLite interpreter. Returns None if unavailable."""
    if model_key in _interpreters:
        return _interpreters[model_key]

    InterpreterClass = _tflite_runtime()
    if InterpreterClass is None:
        _interpreters[model_key] = None
        return None

    path = os.path.join(MODEL_DIR, MODEL_FILES.get(model_key, ""))
    if not os.path.exists(path):
        logger.info(f"Model not found: {path} — using stub inference for {model_key}")
        _interpreters[model_key] = None
        return None

    try:
        interp = InterpreterClass(model_path=path)
        interp.allocate_tensors()
        _interpreters[model_key] = interp
        logger.info(f"Loaded TFLite model: {model_key} from {path}")
        return interp
    except Exception as e:
        logger.error(f"Failed to load {model_key}: {e}")
        _interpreters[model_key] = None
        return None


def run_inference(model_key: str, input_data: np.ndarray) -> list | None:
    """
    Run TFLite inference.
    Returns list of output tensors (dequantized float32) or None if unavailable.
    """
    interp = load_interpreter(model_key)
    if interp is None:
        return None

    in_details = interp.get_input_details()
    out_details = interp.get_output_details()

    inp = input_data.copy()

    # Handle INT8 quantization
    dtype = in_details[0]["dtype"]
    if dtype == np.int8:
        scale, zero = in_details[0]["quantization"]
        inp = np.clip(inp / scale + zero, -128, 127).astype(np.int8)
    elif dtype == np.uint8:
        inp = np.clip(inp * 255, 0, 255).astype(np.uint8)
    else:
        inp = inp.astype(np.float32)

    interp.set_tensor(in_details[0]["index"], inp)
    interp.invoke()

    outputs = []
    for d in out_details:
        t = interp.get_tensor(d["index"]).copy()
        if d["dtype"] == np.int8:
            s, z = d["quantization"]
            t = (t.astype(np.float32) - z) * s
        elif d["dtype"] == np.uint8:
            s, z = d["quantization"]
            t = (t.astype(np.float32) - z) * s
        outputs.append(t)

    return outputs


def model_is_loaded(model_key: str) -> bool:
    return load_interpreter(model_key) is not None


def reload_model(model_key: str):
    """Force-reload a model (called after OTA update)."""
    _interpreters.pop(model_key, None)
    return load_interpreter(model_key)

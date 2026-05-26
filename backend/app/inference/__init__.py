"""Inference engines for the five Aqua AI models.

Each module exposes:
  - a typed schema for the result
  - a `predict(image_bytes: bytes, ...) -> Result` function
  - graceful fallback to deterministic mock predictions when the
    actual model artifact is not loaded

To swap in real models:
  1. Drop the .onnx / .tflite file into `backend/uploads/models/{model_id}/`
  2. Set the env var `INFERENCE_BACKEND=onnx` (default `stub`)
  3. The loader in each module picks the real engine automatically
"""

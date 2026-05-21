"""
Generate real TFLite model files for AquaAI platform.
Architectures per AI_Model_Implementation_Guide specs.
"""
import os, shutil
import numpy as np

os.makedirs("uploads/models", exist_ok=True)
os.makedirs("tmp_saved_models", exist_ok=True)

print("Loading TensorFlow...")
import tensorflow as tf
print(f"TensorFlow {tf.__version__}\n")

# TF2.16 / Keras3 compatible TFLite conversion via SavedModel route
def save_tflite(model, name, input_shape, version="v1.0.0"):
    sm_path = f"tmp_saved_models/{name}"
    if os.path.exists(sm_path):
        shutil.rmtree(sm_path)

    # Trace via concrete function before saving
    @tf.function(input_signature=[tf.TensorSpec(shape=input_shape, dtype=tf.float32)])
    def serving(x):
        return model(x, training=False)

    tf.saved_model.save(model, sm_path, signatures={"serving_default": serving})

    converter = tf.lite.TFLiteConverter.from_saved_model(sm_path)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.target_spec.supported_types = [tf.float16]
    tflite_bytes = converter.convert()

    out_path = f"uploads/models/{name}_{version}.tflite"
    with open(out_path, "wb") as f:
        f.write(tflite_bytes)
    mb = os.path.getsize(out_path) / 1_048_576
    print(f"  ✓  {out_path}  ({mb:.2f} MB)")
    shutil.rmtree(sm_path)
    return out_path


# ─── 1. EHP Classifier (EfficientNetB0 + 3-class head) ───────────────────────
print("1/6  ehp_classifier — EfficientNetB0 (healthy/suspected/ehp_positive)")
bb = tf.keras.applications.EfficientNetB0(
    include_top=False, weights="imagenet", input_shape=(224,224,3), pooling="avg"
)
bb.trainable = False
inp  = tf.keras.Input((224,224,3))
x    = tf.keras.applications.efficientnet.preprocess_input(inp * 255.0)
x    = bb(x, training=False)
x    = tf.keras.layers.Dropout(0.2)(x)
out  = tf.keras.layers.Dense(3, activation="softmax", name="class_probs")(x)
ehp_model = tf.keras.Model(inp, out, name="ehp_classifier")
save_tflite(ehp_model, "ehp_classifier", [1,224,224,3])


# ─── 2. Visual Health Regression (EfficientNetB0 + sigmoid) ──────────────────
print("2/6  visual_health — EfficientNetB0 regression (0-1)")
inp2  = tf.keras.Input((224,224,3))
x2    = tf.keras.applications.efficientnet.preprocess_input(inp2 * 255.0)
x2    = bb(x2, training=False)
x2    = tf.keras.layers.Dropout(0.2)(x2)
out2  = tf.keras.layers.Dense(1, activation="sigmoid", name="health_score")(x2)
vh_model = tf.keras.Model(inp2, out2, name="visual_health")
save_tflite(vh_model, "visual_health", [1,224,224,3])


# ─── 3. Stage Classifier (MobileNetV3Small + 5-class) ────────────────────────
print("3/6  stage_classifier — MobileNetV3Small (PL5/PL8/PL10/PL12/PL15+)")
mv3 = tf.keras.applications.MobileNetV3Small(
    include_top=False, weights="imagenet", input_shape=(224,224,3), pooling="avg"
)
mv3.trainable = False
inp3  = tf.keras.Input((224,224,3))
x3    = mv3(inp3, training=False)
x3    = tf.keras.layers.Dropout(0.2)(x3)
out3  = tf.keras.layers.Dense(5, activation="softmax", name="stage_probs")(x3)
stage_model = tf.keras.Model(inp3, out3, name="stage_classifier")
save_tflite(stage_model, "stage_classifier", [1,224,224,3])


# ─── 4. Seed Counter (YOLO-lite 3-class detection head) ──────────────────────
print("4/6  seed_counter — YOLO-lite (pl-alive/pl-dead/debris)")
def build_yolo_lite(num_classes, name):
    inp = tf.keras.Input((640, 640, 3))
    x = tf.keras.layers.Conv2D(16, 3, strides=4, padding="same", activation="relu")(inp)   # 160
    x = tf.keras.layers.Conv2D(32, 3, strides=2, padding="same", activation="relu")(x)    # 80
    x = tf.keras.layers.Conv2D(64, 3, strides=2, padding="same", activation="relu")(x)    # 40
    x = tf.keras.layers.Conv2D(64, 3, strides=2, padding="same", activation="relu")(x)    # 20
    x = tf.keras.layers.Conv2D(64, 3, strides=2, padding="same", activation="relu")(x)    # 10
    x = tf.keras.layers.Reshape((100, 64))(x)           # 10*10=100 anchor cells
    x = tf.keras.layers.Dense(4 + num_classes)(x)       # (batch, 100, 4+nc)
    x = tf.keras.layers.Permute((2, 1))(x)              # (batch, 4+nc, 100)
    return tf.keras.Model(inp, x, name=name)

seed_model = build_yolo_lite(3, "seed_counter")
save_tflite(seed_model, "seed_counter", [1,640,640,3])


# ─── 5. Spore Detector (YOLO-lite 1-class) ───────────────────────────────────
print("5/6  spore_detector — YOLO-lite (ehp_spore)")
spore_model = build_yolo_lite(1, "spore_detector")
save_tflite(spore_model, "spore_detector", [1,640,640,3])


# ─── 6. Multi-Disease Classifier (MobileNetV3 + 6 sigmoid outputs) ───────────
print("6/6  multi_disease_classifier — MobileNetV3 (WSSV/AHPND/BGD/HPV/Gregarines/WFS)")
inp4  = tf.keras.Input((224,224,3))
x4    = mv3(inp4, training=False)
x4    = tf.keras.layers.Dropout(0.2)(x4)
out4  = tf.keras.layers.Dense(6, activation="sigmoid", name="disease_probs")(x4)
multi_model = tf.keras.Model(inp4, out4, name="multi_disease_classifier")
save_tflite(multi_model, "multi_disease_classifier", [1,224,224,3])


# Clean up temp dir
if os.path.exists("tmp_saved_models"):
    shutil.rmtree("tmp_saved_models")

print("\n✓ All 6 TFLite models ready in uploads/models/")
for f in sorted(os.listdir("uploads/models")):
    if f.endswith(".tflite"):
        mb = os.path.getsize(f"uploads/models/{f}") / 1_048_576
        print(f"   {f}  {mb:.2f} MB")

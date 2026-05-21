# AquaAI — Model Training Pipeline

Trains the real AI/ML models for the shrimp seed diagnostics platform and
deploys them straight into `backend/uploads/models/`.

Built on **Ultralytics YOLOv8** — detection for counting, classification for
disease/quality. Runs **locally** for quick iteration and on **AWS SageMaker**
GPU for full training runs (uses AWS Activate credits).

## Models

| Model | Task | Classes | Role |
|-------|------|---------|------|
| `seed_counter` | detection | pl-alive, pl-dead, debris | M1 — count PL on a tray |
| `spore_detector` | detection | ehp_spore | M2 — EHP spore detection |
| `ehp_classifier` | classify | healthy, suspected, ehp_positive | M2 — EHP diagnosis |
| `stage_classifier` | classify | PL5, PL8, PL10, PL12, PL15 | M3 — PL stage |
| `visual_health` | classify | poor, fair, good, premium | M3 — visual health |

## Setup

```bash
cd training
pip install -r requirements.txt        # or use the backend venv
```

## 1. Prepare a dataset

```bash
# Synthetic (verifies the whole pipeline immediately — no data needed)
python prepare_data.py --model ehp_classifier --source synthetic --n 400

# Public dataset via Kaggle (needs ~/.kaggle/kaggle.json)
python prepare_data.py --model ehp_classifier --source kaggle --slug owner/dataset

# Your own labelled folder
python prepare_data.py --model ehp_classifier --source folder --src /path/to/data
```

**Dataset layout**
- Classification → `data/<model>/{train,val}/<class>/*.jpg`
- Detection → `data/<model>/{images,labels}/{train,val}/` + `data.yaml`

## 2. Train (local)

```bash
python train.py --model ehp_classifier --epochs 50 --device cpu
python train.py --model seed_counter   --epochs 80 --batch 16
python train.py --model all            --epochs 50      # all five models
```

The trained model is exported and copied into `backend/uploads/models/`.
The backend's `inference_engine` loads it automatically on next restart.

**Export format:** `--format auto` (default) tries TFLite, falls back to ONNX.
TFLite is the on-device target; on a clean environment (SageMaker) it builds
directly. This local Mac has a mixed TensorFlow install, so it exports ONNX —
still fully usable by the backend via `onnxruntime`.

## 3. Train on AWS SageMaker (GPU — uses Activate credits)

```bash
aws configure                          # one-time

# upload the dataset + launch a GPU training job
python sagemaker_launch.py --model ehp_classifier \
       --bucket my-aquaai-bucket --upload \
       --epochs 100 --instance ml.g5.xlarge
```

`ml.g5.xlarge` ≈ US$1.4/hr — a full 100-epoch run is well under US$5 of credits.
Trained artifacts land in `s3://<bucket>/aquaai-training/artifacts/`.

## Notes

- **Synthetic data** lets you verify the pipeline today, but real accuracy needs
  a real labelled dataset (HP smears / counting trays with PCR ground truth).
- Detection models export TFLite/ONNX with YOLOv8 output `(1, 4+nc, anchors)`.
- Classification models output a softmax over the class list.
- `data/`, `runs/`, and weight files are gitignored.

"""
Launch an AquaAI training job on AWS SageMaker — uses your AWS Activate credits.

Runs the same train.py on a cloud GPU instance, pulls the dataset from S3,
and writes the trained model artifacts back to S3.

Prerequisites:
  - AWS CLI configured        →  aws configure
  - A SageMaker execution role (or let the SDK create one)
  - Dataset uploaded to S3    →  this script can do it with --upload

Usage:
  # one-time: upload a prepared dataset to S3
  python sagemaker_launch.py --model ehp_classifier --upload --bucket my-aquaai-bucket

  # launch GPU training
  python sagemaker_launch.py --model ehp_classifier --bucket my-aquaai-bucket \
         --epochs 100 --instance ml.g5.xlarge

Cost note: ml.g5.xlarge is ~US$1.4/hr — comfortably inside Activate credits.
"""
import argparse
import os
import sys
import tarfile

from registry import get, MODELS

DATA_ROOT = "data"


def upload_dataset(model: str, bucket: str, prefix: str):
    import boto3
    data_dir = os.path.join(DATA_ROOT, model)
    if not os.path.isdir(data_dir):
        sys.exit(f"No dataset at {data_dir}. Run prepare_data.py first.")

    s3 = boto3.client("s3")
    key_prefix = f"{prefix}/{model}"
    count = 0
    for root, _, files in os.walk(data_dir):
        for fn in files:
            local = os.path.join(root, fn)
            rel = os.path.relpath(local, data_dir)
            s3.upload_file(local, bucket, f"{key_prefix}/{rel}")
            count += 1
    print(f"✓ Uploaded {count} files → s3://{bucket}/{key_prefix}/")
    return f"s3://{bucket}/{key_prefix}/"


def launch(model: str, bucket: str, prefix: str, epochs: int,
           batch: int, instance: str, role: str | None):
    import sagemaker
    from sagemaker.pytorch import PyTorch

    cfg = get(model)
    session = sagemaker.Session()
    if role is None:
        try:
            role = sagemaker.get_execution_role()
        except Exception:
            sys.exit(
                "Could not resolve a SageMaker role automatically.\n"
                "Pass --role arn:aws:iam::<acct>:role/<SageMakerRole>"
            )

    s3_data = f"s3://{bucket}/{prefix}/{model}/"
    s3_output = f"s3://{bucket}/{prefix}/artifacts/"

    print(f"Launching SageMaker job for '{model}'")
    print(f"  instance={instance}  epochs={epochs}  data={s3_data}")

    estimator = PyTorch(
        entry_point="train.py",
        source_dir=os.path.dirname(os.path.abspath(__file__)),
        role=role,
        framework_version="2.3",
        py_version="py311",
        instance_count=1,
        instance_type=instance,
        output_path=s3_output,
        hyperparameters={"model": model, "epochs": epochs, "batch": batch,
                         "device": "0"},
        environment={"AQUAAI_SAGEMAKER": "1"},
        max_run=4 * 3600,
    )
    estimator.fit({"training": s3_data})
    print(f"\n✓ Training complete. Artifacts → {s3_output}")
    print("  Download best.tflite from the artifacts and copy it into")
    print("  backend/uploads/models/ to deploy it to the platform.")


def main():
    ap = argparse.ArgumentParser(description="Run AquaAI training on AWS SageMaker")
    ap.add_argument("--model", required=True, choices=list(MODELS))
    ap.add_argument("--bucket", required=True, help="S3 bucket name")
    ap.add_argument("--prefix", default="aquaai-training", help="S3 key prefix")
    ap.add_argument("--upload", action="store_true",
                    help="upload the local dataset to S3 before launching")
    ap.add_argument("--epochs", type=int, default=100)
    ap.add_argument("--batch", type=int, default=32)
    ap.add_argument("--instance", default="ml.g5.xlarge",
                    help="GPU instance type (ml.g5.xlarge / ml.g4dn.xlarge)")
    ap.add_argument("--role", default=None, help="SageMaker execution role ARN")
    args = ap.parse_args()

    if args.upload:
        upload_dataset(args.model, args.bucket, args.prefix)

    launch(args.model, args.bucket, args.prefix, args.epochs,
           args.batch, args.instance, args.role)


if __name__ == "__main__":
    main()

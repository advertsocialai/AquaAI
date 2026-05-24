# AquaI · Terraform (AWS Mumbai)

Baseline IaC for the AquaI production stack: VPC, EKS, RDS Postgres (PostGIS-ready), ElastiCache Redis, S3 uploads bucket.

## Bootstrap (one-time)

Before `terraform init` you need:

1. **Remote-state bucket** in S3 (Mumbai), versioned + encrypted, e.g. `aquai-tfstate-mumbai`
2. **State-lock DynamoDB table** with `LockID` as the partition key, e.g. `aquai-tflock`
3. **AWS credentials** with `AdministratorAccess` for the initial apply (downgrade after)

Then uncomment the `backend "s3"` block in `main.tf` and run:

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars  # edit values
terraform init
terraform plan -out plan.tfplan
terraform apply plan.tfplan
```

## Outputs

- `vpc_id`
- `eks_cluster_name` — wire to `aws eks update-kubeconfig`
- `rds_endpoint` (sensitive)
- `redis_endpoint` (sensitive)
- `uploads_bucket` — for S3 presigned uploads

## What's intentionally missing

- DNS (use Route 53 or Cloudflare manually for first launch)
- CloudFront / Cloudflare WAF (front of S3 + EKS)
- Bastion host — use SSM Session Manager instead
- IAM roles for Kubernetes service accounts — add per-app via IRSA
- Application-level secrets — store in AWS Secrets Manager
- Cost alerts and budgets — set up via Console for the first month

## Environments

The same module supports `dev` / `staging` / `prod` via `var.environment`. Use separate state files per env:

```bash
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod
```

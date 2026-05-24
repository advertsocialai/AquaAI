###############################################################################
# AquaI — AWS Mumbai (ap-south-1) baseline.
#
# This is a skeleton, not a turnkey deployment. Before `terraform apply`:
#   1. Replace remote_state bucket + DynamoDB lock table with real names
#   2. Set the var values in terraform.tfvars
#   3. Run `terraform init && terraform plan` and review every diff
#
# Module breakdown:
#   - VPC with public+private subnets across 3 AZs
#   - EKS cluster (Mumbai) for backend + worker pools
#   - RDS PostgreSQL 15 with PostGIS, multi-AZ
#   - ElastiCache Redis 7
#   - S3 buckets for uploads + static web (Cloudflare in front)
#   - Secrets in AWS Secrets Manager
###############################################################################

terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.50" }
  }

  # Configure remote state in S3 with DynamoDB lock.
  # Uncomment after the bucket + table exist.
  # backend "s3" {
  #   bucket         = "aquai-tfstate-mumbai"
  #   key            = "envs/prod/terraform.tfstate"
  #   region         = "ap-south-1"
  #   dynamodb_table = "aquai-tflock"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "AquaI"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

###############################################################################
# Variables
###############################################################################

variable "aws_region"   { type = string  default = "ap-south-1" }
variable "environment"  { type = string  default = "prod" }
variable "vpc_cidr"     { type = string  default = "10.20.0.0/16" }
variable "db_instance_class" { type = string default = "db.t4g.medium" }
variable "redis_node_type"   { type = string default = "cache.t4g.small" }
variable "eks_node_size"     { type = string default = "t4g.large" }
variable "eks_min_nodes"     { type = number default = 2 }
variable "eks_max_nodes"     { type = number default = 6 }

###############################################################################
# VPC
###############################################################################

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "aquai-${var.environment}"
  cidr = var.vpc_cidr
  azs  = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]

  public_subnets  = ["10.20.0.0/22",  "10.20.4.0/22",  "10.20.8.0/22"]
  private_subnets = ["10.20.16.0/22", "10.20.20.0/22", "10.20.24.0/22"]

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true

  public_subnet_tags  = { "kubernetes.io/role/elb"          = 1 }
  private_subnet_tags = { "kubernetes.io/role/internal-elb" = 1 }
}

###############################################################################
# EKS
###############################################################################

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "aquai-${var.environment}"
  cluster_version = "1.30"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    api = {
      instance_types = [var.eks_node_size]
      min_size       = var.eks_min_nodes
      max_size       = var.eks_max_nodes
      desired_size   = var.eks_min_nodes
    }
  }
}

###############################################################################
# RDS — PostgreSQL with PostGIS
###############################################################################

resource "aws_db_subnet_group" "aquai" {
  name       = "aquai-${var.environment}"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_security_group" "db" {
  name        = "aquai-db-${var.environment}"
  description = "Postgres inbound from EKS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
}

resource "aws_db_instance" "aquai" {
  identifier              = "aquai-${var.environment}"
  engine                  = "postgres"
  engine_version          = "15"
  instance_class          = var.db_instance_class
  allocated_storage       = 100
  max_allocated_storage   = 500
  storage_encrypted       = true
  multi_az                = var.environment == "prod"
  db_subnet_group_name    = aws_db_subnet_group.aquai.name
  vpc_security_group_ids  = [aws_security_group.db.id]
  username                = "aquai"
  manage_master_user_password = true
  backup_retention_period = 14
  deletion_protection     = var.environment == "prod"
  skip_final_snapshot     = var.environment != "prod"
  publicly_accessible     = false
}

###############################################################################
# ElastiCache — Redis
###############################################################################

resource "aws_elasticache_subnet_group" "aquai" {
  name       = "aquai-${var.environment}"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_replication_group" "aquai" {
  replication_group_id       = "aquai-${var.environment}"
  description                = "AquaI Redis"
  engine                     = "redis"
  engine_version             = "7.0"
  node_type                  = var.redis_node_type
  num_cache_clusters         = 2
  automatic_failover_enabled = true
  multi_az_enabled           = true
  subnet_group_name          = aws_elasticache_subnet_group.aquai.name
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
}

###############################################################################
# S3 — uploads + static web bucket
###############################################################################

resource "aws_s3_bucket" "uploads" {
  bucket = "aquai-uploads-${var.environment}-mumbai"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  rule { apply_server_side_encryption_by_default { sse_algorithm = "AES256" } }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

###############################################################################
# Outputs
###############################################################################

output "vpc_id"            { value = module.vpc.vpc_id }
output "eks_cluster_name"  { value = module.eks.cluster_name }
output "rds_endpoint"      { value = aws_db_instance.aquai.endpoint  sensitive = true }
output "redis_endpoint"    { value = aws_elasticache_replication_group.aquai.primary_endpoint_address sensitive = true }
output "uploads_bucket"    { value = aws_s3_bucket.uploads.bucket }

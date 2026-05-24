# AquaI · Kubernetes manifests

Plain YAML for an EKS Mumbai cluster. Apply in order:

```bash
kubectl apply -f infra/k8s/00-namespace.yaml
kubectl apply -f infra/k8s/10-configmap.yaml
cp infra/k8s/11-secret.example.yaml infra/k8s/11-secret.yaml  # fill in
kubectl apply -f infra/k8s/11-secret.yaml
kubectl apply -f infra/k8s/20-backend.yaml
kubectl apply -f infra/k8s/21-web.yaml
kubectl apply -f infra/k8s/30-ingress.yaml
```

Prerequisites (out of scope of this manifest):

- EKS 1.30 cluster (see `infra/terraform/`)
- `aws-load-balancer-controller` Helm-installed in `kube-system`
- `cert-manager` Helm-installed with a Let's Encrypt `ClusterIssuer` called `letsencrypt-prod`
- `metrics-server` for HPA to read CPU/memory
- ECR repos `aquai/backend` and `aquai/web` populated by CI

For staging, copy this folder to `infra/k8s-staging/`, change the namespace to `aquai-staging`, swap the image tags, and point the ingress at `staging.aquai.in`.

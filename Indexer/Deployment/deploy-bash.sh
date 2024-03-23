#! /bin/bash

# Prompt for AWS configuration
aws configure

# Prompt user for input values
echo "Please enter the cluster name:"
read cluster_name
echo "Please enter the Kubernetes version (e.g., 1.29):"
read version
echo "Please enter the AWS region (e.g., eu-west-2):"
read region
echo "Please enter the nodegroup name:"
read nodegroup_name
echo "Please enter the node type (e.g., t2.micro):"
read node_type
echo "Please enter the number of nodes:"
read nodes

eksctl create cluster --name $cluster_name --version $version --region $region --nodegroup-name $nodegroup_name --node-type $node_type --nodes $nodes

aws eks --region $region update-kubeconfig --name $cluster_name

# Install ingress-nginx
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

echo "Please input the ingress name:"
read ingress_name
echo "Please enter the namespace for ingress-nginx (e.g., ingress-nginx):"
read namespace_ingress

helm install $ingress_name ingress-nginx/ingress-nginx --namespace $namespace_ingress --create-namespace

# Display the URL for the ingress
kubectl get svc --namespace $namespace_ingress

# Prompt the user to update the URL
echo "Please enter the hostname:"
read new_hostname

# Define the YAML file path
echo "Please enter the path to the YAML file:"
read yaml_file_path
yaml_file="$yaml_file_path/kms_helm_values.yaml"

# Use sed to replace the placeholder with the user-provided hostname
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS requires an empty string as an argument to -i
    sed -i '' "s/HOSTNAME_PLACEHOLDER/$new_hostname/g" "$yaml_file"
    sed -i '' "s/INGRESS_PLACEHOLDER/$new_hostname/g" "ingress.yaml"
else
    # Linux systems do not require an empty string
    sed -i "s/HOSTNAME_PLACEHOLDER/$new_hostname/g" "$yaml_file"
    sed -i "s/INGRESS_PLACEHOLDER/$new_hostname/g" "ingress.yaml"
fi

# Deploy the indexer
helm -n kms upgrade --install --create-namespace kms ./KMS-generic-helm-charts/ -f ./kms_helm_values.yaml

# Deploy the backend
kubectl -n kms apply -f job_service.yaml

# Configure ingress rule
kubectl apply -f ingress.yaml

echo "Deployment complete."

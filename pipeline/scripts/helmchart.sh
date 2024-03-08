#! /bin/bash

aws eks --region us-west-2 update-kubeconfig --name my-eks-cluster

helm -n kms upgrade --install --create-namespace kms ./KMS-generic-helm-charts/ -f ./kms_helm_values.yaml

kubectl -n kms exec -it kms-kms-generic-helm-charts-indexer-xyz-abc -- bash

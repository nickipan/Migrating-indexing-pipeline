output "public_ip" {
  value = module.eks.cluster_endpoint
}

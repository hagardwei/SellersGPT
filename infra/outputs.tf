output "droplet_ip" {
  value = digitalocean_droplet.app.ipv4_address
}

output "registry_url" {
  value = digitalocean_container_registry.registry.endpoint
}

output "db_host" {
  value = digitalocean_database_cluster.postgres.host
}

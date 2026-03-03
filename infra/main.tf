terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
    }
  }
}

provider "digitalocean" {
  token = var.DO_API_TOKEN
}

# Container Registry
resource "digitalocean_container_registry" "registry" {
  name                   = var.registry_name
  subscription_tier_slug = "basic"
}

# Managed PostgreSQL
resource "digitalocean_database_cluster" "postgres" {
  name       = "app-db"
  engine     = "pg"
  version    = "15"
  size       = "db-s-1vcpu-1gb"
  region     = "blr1"
  node_count = 1
}

# Droplet
resource "digitalocean_droplet" "app" {
  name   = "nextjs-app"
  region = "blr1"
  size   = "s-2vcpu-4gb"
  image  = "docker-20-04"
  ssh_keys = [var.ssh_fingerprint]

  user_data = templatefile("${path.module}/cloud-init.yaml", {
    registry_url = digitalocean_container_registry.registry.endpoint
  })
}

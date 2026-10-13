variable "REGISTRY" {
  default = "ghcr.io"
}

variable "IMAGE_NAME" {
  default = "techarohq/botstopper-www"
}

variable "TAG" {
  default = "latest"
}

group "default" {
  targets = ["www"]
}

target "www" {
  dockerfile = "Dockerfile"
  context = "."
  
  tags = [
    "${REGISTRY}/${IMAGE_NAME}:${TAG}",
    "${REGISTRY}/${IMAGE_NAME}:latest"
  ]
  
  platforms = [
    "linux/amd64",
    // "linux/arm64"
  ]
  
  # Output configuration
  output = ["type=registry,push=true"]
  
  # Build context
  contexts = {
    # Use current directory as build context
  }
}

# Development target (no push)
target "www-dev" {
  inherits = ["www"]
  
  tags = [
    "${REGISTRY}/${IMAGE_NAME}:dev"
  ]
  
  output = ["type=docker"]
}
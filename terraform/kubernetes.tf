# Kubernetes Provider Configuration
provider "kubernetes" {
  host                   = azurerm_kubernetes_cluster.main.kube_config.0.host
  client_certificate     = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    host                   = azurerm_kubernetes_cluster.main.kube_config.0.host
    client_certificate     = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.client_certificate)
    client_key             = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.cluster_ca_certificate)
  }
}

# KEDA Installation
resource "helm_release" "keda" {
  name       = "keda"
  repository = "https://kedacore.github.io/charts"
  chart      = "keda"
  namespace  = "keda"
  create_namespace = true

  set {
    name  = "watchNamespace"
    value = ""
  }
}

# Namespace para a aplicação
resource "kubernetes_namespace" "app" {
  metadata {
    name = "agent-ai"
  }
}

# ConfigMap para configurações da aplicação
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    "COSMOSDB_ENDPOINT" = azurerm_cosmosdb_account.main.endpoint
    "REDIS_HOST"        = azurerm_redis_cache.main.hostname
    "REDIS_PORT"        = "6380"
    "OPENAI_ENDPOINT"   = azurerm_cognitive_account.openai.endpoint
    "EVENTHUB_NAMESPACE" = azurerm_eventhub_namespace.main.name
    "ENVIRONMENT"       = var.environment
  }
}

# Secret para credenciais
resource "kubernetes_secret" "app_secrets" {
  metadata {
    name      = "app-secrets"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    "COSMOSDB_KEY" = azurerm_cosmosdb_account.main.primary_key
    "REDIS_PASSWORD" = azurerm_redis_cache.main.primary_access_key
    "OPENAI_API_KEY" = azurerm_cognitive_account.openai.primary_access_key
  }

  type = "Opaque"
}

# Deployment para Process App
resource "kubernetes_deployment" "process_app" {
  metadata {
    name      = "process-app"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "process-app"
      }
    }

    template {
      metadata {
        labels = {
          app = "process-app"
        }
      }

      spec {
        container {
          image = "your-registry/process-app:latest"
          name  = "process-app"

          port {
            container_port = 3000
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app_config.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.app_secrets.metadata[0].name
            }
          }

          resources {
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "256Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 3000
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }

          readiness_probe {
            http_get {
              path = "/ready"
              port = 3000
            }
            initial_delay_seconds = 5
            period_seconds        = 5
          }
        }
      }
    }
  }
}

# Deployment para Chat API
resource "kubernetes_deployment" "chat_api" {
  metadata {
    name      = "chat-api"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        app = "chat-api"
      }
    }

    template {
      metadata {
        labels = {
          app = "chat-api"
        }
      }

      spec {
        container {
          image = "your-registry/chat-api:latest"
          name  = "chat-api"

          port {
            container_port = 8080
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app_config.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.app_secrets.metadata[0].name
            }
          }

          resources {
            limits = {
              cpu    = "1000m"
              memory = "1Gi"
            }
            requests = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 8080
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }

          readiness_probe {
            http_get {
              path = "/ready"
              port = 8080
            }
            initial_delay_seconds = 5
            period_seconds        = 5
          }
        }
      }
    }
  }
}

# Deployment para Agent Chat
resource "kubernetes_deployment" "agent_chat" {
  metadata {
    name      = "agent-chat"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "agent-chat"
      }
    }

    template {
      metadata {
        labels = {
          app = "agent-chat"
        }
      }

      spec {
        container {
          image = "your-registry/agent-chat:latest"
          name  = "agent-chat"

          port {
            container_port = 8080
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app_config.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.app_secrets.metadata[0].name
            }
          }

          env {
            name  = "REDIS_TTL"
            value = "3600"
          }

          env {
            name  = "LLM_TIMEOUT"
            value = "30000"
          }

          resources {
            limits = {
              cpu    = "2000m"
              memory = "2Gi"
            }
            requests = {
              cpu    = "1000m"
              memory = "1Gi"
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 8080
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }

          readiness_probe {
            http_get {
              path = "/ready"
              port = 8080
            }
            initial_delay_seconds = 5
            period_seconds        = 5
          }
        }
      }
    }
  }
}

# Deployment para Tools
resource "kubernetes_deployment" "tools" {
  metadata {
    name      = "tools"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "tools"
      }
    }

    template {
      metadata {
        labels = {
          app = "tools"
        }
      }

      spec {
        container {
          image = "your-registry/tools:latest"
          name  = "tools"

          port {
            container_port = 8080
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app_config.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.app_secrets.metadata[0].name
            }
          }

          resources {
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "256Mi"
            }
          }
        }
      }
    }
  }
}

# Services
resource "kubernetes_service" "chat_api" {
  metadata {
    name      = "chat-api-service"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  spec {
    selector = {
      app = "chat-api"
    }

    port {
      port        = 80
      target_port = 8080
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_service" "agent_chat" {
  metadata {
    name      = "agent-chat-service"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  spec {
    selector = {
      app = "agent-chat"
    }

    port {
      port        = 80
      target_port = 8080
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_service" "tools" {
  metadata {
    name      = "tools-service"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  spec {
    selector = {
      app = "tools"
    }

    port {
      port        = 80
      target_port = 8080
    }

    type = "ClusterIP"
  }
}

# KEDA ScaledObject para Chat API
resource "kubernetes_manifest" "chat_api_scaled_object" {
  manifest = {
    apiVersion = "keda.sh/v1alpha1"
    kind       = "ScaledObject"
    metadata = {
      name      = "chat-api-scaler"
      namespace = kubernetes_namespace.app.metadata[0].name
    }
    spec = {
      scaleTargetRef = {
        name = kubernetes_deployment.chat_api.metadata[0].name
      }
      minReplicaCount = 1
      maxReplicaCount = 10
      triggers = [
        {
          type = "cpu"
          metricType = "Utilization"
          metadata = {
            type  = "Utilization"
            value = "70"
          }
        },
        {
          type = "memory"
          metricType = "Utilization"
          metadata = {
            type  = "Utilization"
            value = "80"
          }
        }
      ]
    }
  }

  depends_on = [helm_release.keda]
}

# KEDA ScaledObject para Agent Chat
resource "kubernetes_manifest" "agent_chat_scaled_object" {
  manifest = {
    apiVersion = "keda.sh/v1alpha1"
    kind       = "ScaledObject"
    metadata = {
      name      = "agent-chat-scaler"
      namespace = kubernetes_namespace.app.metadata[0].name
    }
    spec = {
      scaleTargetRef = {
        name = kubernetes_deployment.agent_chat.metadata[0].name
      }
      minReplicaCount = 1
      maxReplicaCount = 5
      triggers = [
        {
          type = "cpu"
          metricType = "Utilization"
          metadata = {
            type  = "Utilization"
            value = "70"
          }
        },
        {
          type = "memory"
          metricType = "Utilization"
          metadata = {
            type  = "Utilization"
            value = "80"
          }
        }
      ]
    }
  }

  depends_on = [helm_release.keda]
}

# Ingress para roteamento
resource "kubernetes_ingress_v1" "main" {
  metadata {
    name      = "agent-ai-ingress"
    namespace = kubernetes_namespace.app.metadata[0].name
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "nginx.ingress.kubernetes.io/rewrite-target" = "/"
    }
  }

  spec {
    rule {
      host = "api.agent-ai.com"
      http {
        path {
          path      = "/chat"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service.chat_api.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
        path {
          path      = "/agent"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service.agent_chat.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
        path {
          path      = "/tools"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service.tools.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }
} 
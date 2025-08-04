terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Variáveis
variable "resource_group_name" {
  description = "Nome do Resource Group"
  type        = string
  default     = "rg-agent-ai"
}

variable "location" {
  description = "Localização dos recursos"
  type        = string
  default     = "Brazil South"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "AI-Agent-System"
  }
}

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "vnet-agent-ai"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  address_space       = ["10.0.0.0/16"]

  tags = {
    Environment = var.environment
  }
}

# Subnets
resource "azurerm_subnet" "app_gateway" {
  name                 = "snet-appgateway"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "aks" {
  name                 = "snet-aks"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}

# Application Gateway
resource "azurerm_public_ip" "app_gateway" {
  name                = "pip-appgateway"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = {
    Environment = var.environment
  }
}

resource "azurerm_application_gateway" "main" {
  name                = "appgw-agent-ai"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "gateway-ip-configuration"
    subnet_id = azurerm_subnet.app_gateway.id
  }

  frontend_port {
    name = "http-port"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "frontend-ip-configuration"
    public_ip_address_id = azurerm_public_ip.app_gateway.id
  }

  backend_address_pool {
    name = "backend-pool"
  }

  backend_http_settings {
    name                  = "http-settings"
    cookie_based_affinity = "Disabled"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 60
  }

  http_listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "frontend-ip-configuration"
    frontend_port_name             = "http-port"
    protocol                       = "Http"
  }

  request_routing_rule {
    name                       = "routing-rule"
    rule_type                  = "Basic"
    http_listener_name         = "http-listener"
    backend_address_pool_name  = "backend-pool"
    backend_http_settings_name = "http-settings"
    priority                   = 100
  }

  tags = {
    Environment = var.environment
  }
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "main" {
  name                = "aks-agent-ai"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "aks-agent-ai"

  default_node_pool {
    name       = "default"
    node_count = 3
    vm_size    = "Standard_D2s_v3"
    vnet_subnet_id = azurerm_subnet.aks.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    network_policy = "azure"
  }

  tags = {
    Environment = var.environment
  }
}

# CosmosDB Account
resource "azurerm_cosmosdb_account" "main" {
  name                = "cosmos-agent-ai"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  enable_automatic_failover = true

  capabilities {
    name = "EnableAggregationPipeline"
  }

  capabilities {
    name = "mongoEnableDocLevelTTL"
  }

  capabilities {
    name = "MongoDBv3.4"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  tags = {
    Environment = var.environment
  }
}

# CosmosDB Database
resource "azurerm_cosmosdb_sql_database" "main" {
  name                = "chat-database"
  resource_group_name = azurerm_cosmosdb_account.main.resource_group_name
  account_name        = azurerm_cosmosdb_account.main.name
}

# CosmosDB Container
resource "azurerm_cosmosdb_sql_container" "chat_messages" {
  name                  = "chat-messages"
  resource_group_name   = azurerm_cosmosdb_account.main.resource_group_name
  account_name          = azurerm_cosmosdb_account.main.name
  database_name         = azurerm_cosmosdb_sql_database.main.name
  partition_key_path    = "/userId"
  partition_key_version = 1
}

# Redis Cache
resource "azurerm_redis_cache" "main" {
  name                = "redis-agent-ai"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  capacity            = 1
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false

  redis_configuration {
    maxmemory_reserved = 2
    maxmemory_delta    = 2
    maxmemory_policy   = "volatile-lru"
  }

  tags = {
    Environment = var.environment
  }
}

# Azure OpenAI Service
resource "azurerm_cognitive_account" "openai" {
  name                = "openai-agent-ai"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  kind                = "OpenAI"
  sku_name            = "S0"

  tags = {
    Environment = var.environment
  }
}

# Event Hub Namespace
resource "azurerm_eventhub_namespace" "main" {
  name                = "eventhub-agent-ai"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "Standard"
  capacity            = 1

  tags = {
    Environment = var.environment
  }
}

# Event Hub
resource "azurerm_eventhub" "main" {
  name                = "chat-events"
  namespace_name      = azurerm_eventhub_namespace.main.name
  resource_group_name = azurerm_resource_group.main.name
  partition_count     = 2
  message_retention   = 1
}

# Azure Function App (Change Feed)
resource "azurerm_storage_account" "function" {
  name                     = "stfuncagentai"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "function" {
  name                = "asp-agent-ai"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "change_feed" {
  name                       = "func-change-feed"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  service_plan_id            = azurerm_service_plan.function.id
  storage_account_name       = azurerm_storage_account.function.name
  storage_account_access_key = azurerm_storage_account.function.primary_access_key

  site_config {
    application_stack {
      node_version = "18"
    }
  }

  app_settings = {
    "COSMOSDB_ENDPOINT" = azurerm_cosmosdb_account.main.endpoint
    "COSMOSDB_KEY"      = azurerm_cosmosdb_account.main.primary_key
    "EVENTHUB_CONNECTION_STRING" = azurerm_eventhub_namespace.main.default_primary_connection_string
  }

  tags = {
    Environment = var.environment
  }
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "appi-agent-ai"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"

  tags = {
    Environment = var.environment
  }
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "law-agent-ai"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    Environment = var.environment
  }
}

# Outputs
output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.main.name
}

output "application_gateway_public_ip" {
  value = azurerm_public_ip.app_gateway.ip_address
}

output "cosmosdb_endpoint" {
  value = azurerm_cosmosdb_account.main.endpoint
}

output "redis_hostname" {
  value = azurerm_redis_cache.main.hostname
}

output "openai_endpoint" {
  value = azurerm_cognitive_account.openai.endpoint
}

output "eventhub_namespace" {
  value = azurerm_eventhub_namespace.main.name
} 
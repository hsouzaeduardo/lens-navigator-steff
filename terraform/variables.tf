# Variáveis principais
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

# Variáveis de rede
variable "vnet_address_space" {
  description = "Address space da Virtual Network"
  type        = string
  default     = "10.0.0.0/16"
}

variable "aks_node_count" {
  description = "Número de nós do AKS"
  type        = number
  default     = 3
}

variable "aks_vm_size" {
  description = "Tamanho da VM dos nós do AKS"
  type        = string
  default     = "Standard_D2s_v3"
}

# Variáveis de aplicação
variable "app_replicas" {
  description = "Número de réplicas dos deployments"
  type = object({
    process_app = number
    chat_api    = number
    agent_chat  = number
    tools       = number
  })
  default = {
    process_app = 2
    chat_api    = 3
    agent_chat  = 2
    tools       = 1
  }
}

variable "container_registry" {
  description = "Registry dos containers"
  type        = string
  default     = "your-registry"
}

variable "container_tags" {
  description = "Tags dos containers"
  type = object({
    process_app = string
    chat_api    = string
    agent_chat  = string
    tools       = string
  })
  default = {
    process_app = "latest"
    chat_api    = "latest"
    agent_chat  = "latest"
    tools       = "latest"
  }
}

# Variáveis de monitoramento
variable "enable_monitoring" {
  description = "Habilitar monitoramento"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "Dias de retenção dos logs"
  type        = number
  default     = 30
}

# Variáveis de escalabilidade
variable "keda_enabled" {
  description = "Habilitar KEDA"
  type        = bool
  default     = true
}

variable "scaling_config" {
  description = "Configuração de escalabilidade"
  type = object({
    min_replicas = number
    max_replicas = number
    cpu_threshold = number
    memory_threshold = number
  })
  default = {
    min_replicas = 1
    max_replicas = 10
    cpu_threshold = 70
    memory_threshold = 80
  }
}

# Variáveis de segurança
variable "enable_private_endpoints" {
  description = "Habilitar Private Endpoints"
  type        = bool
  default     = false
}

variable "enable_network_policies" {
  description = "Habilitar Network Policies"
  type        = bool
  default     = true
}

# Variáveis de backup
variable "enable_backup" {
  description = "Habilitar backup"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Dias de retenção do backup"
  type        = number
  default     = 7
}

# Variáveis de custo
variable "cost_center" {
  description = "Centro de custo"
  type        = string
  default     = "AI-Agent"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "AI-Agent-System"
}

# Tags padrão
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    CostCenter  = var.cost_center
    ManagedBy   = "Terraform"
    CreatedAt   = timestamp()
  }
} 
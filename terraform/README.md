# 🏗️ Infraestrutura Azure - AI Agent System

Este projeto implementa a arquitetura completa mostrada no diagrama usando Terraform, incluindo todos os componentes necessários para um sistema de IA com escalabilidade automática.

## 📋 Arquitetura Implementada

### **Componentes Principais:**

1. **🔄 Application Gateway** - Load balancer e roteamento
2. **☁️ API Gateway** - Gerenciamento de APIs
3. **🐳 Kubernetes (AKS)** - Orquestração de containers
4. **💬 Agent Chat** - Serviço principal de IA
5. **📡 Chat API** - API de comunicação
6. **⚙️ Process App** - Processamento de dados
7. **🛠️ Tools** - Serviços utilitários
8. **🗄️ CosmosDB** - Banco de dados NoSQL
9. **⚡ Redis** - Cache em memória
10. **🤖 Azure OpenAI** - Serviço de IA
11. **📨 Event Hub** - Mensageria
12. **🔧 Function Change Feed** - Processamento de eventos
13. **📊 KEDA** - Escalabilidade automática
14. **📈 Application Insights** - Monitoramento

## 🚀 Como Usar

### **Pré-requisitos:**

1. **Azure CLI** instalado e configurado
2. **Terraform** >= 1.0
3. **kubectl** para gerenciar Kubernetes
4. **Helm** para instalar KEDA

### **1. Configuração Inicial:**

```bash
# Login no Azure
az login

# Definir subscription (se necessário)
az account set --subscription "your-subscription-id"

# Navegar para a pasta do Terraform
cd terraform
```

### **2. Inicializar Terraform:**

```bash
# Inicializar
terraform init

# Verificar plano
terraform plan
```

### **3. Aplicar Infraestrutura:**

```bash
# Aplicar (criar recursos)
terraform apply

# Confirmar com 'yes'
```

### **4. Configurar Kubernetes:**

```bash
# Obter credenciais do AKS
az aks get-credentials --resource-group rg-agent-ai --name aks-agent-ai

# Verificar conexão
kubectl get nodes
```

### **5. Verificar Deployments:**

```bash
# Verificar namespace
kubectl get namespace agent-ai

# Verificar deployments
kubectl get deployments -n agent-ai

# Verificar pods
kubectl get pods -n agent-ai

# Verificar serviços
kubectl get services -n agent-ai
```

## 📁 Estrutura dos Arquivos

```
terraform/
├── main.tf              # Recursos principais do Azure
├── kubernetes.tf        # Configurações do Kubernetes
├── variables.tf         # Variáveis e configurações
├── outputs.tf          # Outputs e informações
└── README.md           # Esta documentação
```

## 🔧 Configurações

### **Variáveis Principais:**

```hcl
# Ambiente
environment = "dev"  # dev, staging, prod

# Localização
location = "Brazil South"

# Escalabilidade
app_replicas = {
  process_app = 2
  chat_api    = 3
  agent_chat  = 2
  tools       = 1
}

# KEDA
scaling_config = {
  min_replicas = 1
  max_replicas = 10
  cpu_threshold = 70
  memory_threshold = 80
}
```

### **Personalizar Configurações:**

1. **Editar `variables.tf`** para ajustar valores padrão
2. **Criar `terraform.tfvars`** para sobrescrever valores:

```hcl
# terraform.tfvars
environment = "prod"
location = "East US"
aks_node_count = 5
```

## 🔄 Fluxo de Dados

### **1. Entrada do Usuário:**
```
Usuário → Application Gateway → API Gateway → Kubernetes Services
```

### **2. Processamento:**
```
Chat API → Agent Chat → Redis (cache) → OpenAI → CosmosDB
```

### **3. Eventos:**
```
CosmosDB → Function Change Feed → Event Hub → Process App
```

### **4. Escalabilidade:**
```
KEDA → Monitora CPU/Memory → Escala automaticamente
```

## 📊 Monitoramento

### **Application Insights:**
- Métricas de performance
- Logs de aplicação
- Alertas automáticos

### **Log Analytics:**
- Centralização de logs
- Queries personalizadas
- Dashboards

### **KEDA Metrics:**
- CPU utilization
- Memory usage
- Custom metrics

## 🔒 Segurança

### **Implementado:**
- ✅ Network Security Groups
- ✅ Private Subnets
- ✅ SSL/TLS encryption
- ✅ Secrets management

### **Recomendado:**
- 🔐 Azure Key Vault
- 🔐 Private Endpoints
- 🔐 Azure Security Center
- 🔐 Backup automático

## 💰 Custos Estimados

| Serviço | Custo Mensal |
|---------|-------------|
| AKS Cluster | $300-500 |
| CosmosDB | $100-200 |
| Redis Cache | $50-100 |
| Azure OpenAI | $200-500 |
| Application Gateway | $100-200 |
| Monitoramento | $50-100 |
| **Total** | **$800-1600** |

## 🚨 Troubleshooting

### **Problemas Comuns:**

1. **AKS não conecta:**
```bash
az aks get-credentials --resource-group rg-agent-ai --name aks-agent-ai --overwrite-existing
```

2. **Pods não iniciam:**
```bash
kubectl describe pod <pod-name> -n agent-ai
kubectl logs <pod-name> -n agent-ai
```

3. **KEDA não escala:**
```bash
kubectl get scaledobjects -n agent-ai
kubectl describe scaledobject chat-api-scaler -n agent-ai
```

4. **CosmosDB não conecta:**
```bash
# Verificar connection string
terraform output cosmosdb_endpoint
terraform output cosmosdb_primary_key
```

### **Logs Importantes:**

```bash
# Logs do Agent Chat
kubectl logs -f deployment/agent-chat -n agent-ai

# Logs do Chat API
kubectl logs -f deployment/chat-api -n agent-ai

# Métricas do KEDA
kubectl get hpa -n agent-ai
```

## 🧹 Limpeza

### **Destruir Infraestrutura:**

```bash
# Destruir recursos
terraform destroy

# Confirmar com 'yes'
```

**⚠️ Atenção:** Isso irá deletar TODOS os recursos criados!

## 📞 Suporte

### **Para problemas:**

1. Verifique os logs do Terraform
2. Consulte a documentação do Azure
3. Verifique os status dos recursos no portal Azure
4. Use `terraform plan` para verificar mudanças

### **Recursos Úteis:**

- [Azure Terraform Provider](https://registry.terraform.io/providers/hashicorp/azurerm)
- [AKS Documentation](https://docs.microsoft.com/en-us/azure/aks/)
- [KEDA Documentation](https://keda.sh/)
- [CosmosDB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)

---

**🎯 Arquitetura implementada com sucesso!** 

O sistema está pronto para processar requisições de IA com escalabilidade automática, cache inteligente e monitoramento completo. 
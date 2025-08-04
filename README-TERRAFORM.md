# 🏗️ AI Agent System - Infraestrutura Azure com Terraform

Este projeto implementa a arquitetura completa mostrada no diagrama usando **Terraform** e **Azure**, criando uma infraestrutura escalável e robusta para um sistema de IA com processamento de chat inteligente.

## 🎯 Visão Geral da Arquitetura

A infraestrutura implementada segue exatamente o diagrama fornecido, incluindo:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   API Gateway   │    │   Kubernetes    │
│     Gateway     │───▶│   (Azure API    │───▶│   (AKS)         │
│                 │    │   Management)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CosmosDB      │    │   Event Hub     │    │   Agent Chat    │
│   (Database)    │◀───│   (Messaging)   │◀───│   (AI Service)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Function      │    │   Redis Cache   │    │   Azure OpenAI  │
│   Change Feed   │    │   (In-Memory)   │    │   (LLM)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Componentes Implementados

### **1. Rede e Load Balancing**
- ✅ **Application Gateway** - Load balancer com SSL termination
- ✅ **Virtual Network** - Rede isolada com subnets
- ✅ **Network Security Groups** - Controle de tráfego

### **2. Orquestração**
- ✅ **Azure Kubernetes Service (AKS)** - Cluster Kubernetes gerenciado
- ✅ **KEDA** - Escalabilidade automática baseada em eventos
- ✅ **Helm Charts** - Gerenciamento de aplicações

### **3. Serviços de Aplicação**
- ✅ **Agent Chat** - Serviço principal de IA (2 réplicas)
- ✅ **Chat API** - API de comunicação (3 réplicas)
- ✅ **Process App** - Processamento de dados (2 réplicas)
- ✅ **Tools** - Serviços utilitários (1 réplica)

### **4. Armazenamento e Cache**
- ✅ **Azure CosmosDB** - Banco de dados NoSQL global
- ✅ **Azure Redis Cache** - Cache em memória
- ✅ **Azure Storage** - Armazenamento para Functions

### **5. IA e Processamento**
- ✅ **Azure OpenAI** - Serviço de Large Language Models
- ✅ **Azure Functions** - Processamento serverless
- ✅ **Event Hub** - Mensageria assíncrona

### **6. Monitoramento**
- ✅ **Application Insights** - Telemetria e logs
- ✅ **Log Analytics** - Centralização de logs
- ✅ **Azure Monitor** - Métricas e alertas

## 📁 Estrutura do Projeto

```
terraform/
├── main.tf                    # Recursos principais do Azure
├── kubernetes.tf              # Configurações do Kubernetes
├── variables.tf               # Variáveis e configurações
├── outputs.tf                 # Outputs e informações
├── deploy.sh                  # Script de deploy automatizado
├── terraform.tfvars.example   # Exemplo de variáveis
├── .gitignore                 # Arquivos ignorados pelo Git
└── README.md                  # Documentação detalhada
```

## 🛠️ Pré-requisitos

### **Ferramentas Necessárias:**
1. **Azure CLI** - [Instalar](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
2. **Terraform** >= 1.0 - [Instalar](https://www.terraform.io/downloads.html)
3. **kubectl** - [Instalar](https://kubernetes.io/docs/tasks/tools/)
4. **Helm** - [Instalar](https://helm.sh/docs/intro/install/)
5. **jq** - Para processamento JSON (opcional)

### **Conta Azure:**
- Subscription ativa
- Permissões de Owner/Contributor
- Registro de providers habilitado

## 🚀 Deploy Rápido

### **1. Clone e Configure:**
```bash
# Navegar para a pasta do Terraform
cd terraform

# Copiar arquivo de exemplo
cp terraform.tfvars.example terraform.tfvars

# Editar variáveis (opcional)
nano terraform.tfvars
```

### **2. Deploy Automatizado:**
```bash
# Tornar script executável
chmod +x deploy.sh

# Executar deploy completo
./deploy.sh
```

### **3. Deploy Manual:**
```bash
# Login no Azure
az login

# Inicializar Terraform
terraform init

# Verificar plano
terraform plan

# Aplicar infraestrutura
terraform apply
```

## 🔧 Configurações

### **Ambientes Disponíveis:**

#### **Desenvolvimento (dev):**
```hcl
environment = "dev"
aks_node_count = 1
aks_vm_size = "Standard_B2s"
app_replicas = {
  process_app = 1
  chat_api    = 1
  agent_chat  = 1
  tools       = 1
}
```

#### **Produção (prod):**
```hcl
environment = "prod"
aks_node_count = 5
aks_vm_size = "Standard_D4s_v3"
app_replicas = {
  process_app = 3
  chat_api    = 5
  agent_chat  = 3
  tools       = 2
}
```

### **Escalabilidade com KEDA:**
```hcl
scaling_config = {
  min_replicas = 1
  max_replicas = 10
  cpu_threshold = 70
  memory_threshold = 80
}
```

## 📊 Monitoramento e Observabilidade

### **Métricas Disponíveis:**
- ✅ CPU e Memory utilization
- ✅ Request/Response times
- ✅ Error rates
- ✅ Throughput
- ✅ Custom metrics

### **Logs Centralizados:**
- ✅ Application logs
- ✅ System logs
- ✅ Security logs
- ✅ Performance logs

### **Alertas Automáticos:**
- ✅ High CPU/Memory usage
- ✅ Service unavailability
- ✅ Error rate thresholds
- ✅ Cost alerts

## 🔒 Segurança

### **Implementado:**
- ✅ Network Security Groups
- ✅ Private subnets
- ✅ SSL/TLS encryption
- ✅ Secrets management
- ✅ RBAC (Role-Based Access Control)

### **Recomendado:**
- 🔐 Azure Key Vault
- 🔐 Private Endpoints
- 🔐 Azure Security Center
- 🔐 Backup automático

## 💰 Custos Estimados

| Serviço | Dev | Staging | Prod |
|---------|-----|---------|------|
| AKS Cluster | $50-100 | $200-300 | $300-500 |
| CosmosDB | $25-50 | $75-100 | $100-200 |
| Redis Cache | $15-30 | $40-60 | $50-100 |
| Azure OpenAI | $50-200 | $150-300 | $200-500 |
| Application Gateway | $25-50 | $75-100 | $100-200 |
| Monitoramento | $10-25 | $30-50 | $50-100 |
| **Total** | **$175-455** | **$570-910** | **$800-1600** |

## 🔄 Fluxo de Dados

### **1. Entrada do Usuário:**
```
Usuário → Application Gateway → API Gateway → Kubernetes Services
```

### **2. Processamento Principal:**
```
Chat API → Agent Chat → Redis (cache) → OpenAI → CosmosDB
```

### **3. Eventos e Notificações:**
```
CosmosDB → Function Change Feed → Event Hub → Process App
```

### **4. Escalabilidade Automática:**
```
KEDA → Monitora métricas → Escala pods automaticamente
```

## 🚨 Troubleshooting

### **Problemas Comuns:**

#### **1. AKS não conecta:**
```bash
az aks get-credentials --resource-group rg-agent-ai --name aks-agent-ai --overwrite-existing
```

#### **2. Pods não iniciam:**
```bash
kubectl describe pod <pod-name> -n agent-ai
kubectl logs <pod-name> -n agent-ai
```

#### **3. KEDA não escala:**
```bash
kubectl get scaledobjects -n agent-ai
kubectl describe scaledobject chat-api-scaler -n agent-ai
```

#### **4. CosmosDB não conecta:**
```bash
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
# Usando script
./deploy.sh --destroy

# Ou manualmente
terraform destroy
```

**⚠️ Atenção:** Isso irá deletar TODOS os recursos criados!

## 📞 Suporte e Recursos

### **Documentação:**
- [Azure Terraform Provider](https://registry.terraform.io/providers/hashicorp/azurerm)
- [AKS Documentation](https://docs.microsoft.com/en-us/azure/aks/)
- [KEDA Documentation](https://keda.sh/)
- [CosmosDB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)

### **Comandos Úteis:**
```bash
# Verificar status
terraform show
terraform output

# Verificar recursos no Azure
az resource list --resource-group rg-agent-ai

# Verificar cluster AKS
az aks show --resource-group rg-agent-ai --name aks-agent-ai
```

## 🎯 Próximos Passos

1. **Configure o DNS** para `api.agent-ai.com`
2. **Deploy das aplicações** usando `kubectl apply -f k8s/`
3. **Configure variáveis de ambiente** nos deployments
4. **Monitore os logs** e métricas
5. **Configure alertas** para produção
6. **Implemente backup** automático
7. **Configure CI/CD** pipeline

---

**🎉 Infraestrutura implementada com sucesso!**

O sistema está pronto para processar requisições de IA com escalabilidade automática, cache inteligente e monitoramento completo, seguindo exatamente a arquitetura especificada no diagrama. 
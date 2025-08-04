#!/bin/bash

# 🚀 Script de Deploy - AI Agent System
# Este script automatiza o deploy da infraestrutura completa

set -e  # Para em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Verificar pré-requisitos
check_prerequisites() {
    log "Verificando pré-requisitos..."
    
    # Verificar Azure CLI
    if ! command -v az &> /dev/null; then
        error "Azure CLI não encontrado. Instale em: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    fi
    
    # Verificar Terraform
    if ! command -v terraform &> /dev/null; then
        error "Terraform não encontrado. Instale em: https://www.terraform.io/downloads.html"
    fi
    
    # Verificar kubectl
    if ! command -v kubectl &> /dev/null; then
        error "kubectl não encontrado. Instale em: https://kubernetes.io/docs/tasks/tools/"
    fi
    
    # Verificar Helm
    if ! command -v helm &> /dev/null; then
        error "Helm não encontrado. Instale em: https://helm.sh/docs/intro/install/"
    fi
    
    log "✅ Todos os pré-requisitos atendidos"
}

# Login no Azure
azure_login() {
    log "Fazendo login no Azure..."
    
    if ! az account show &> /dev/null; then
        az login
    else
        info "Já logado no Azure"
    fi
    
    # Mostrar subscription atual
    SUBSCRIPTION=$(az account show --query name -o tsv)
    log "Subscription atual: $SUBSCRIPTION"
}

# Inicializar Terraform
init_terraform() {
    log "Inicializando Terraform..."
    
    if [ ! -d ".terraform" ]; then
        terraform init
    else
        info "Terraform já inicializado"
    fi
}

# Validar configuração
validate_terraform() {
    log "Validando configuração do Terraform..."
    terraform validate
    log "✅ Configuração válida"
}

# Aplicar infraestrutura
apply_infrastructure() {
    log "Aplicando infraestrutura..."
    
    # Fazer plan primeiro
    log "Executando terraform plan..."
    terraform plan -out=tfplan
    
    # Perguntar confirmação
    echo
    read -p "Deseja aplicar esta configuração? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Aplicando configuração..."
        terraform apply tfplan
        log "✅ Infraestrutura aplicada com sucesso"
    else
        warn "Deploy cancelado pelo usuário"
        exit 0
    fi
}

# Configurar Kubernetes
setup_kubernetes() {
    log "Configurando Kubernetes..."
    
    # Obter credenciais do AKS
    RESOURCE_GROUP=$(terraform output -raw resource_group_name)
    CLUSTER_NAME=$(terraform output -raw aks_cluster_name)
    
    log "Obtendo credenciais do cluster: $CLUSTER_NAME"
    az aks get-credentials --resource-group "$RESOURCE_GROUP" --name "$CLUSTER_NAME" --overwrite-existing
    
    # Verificar conexão
    log "Verificando conexão com o cluster..."
    kubectl get nodes
    
    log "✅ Kubernetes configurado"
}

# Verificar deployments
check_deployments() {
    log "Verificando deployments..."
    
    NAMESPACE="agent-ai"
    
    # Aguardar namespace estar pronto
    log "Aguardando namespace estar pronto..."
    kubectl wait --for=condition=Active namespace/$NAMESPACE --timeout=60s
    
    # Verificar deployments
    log "Verificando deployments..."
    kubectl get deployments -n $NAMESPACE
    
    # Verificar pods
    log "Verificando pods..."
    kubectl get pods -n $NAMESPACE
    
    # Verificar serviços
    log "Verificando serviços..."
    kubectl get services -n $NAMESPACE
    
    log "✅ Deployments verificados"
}

# Mostrar informações finais
show_final_info() {
    log "🎉 Deploy concluído com sucesso!"
    echo
    echo "📊 Informações da Infraestrutura:"
    echo "=================================="
    
    # Mostrar outputs importantes
    echo "Resource Group: $(terraform output -raw resource_group_name)"
    echo "AKS Cluster: $(terraform output -raw aks_cluster_name)"
    echo "Application Gateway IP: $(terraform output -raw application_gateway_public_ip)"
    echo "CosmosDB Endpoint: $(terraform output -raw cosmosdb_endpoint)"
    echo "Redis Hostname: $(terraform output -raw redis_hostname)"
    echo "OpenAI Endpoint: $(terraform output -raw openai_endpoint)"
    
    echo
    echo "🔗 Endpoints da API:"
    echo "==================="
    terraform output -json api_endpoints | jq -r 'to_entries[] | "\(.key): \(.value)"'
    
    echo
    echo "💰 Custo Estimado:"
    echo "=================="
    terraform output -json estimated_monthly_cost | jq -r 'to_entries[] | "\(.key): \(.value)"'
    
    echo
    echo "📋 Próximos Passos:"
    echo "==================="
    echo "1. Configure o DNS para api.agent-ai.com"
    echo "2. Deploy das aplicações: kubectl apply -f k8s/"
    echo "3. Configure as variáveis de ambiente"
    echo "4. Monitore os logs: kubectl logs -f deployment/agent-chat -n agent-ai"
    
    echo
    echo "🔍 Comandos Úteis:"
    echo "=================="
    echo "kubectl get pods -n agent-ai"
    echo "kubectl logs -f deployment/agent-chat -n agent-ai"
    echo "kubectl get scaledobjects -n agent-ai"
    echo "terraform output"
}

# Função principal
main() {
    echo "🚀 Iniciando deploy da infraestrutura AI Agent System"
    echo "=================================================="
    echo
    
    # Verificar argumentos
    if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        echo "Uso: $0 [opção]"
        echo "Opções:"
        echo "  --help, -h     Mostrar esta ajuda"
        echo "  --validate     Apenas validar configuração"
        echo "  --plan         Apenas fazer plan"
        echo "  --destroy      Destruir infraestrutura"
        exit 0
    fi
    
    if [ "$1" = "--validate" ]; then
        check_prerequisites
        azure_login
        init_terraform
        validate_terraform
        log "✅ Validação concluída"
        exit 0
    fi
    
    if [ "$1" = "--plan" ]; then
        check_prerequisites
        azure_login
        init_terraform
        validate_terraform
        log "Executando terraform plan..."
        terraform plan
        exit 0
    fi
    
    if [ "$1" = "--destroy" ]; then
        log "⚠️  ATENÇÃO: Isso irá destruir TODA a infraestrutura!"
        read -p "Tem certeza? Digite 'DESTROY' para confirmar: " -r
        if [ "$REPLY" = "DESTROY" ]; then
            terraform destroy
            log "✅ Infraestrutura destruída"
        else
            warn "Operação cancelada"
        fi
        exit 0
    fi
    
    # Deploy completo
    check_prerequisites
    azure_login
    init_terraform
    validate_terraform
    apply_infrastructure
    setup_kubernetes
    check_deployments
    show_final_info
}

# Executar função principal
main "$@" 
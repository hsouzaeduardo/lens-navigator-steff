# 📄 Funcionalidade de Exportação PDF

## 🎯 Visão Geral

A funcionalidade de exportação PDF permite salvar relatórios do Investment Committee em formato PDF para compartilhamento e arquivamento.

## ✨ Funcionalidades Implementadas

### 1. **Exportação Programática**
- Gera PDF estruturado com layout profissional
- Inclui todas as informações do relatório
- Formatação automática de texto e tabelas
- Quebra de página automática

### 2. **Exportação por Captura Visual**
- Fallback que captura o elemento visual como imagem
- Útil quando a exportação programática falha
- Mantém a aparência exata do relatório

### 3. **Preview do PDF**
- Visualização prévia de como ficará o PDF
- Botão para mostrar/ocultar preview
- Layout otimizado para impressão

## 🛠️ Como Usar

### **Passo 1: Completar Análise**
1. Preencha o formulário de análise
2. Aguarde as 4 lentes completarem
3. Visualize o relatório final

### **Passo 2: Exportar PDF**
1. **Opção A**: Clique no botão "Export" no cabeçalho do relatório
2. **Opção B**: Use o componente de preview e clique "Export PDF"

### **Passo 3: Download Automático**
- O arquivo será salvo automaticamente
- Nome do arquivo: `IC_Report_[Empresa]_[Data].pdf`
- Exemplo: `IC_Report_TechStartup_2024-01-15.pdf`

## 📋 Conteúdo do PDF

### **Cabeçalho**
- Título: "AI Investment Committee Report"
- Nome da empresa
- Valuation alvo (se fornecido)
- Data de geração

### **Resumo das Lentes**
- Tabela comparativa das 4 lentes
- Recomendações com cores (Verde/Vermelho)
- Faixas de entrada
- Níveis de convicção
- Sensibilidades-chave

### **Cenários de Valuation**
- 5 cenários: Write-Off, Bear, Base, Bull, Moonshot
- Probabilidades e valores
- Cores diferenciadas por cenário

### **Análise de Consenso**
- Sensibilidade de consenso
- Item de ação recomendado

### **Análises Detalhadas**
- Análise completa de cada lente
- Quebra automática de página
- Formatação otimizada

## 🔧 Dependências

```json
{
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1",
  "@types/jspdf": "^2.0.0"
}
```

## 📁 Arquivos Principais

### **`src/lib/pdf-export.ts`**
- Funções principais de exportação
- `exportToPDF()` - Exportação programática
- `exportToPDFFromElement()` - Exportação por captura

### **`src/components/ICReport.tsx`**
- Componente principal do relatório
- Integração com funcionalidade de exportação
- Estado de loading durante exportação

### **`src/components/PDFPreview.tsx`**
- Preview do PDF antes da exportação
- Layout otimizado para visualização
- Controles de preview e exportação

## 🎨 Personalização

### **Cores do PDF**
```typescript
// Cores das recomendações
const recommendationColors = {
  "Strong Yes": [34, 197, 94],   // Verde
  "Yes": [34, 197, 94],          // Verde
  "No": [239, 68, 68],           // Vermelho
  "Strong No": [239, 68, 68]     // Vermelho
}

// Cores dos cenários
const scenarioColors = [
  [239, 68, 68],   // Write-Off - Vermelho
  [245, 158, 11],  // Bear - Laranja
  [59, 130, 246],  // Base - Azul
  [34, 197, 94],   // Bull - Verde
  [168, 85, 247]   // Moonshot - Roxo
]
```

### **Layout do PDF**
- Tamanho: A4
- Orientação: Portrait
- Margens: 20mm
- Fonte: Helvetica

## 🚀 Melhorias Futuras

### **Funcionalidades Planejadas**
- [ ] Template personalizável
- [ ] Marca d'água da empresa
- [ ] Assinatura digital
- [ ] Compressão de imagens
- [ ] Múltiplos formatos (Word, Excel)

### **Otimizações**
- [ ] Cache de templates
- [ ] Exportação em lote
- [ ] Preview em tempo real
- [ ] Configurações de qualidade

## 🐛 Troubleshooting

### **Erro: "Falha ao gerar PDF"**
1. Verifique se o navegador suporta canvas
2. Tente recarregar a página
3. Use o fallback de captura visual

### **PDF muito grande**
1. Reduza o conteúdo da análise
2. Ajuste a qualidade no html2canvas
3. Use compressão de imagens

### **Problemas de fonte**
1. Verifique se as fontes estão disponíveis
2. Use fontes padrão do sistema
3. Configure fallbacks de fonte

## 📞 Suporte

Para problemas ou sugestões:
1. Verifique os logs do console
2. Teste em diferentes navegadores
3. Reporte bugs com screenshots
4. Inclua informações do sistema

---

**Desenvolvido com ❤️ para o AI Investment Committee** 
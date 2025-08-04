// Configuração das URLs das funções Supabase
export const SUPABASE_CONFIG = {
  // URL base do Supabase
  url: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  
  // Funções
  functions: {
    azureOpenAI: '/functions/v1/azure-openai-analysis'
  }
}

// Função helper para obter URL completa da função
export const getFunctionUrl = (functionPath: string): string => {
  const baseUrl = import.meta.env.DEV 
    ? 'http://localhost:54321' 
    : SUPABASE_CONFIG.url
  
  return `${baseUrl}${functionPath}`
}

// URLs específicas das funções
export const FUNCTION_URLS = {
  azureOpenAI: () => getFunctionUrl(SUPABASE_CONFIG.functions.azureOpenAI)
} 
// Configuração do Azure OpenAI
const AZURE_CONFIG = {
  endpoint: 'https://oai-canarynho-brsouth-dev-001.openai.azure.com',
  deployment: 'gpt-4o-mini',
  apiVersion: '2025-01-01-preview',
  apiKey: '4yFNLK4bxi0ATZibAZzxKodlMU4cgVn9YoX93oEHltWongBtSh4vJQQJ99BHACYeBjFXJ3w3AAABACOGgUMa'
}

interface AnalysisRequest {
  companyName: string
  lens: string
  prompt: string
  files?: string[]
}

interface AnalysisResponse {
  success: boolean
  lens?: string
  analysis?: string
  usage?: any
  error?: string
}

// Função para chamar Azure OpenAI diretamente (para desenvolvimento)
export const callAzureOpenAIDirect = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  try {
    console.log('🚀 Chamando Azure OpenAI diretamente...')
    
    const url = `${AZURE_CONFIG.endpoint}/openai/deployments/${AZURE_CONFIG.deployment}/chat/completions?api-version=${AZURE_CONFIG.apiVersion}`
    
    const payload = {
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: request.prompt
            }
          ]
        },
        {
          role: "user", 
          content: [
            {
              type: "text",
              text: `Please analyze ${request.companyName} according to the instructions provided. Return a comprehensive investment analysis with the following structure:

1. **Investment Recommendation**: Clear Yes/No decision with conviction level
2. **Entry Range**: Specific valuation ranges for investment decision
3. **Key Sensitivity**: Main factor that could change the recommendation
4. **Valuation Scenarios**: 5 scenarios (Write-Off, Bear, Base, Bull, Moonshot) with probabilities and values
5. **Detailed Analysis**: Comprehensive reasoning behind the recommendation

Format the response as structured text, not HTML.`
            }
          ]
        }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 16384
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_CONFIG.apiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro Azure OpenAI:', errorText)
      throw new Error(`Azure OpenAI API call failed: ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    console.log('✅ Resposta Azure OpenAI:', result)

    return {
      success: true,
      lens: request.lens,
      analysis: result.choices[0]?.message?.content || '',
      usage: result.usage
    }

  } catch (error) {
    console.error('💥 Erro na chamada direta:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Função que tenta Supabase primeiro, depois fallback para chamada direta
export const callAzureOpenAI = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  // Primeiro tenta via Supabase
  try {
    const functionUrl = import.meta.env.DEV 
      ? 'http://localhost:54321/functions/v1/azure-openai-analysis'
      : '/functions/v1/azure-openai-analysis'
    
    console.log('🔗 Tentando via Supabase:', functionUrl)
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Sucesso via Supabase')
      return result
    } else {
      console.log('⚠️ Supabase falhou, tentando chamada direta...')
    }
  } catch (error) {
    console.log('⚠️ Erro Supabase, tentando chamada direta:', error.message)
  }

  // Fallback para chamada direta
  console.log('🔄 Usando fallback direto para Azure OpenAI')
  return await callAzureOpenAIDirect(request)
} 
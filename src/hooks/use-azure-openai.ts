import { useState } from 'react'
import { FUNCTION_URLS } from '@/lib/config'
import { callAzureOpenAI } from '@/lib/azure-openai'

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

export const useAzureOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeCompany = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      debugger; // BREAKPOINT AQUI - Remove esta linha quando não precisar mais
      
      const result = await callAzureOpenAI(request)
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    analyzeCompany,
    isLoading,
    error
  }
} 
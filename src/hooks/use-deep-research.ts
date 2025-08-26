import { useState, useCallback, useRef } from 'react'
import {
  startDeepResearch,
  pollDeepResearch,
  cancelDeepResearch,
  createVectorStore,
  listVectorStores,
  type DeepResearchRequest,
  type DeepResearchResponse
} from '@/lib/openai-deep-research'

interface UseDeepResearchReturn {
  // Research operations
  startResearch: (request: DeepResearchRequest) => Promise<void>
  cancelResearch: () => Promise<void>
  
  // Vector store operations
  uploadFiles: (name: string, files: File[]) => Promise<string | null>
  getVectorStores: () => Promise<Array<{ id: string; name: string; file_count: number; created_at: string }>>
  
  // State
  isLoading: boolean
  progress: string
  result: DeepResearchResponse | null
  error: string | null
  vectorStores: Array<{ id: string; name: string; file_count: number; created_at: string }>
}

export const useDeepResearch = (): UseDeepResearchReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<DeepResearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [vectorStores, setVectorStores] = useState<Array<{ id: string; name: string; file_count: number; created_at: string }>>([])
  
  const currentResearchId = useRef<string | null>(null)
  
  // Start a new research task
  const startResearch = useCallback(async (request: DeepResearchRequest) => {
    setIsLoading(true)
    setError(null)
    setProgress('Starting research...')
    setResult(null)
    
    try {
      // Start the research
      const response = await startDeepResearch(request)
      
      if (response.status === 'failed') {
        throw new Error(response.error || 'Failed to start research')
      }
      
      currentResearchId.current = response.id
      setProgress('Research queued, waiting to start...')
      
      // Poll for completion
      const finalResult = await pollDeepResearch(response.id, (status) => {
        switch (status) {
          case 'queued':
            setProgress('Research queued, waiting for available resources...')
            break
          case 'in_progress':
            setProgress('Research in progress, analyzing data...')
            break
          case 'completed':
            setProgress('Research completed!')
            break
          default:
            setProgress(`Status: ${status}`)
        }
      })
      
      if (finalResult.status === 'completed') {
        setResult(finalResult)
        setProgress('Research completed successfully!')
      } else {
        throw new Error(finalResult.error || `Research ${finalResult.status}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setProgress('')
    } finally {
      setIsLoading(false)
      currentResearchId.current = null
    }
  }, [])
  
  // Cancel current research
  const cancelResearch = useCallback(async () => {
    if (currentResearchId.current) {
      const success = await cancelDeepResearch(currentResearchId.current)
      if (success) {
        setIsLoading(false)
        setProgress('Research cancelled')
        currentResearchId.current = null
      }
    }
  }, [])
  
  // Upload files to a new vector store
  const uploadFiles = useCallback(async (name: string, files: File[]) => {
    try {
      setProgress('Uploading files to vector store...')
      const vectorStoreId = await createVectorStore(name, files)
      
      if (vectorStoreId) {
        setProgress('Files uploaded successfully!')
        // Refresh vector stores list
        await getVectorStores()
      }
      
      return vectorStoreId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload files'
      setError(errorMessage)
      return null
    }
  }, [])
  
  // Get list of available vector stores
  const getVectorStores = useCallback(async () => {
    try {
      const stores = await listVectorStores()
      setVectorStores(stores)
      return stores
    } catch (err) {
      console.error('Failed to list vector stores:', err)
      return []
    }
  }, [])
  
  return {
    startResearch,
    cancelResearch,
    uploadFiles,
    getVectorStores,
    isLoading,
    progress,
    result,
    error,
    vectorStores
  }
}

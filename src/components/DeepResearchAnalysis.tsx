import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { FileUpload } from '@/components/ui/file-upload'
import { 
  Search, 
  FileText, 
  Code, 
  Upload, 
  Loader2, 
  XCircle,
  CheckCircle,
  AlertCircle,
  Database,
  ExternalLink,
  Download,
  Brain,
  Eye,
  TrendingUp,
  Calculator,
  Zap
} from 'lucide-react'
import { useDeepResearch } from '@/hooks/use-deep-research'
import { SimplePDFPreview } from './SimplePDFPreview'

interface DeepResearchAnalysisProps {
  companyName?: string
  onComplete?: (analysis: string) => void
}

export const DeepResearchAnalysis: React.FC<DeepResearchAnalysisProps> = ({
  companyName = 'Company',
  onComplete
}) => {
  const {
    startResearch,
    cancelResearch,
    uploadFiles,
    getVectorStores,
    isLoading,
    progress,
    result,
    error,
    vectorStores
  } = useDeepResearch()
  
  const [customQuery, setCustomQuery] = useState('')
  const [useWebSearch, setUseWebSearch] = useState(true)
  const [useCodeInterpreter, setUseCodeInterpreter] = useState(true)
  const [selectedVectorStores, setSelectedVectorStores] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [vectorStoreName, setVectorStoreName] = useState('')
  
  // Load vector stores on mount
  useEffect(() => {
    getVectorStores()
  }, [getVectorStores])
  
  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files)
  }
  
  // Handle file removal
  const handleFileRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  // Create vector store from uploaded files
  const handleCreateVectorStore = async () => {
    if (uploadedFiles.length === 0 || !vectorStoreName) return
    
    const storeId = await uploadFiles(vectorStoreName, uploadedFiles)
    if (storeId) {
      setUploadedFiles([])
      setVectorStoreName('')
    }
  }
  
  // Toggle vector store selection
  const toggleVectorStore = (storeId: string) => {
    setSelectedVectorStores(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    )
  }
  
  // Start deep research
  const handleStartResearch = async () => {
    const query = customQuery || `Provide a comprehensive 4-lens investment analysis for ${companyName}`
    
    try {
      await startResearch({
        query,
        companyName,
        vectorStoreIds: selectedVectorStores,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,  // Pass uploaded files directly
        useWebSearch,
        useCodeInterpreter
      })
    } catch (error) {
      console.error('Failed to start research:', error)
      // The error will be handled by the hook
    }
  }
  
  // Cancel research
  const handleCancelResearch = () => {
    cancelResearch()
  }
  
  // Handle research completion
  useEffect(() => {
    if (result && result.status === 'completed' && result.output && onComplete) {
      onComplete(result.output)
    }
  }, [result, onComplete])
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            4-Lens Deep Research Analysis
          </h2>
        </div>
                 <p className="text-muted-foreground text-lg">
           Single unified prompt analysis using OpenAI's Deep Research API
         </p>
      </div>

      <div className="w-full space-y-6 mt-6">
          {/* 4-Lens Overview */}
          <Card className="border-2 border-gradient-to-r from-blue-100 to-purple-100 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800">4-Lens Analytical Framework</CardTitle>
              <CardDescription>
                Each lens provides a unique perspective for comprehensive investment analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                  <Eye className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-red-800 text-sm">Skeptical</h4>
                  <p className="text-xs text-red-600">Risk & Red Flags</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-orange-800 text-sm">Contrarian</h4>
                  <p className="text-xs text-orange-600">Hidden Insights</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <Zap className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800 text-sm">Optimistic</h4>
                  <p className="text-xs text-green-600">Upside Potential</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Calculator className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-800 text-sm">CFO</h4>
                  <p className="text-xs text-blue-600">Unit Economics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Unified 4-Lens Analysis</span>
              </CardTitle>
              <CardDescription>
                This analysis uses a single, comprehensive prompt that combines all four analytical lenses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customQuery">Custom Query (Optional)</Label>
                <Input
                  id="customQuery"
                  placeholder={`Provide a comprehensive 4-lens investment analysis for ${companyName}`}
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="h-20"
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to use the default unified 4-lens prompt
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="webSearch"
                    checked={useWebSearch}
                    onCheckedChange={(checked) => setUseWebSearch(checked as boolean)}
                  />
                  <Label htmlFor="webSearch">Web Search</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="codeInterpreter"
                    checked={useCodeInterpreter}
                    onCheckedChange={(checked) => setUseCodeInterpreter(checked as boolean)}
                  />
                  <Label htmlFor="codeInterpreter">Code Interpreter</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Company Documents</span>
              </CardTitle>
              <CardDescription>
                Add company documents to be analyzed by the deep research model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Document Analysis</p>
                      <p className="text-xs text-blue-700">
                        The AI will read and analyze the content of uploaded documents to enhance the investment analysis.
                        Upload financial reports, pitch decks, market research, etc.
                      </p>
                    </div>
                  </div>
                </div>
                
                <FileUpload
                  onFileUpload={handleFileUpload}
                  onFileRemove={handleFileRemove}
                  uploadedFiles={uploadedFiles}
                  isUploading={false}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* API Key Check */}
          {!import.meta.env.VITE_OPENAI_API_KEY && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>OpenAI API Key Required</AlertTitle>
              <AlertDescription>
                To use the deep research analysis, you need to set your OpenAI API key. 
                Create a <code className="bg-gray-100 px-1 rounded">.env</code> file in the project root with:
                <br />
                <code className="bg-gray-100 px-2 py-1 rounded block mt-2">VITE_OPENAI_API_KEY=your_api_key_here</code>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {!isLoading ? (
              <Button
                onClick={handleStartResearch}
                disabled={!companyName || !import.meta.env.VITE_OPENAI_API_KEY}
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Brain className="h-5 w-5 mr-2" />
                Start 4-Lens Analysis
              </Button>
            ) : (
              <Button
                onClick={handleCancelResearch}
                variant="outline"
                size="lg"
                className="px-8 py-3"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Cancel Analysis
              </Button>
            )}
          </div>

          {/* Progress */}
          {isLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Analysis Progress</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={Number(progress) || 0} className="h-2" />
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deep research in progress...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Display */}
          {result && result.status === 'completed' && result.output && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span>Analysis Complete</span>
                </CardTitle>
                <CardDescription className="text-green-700">
                  Your 4-lens deep research analysis is ready
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        const blob = new Blob([result.output], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${companyName}-4lens-analysis.txt`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <SimplePDFPreview content={result.output} filename={`${companyName}-4lens-analysis`} />
                  </div>
                  
                  <ScrollArea className="h-96 w-full rounded-md border p-4 bg-white">
                    <div className="whitespace-pre-wrap font-mono text-sm">{result.output}</div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}

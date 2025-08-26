import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  Brain,
  Zap,
  Eye,
  TrendingUp as TrendingUpIcon,
  Calculator,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { AnalysisForm } from '@/components/AnalysisForm'
import { DeepResearchAnalysis } from '@/components/DeepResearchAnalysis'
import { DeepResearchReport } from '@/components/DeepResearchReport'
import { useDeepResearch } from '@/hooks/use-deep-research'

// Mock data for demonstration
const mockCompanyData = {
  companyName: 'Caveo',
  targetValuation: 40,
  sector: 'Fintech',
  stage: 'Series A',
  location: 'São Paulo, Brazil',
  description: 'Digital banking platform for small businesses in Latin America'
}

interface AnalysisData {
    companyName: string
  targetValuation: string
    files: File[]
    prompts: {
      skeptical: string
      contrarian: string
      optimistic: string
      cfo: string
    }
}
  
const Index = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<typeof mockCompanyData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false)
  const [deepResearchResult, setDeepResearchResult] = useState<string | null>(null)
  
  const { startResearch, isLoading: isDeepResearchLoading } = useDeepResearch()

  // Run unified 4-lens deep research analysis
  const runUnifiedAnalysis = async (data: AnalysisData) => {
    setIsAnalyzing(true)
    
    // Convert the data to match our expected format
    const analysisData = {
      companyName: data.companyName,
      targetValuation: parseInt(data.targetValuation) || 0,
      sector: 'Technology', // Default value
      stage: 'Series A', // Default value
      location: 'Latin America', // Default value
      description: 'Technology company'
    }
    
    setCurrentAnalysis(analysisData)
    
    try {
      // Check if OpenAI API key is available
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.')
      }
      
      // Start the unified 4-lens deep research analysis with uploaded files
      // Note: startResearch returns void, the result is handled by the onComplete callback
      await startResearch({
        query: `Provide a comprehensive 4-lens investment analysis for ${data.companyName}`,
          companyName: data.companyName,
        files: data.files, // Pass the uploaded files directly
        useWebSearch: true,
        useCodeInterpreter: true
      })
      } catch (error) {
      console.error('Analysis failed:', error)
      setIsAnalyzing(false)
      // Set error message to be displayed
      setDeepResearchResult(error instanceof Error ? error.message : 'Analysis failed. Please try again.')
      setIsAnalysisComplete(false)
    }
  }

  // Handle deep research completion
  const handleDeepResearchComplete = (analysis: string) => {
    setDeepResearchResult(analysis)
    setIsAnalysisComplete(true)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lens Navigator
              </h1>
          </div>
          <p className="text-xl text-gray-600 text-center max-w-2xl">
            Advanced investment analysis platform powered by OpenAI's Deep Research API
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Info Card */}
            {currentAnalysis && (
              <Card className="sticky top-8">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span>{currentAnalysis.companyName}</span>
                  </CardTitle>
                  <CardDescription>Investment Analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Target Valuation</span>
                    <Badge variant="secondary" className="font-mono">
                      ${currentAnalysis.targetValuation}M
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sector</span>
                    <Badge variant="outline">{currentAnalysis.sector}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Stage</span>
                    <Badge variant="outline">{currentAnalysis.stage}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <Badge variant="outline">{currentAnalysis.location}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 4-Lens Overview */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-center text-blue-800">
                  4-Lens Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-red-50 border border-red-200">
                  <Eye className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Skeptical</p>
                    <p className="text-xs text-red-600">Risk & Red Flags</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-orange-50 border border-orange-200">
                  <TrendingUpIcon className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Contrarian</p>
                    <p className="text-xs text-orange-600">Hidden Insights</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 border border-green-200">
                  <Zap className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Optimistic</p>
                    <p className="text-xs text-green-600">Upside Potential</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">CFO</p>
                    <p className="text-xs text-blue-600">Unit Economics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {!currentAnalysis ? (
              <div className="flex flex-col items-center justify-center">
                <Card className="border-2 border-dashed border-blue-300 bg-blue-50 w-full max-w-3xl">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Brain className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Start Your Investment Analysis
                    </h2>
                    <p className="text-blue-600 mb-6 max-w-md mx-auto">
                      Enter company details to begin a comprehensive 4-lens deep research analysis using OpenAI's advanced AI models.
                    </p>
                    <AnalysisForm onSubmit={runUnifiedAnalysis} isLoading={isAnalyzing} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Analysis Status */}
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {isAnalysisComplete ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : isAnalyzing ? (
                            <AlertCircle className="h-6 w-6 text-blue-600 animate-pulse" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                          <span className="font-semibold text-blue-800">
                            {isAnalysisComplete ? 'Analysis Complete' : isAnalyzing ? 'Analysis in Progress' : 'Analysis Failed'}
                          </span>
                        </div>
                      </div>
                      <Badge variant={isAnalysisComplete ? "default" : isAnalyzing ? "secondary" : "destructive"}>
                        {isAnalysisComplete ? 'Ready' : isAnalyzing ? 'Processing' : 'Error'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Progress */}
                {isAnalyzing && !isAnalysisComplete && !deepResearchResult && (
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="pt-6 pb-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <AlertCircle className="h-6 w-6 text-blue-600 animate-pulse" />
                          <span className="font-semibold text-blue-800">
                            4-Lens Analysis in Progress...
                          </span>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                        <p className="text-center text-blue-700">
                          Analyzing {currentAnalysis.companyName} through all four lenses. This may take a few minutes.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Analysis Error */}
                {deepResearchResult && !isAnalysisComplete && (
                  <Card className="border-2 border-red-200 bg-red-50">
                    <CardContent className="pt-6 pb-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <XCircle className="h-6 w-6 text-red-600" />
                          <span className="font-semibold text-red-800">
                            Analysis Failed
                          </span>
                        </div>
                        <div className="bg-white p-4 rounded-md border border-red-200">
                          <p className="text-center text-red-700">
                            {deepResearchResult}
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setCurrentAnalysis(null);
                              setDeepResearchResult(null);
                              setIsAnalyzing(false);
                            }}
                          >
                            Start Over
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Deep Research Report */}
                {isAnalysisComplete && deepResearchResult && (
                  <DeepResearchReport
                    companyName={currentAnalysis.companyName}
                    targetValuation={currentAnalysis.targetValuation.toString()}
                    analysis={deepResearchResult}
                  />
                )}
                
                {/* Hidden DeepResearchAnalysis - Only used for processing */}
                <div className="hidden">
                  <DeepResearchAnalysis 
                    companyName={currentAnalysis.companyName}
                    onComplete={handleDeepResearchComplete}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index

import { useState } from "react"
import { AnalysisForm } from "@/components/AnalysisForm"
import { LensAnalysis, LensResult } from "@/components/LensAnalysis"
import { ICReport } from "@/components/ICReport"
import { FundMetrics } from "@/components/FundMetrics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, TrendingUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const Index = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    companyName: string
    targetValuation?: string
    file: File
  } | null>(null)
  
  const [lensResults, setLensResults] = useState<LensResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Mock analysis - in real implementation this would call OpenAI APIs
  const runAnalysis = async (data: { companyName: string; targetValuation: string; file: File }) => {
    setCurrentAnalysis(data)
    setIsAnalyzing(true)
    
    // Initialize results with pending status
    const initialResults: LensResult[] = [
      {
        lens: "Skeptical",
        recommendation: "No",
        entryRange: "≤ $15M / > $40M",
        conviction: "Medium",
        keySensitivity: "Needs validated savings at scale",
        scenarios: {
          writeOff: { probability: 20, value: "$0" },
          bear: { probability: 30, value: "$50M" },
          base: { probability: 25, value: "$150M" },
          bull: { probability: 20, value: "$400M" },
          moonshot: { probability: 5, value: "$1B" }
        },
        weightedValuation: "$140M",
        status: "pending"
      },
      {
        lens: "Contrarian", 
        recommendation: "Yes",
        entryRange: "≤ $20M / > $35M",
        conviction: "High",
        keySensitivity: "Early AI moat in underpenetrated segment",
        scenarios: {
          writeOff: { probability: 15, value: "$0" },
          bear: { probability: 25, value: "$80M" },
          base: { probability: 30, value: "$200M" },
          bull: { probability: 25, value: "$500M" },
          moonshot: { probability: 5, value: "$1.2B" }
        },
        weightedValuation: "$190M",
        status: "pending"
      },
      {
        lens: "Optimistic",
        recommendation: "Strong Yes", 
        entryRange: "≤ $25M / > $40M",
        conviction: "High",
        keySensitivity: "LatAm insurer demand + cross-border TAM",
        scenarios: {
          writeOff: { probability: 10, value: "$0" },
          bear: { probability: 20, value: "$100M" },
          base: { probability: 30, value: "$300M" },
          bull: { probability: 30, value: "$800M" },
          moonshot: { probability: 10, value: "$2B" }
        },
        weightedValuation: "$340M",
        status: "pending"
      },
      {
        lens: "CFO",
        recommendation: "Yes",
        entryRange: "≤ $18M / > $38M", 
        conviction: "Medium",
        keySensitivity: "CAC payback ≤ 6 months, LTV ≥ 4x CAC",
        scenarios: {
          writeOff: { probability: 18, value: "$0" },
          bear: { probability: 32, value: "$70M" },
          base: { probability: 28, value: "$180M" },
          bull: { probability: 18, value: "$450M" },
          moonshot: { probability: 4, value: "$900M" }
        },
        weightedValuation: "$165M",
        status: "pending"
      }
    ]
    
    setLensResults(initialResults)

    // Simulate running each lens with delays
    for (let i = 0; i < initialResults.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
      
      setLensResults(prev => prev.map((result, index) => 
        index === i 
          ? { ...result, status: "running" }
          : result
      ))
      
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000))
      
      setLensResults(prev => prev.map((result, index) => 
        index === i 
          ? { ...result, status: "completed" }
          : result
      ))
      
      toast({
        title: `${initialResults[i].lens} Analysis Complete`,
        description: `Recommendation: ${initialResults[i].recommendation}`
      })
    }
    
    setIsAnalyzing(false)
    toast({
      title: "Analysis Complete",
      description: "All 4 lenses have completed their evaluation"
    })
  }

  const isAnalysisComplete = lensResults.every(r => r.status === "completed")
  
  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                AI Investment Committee
              </h1>
              <p className="text-lg text-muted-foreground">4-Lens Decision Engine</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Pre-seed to Series A</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>7-10x Target Returns</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Form & Metrics */}
          <div className="lg:col-span-1 space-y-6">
            <FundMetrics />
            
            {!currentAnalysis && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>Upload pitch deck or financial model</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>AI analyzes through 4 distinct lenses</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>Get structured IC recommendation</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Analysis */}
          <div className="lg:col-span-3 space-y-6">
            {!currentAnalysis ? (
              <AnalysisForm onSubmit={runAnalysis} isLoading={isAnalyzing} />
            ) : (
              <>
                <LensAnalysis results={lensResults} isLoading={isAnalyzing} />
                
                {isAnalysisComplete && (
                  <ICReport
                    companyName={currentAnalysis.companyName}
                    targetValuation={currentAnalysis.targetValuation}
                    results={lensResults}
                    consensusSensitivity="Prove cost-saving impact is repeatable and scalable beyond initial clients"
                    actionItem="Pass at current $40M post unless cost outcomes are proven. Revisit with client cohort validation."
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

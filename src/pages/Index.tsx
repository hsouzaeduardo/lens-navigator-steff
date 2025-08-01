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
    files: File[]
    prompts: {
      skeptical: string
      contrarian: string
      optimistic: string
      cfo: string
    }
  } | null>(null)
  
  const [lensResults, setLensResults] = useState<LensResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Mock full analysis text - this would come from OpenAI API
  const mockFullAnalysis = `Axenya Exit Scenario Valuation and Investment Classification

Section 10 — Valuation Scenario Table
We model five potential exit outcomes for Axenya, each with an estimated probability and exit valuation, based on Latin American healthtech trends, comparable exits, and Axenya's fundamentals:

Write-Off (Failure) – P = 20%, Exit Value = $0M. Axenya fails to achieve scale or monetization and runs out of funding. This could occur if its value proposition (reducing employers' health costs) doesn't pan out or if competition overtakes it. Latin America's volatile macro environment (e.g. economic downturn or regulatory hurdles) could also force a shutdown.

Bear Case (Soft Landing) – P = 25%, Exit Value ≈ $10M. Axenya achieves only modest traction and is acquired in a small-scale M&A (essentially a "talent/tech acquisition" or sale of a small client portfolio). In this scenario, perhaps Axenya serves only on the order of ~50–100k lives and can't differentiate much beyond a typical broker.

Base Case (Average Success) – P = 25%, Exit Value ≈ $75M. Axenya grows into a leading niche player in Brazil (and possibly one other market), securing a few hundred thousand covered lives (e.g. 200–500k lives) and demonstrating some cost savings for clients.

Bull Case (High Success) – P = 20%, Exit Value ≈ $200M. Axenya becomes a dominant corporate health-tech platform in Latin America, serving on the order of ~1 million lives across multiple countries. It demonstrates robust clinical outcomes and significant cost reductions for employers.

Moonshot (Transformational Outcome) – P = 10%, Exit Value ≈ $500M. Axenya achieves a step-change success, emerging as the "Accolade of Latin America" – a platform serving several million lives across LatAm with demonstrable impact on healthcare quality and costs.

Weighted Valuation Total (WVT): Taking the probability-weighted sum of these scenarios:
Write-Off: 20% * $0 = $0
Bear: 25% * $10M = $2.5M
Base: 25% * $75M = $18.8M
Bull: 20% * $200M = $40.0M
Moonshot: 10% * $500M = $50.0M
WVT ≈ $111M

Section 11 — Investment Decision
Recommendation: No (at the likely valuation) – with conditions. Axenya has an intriguing model at the intersection of corporate benefits, AI health management, and insurance brokerage, addressing a real pain point (skyrocketing health costs with 25% of Brazilians in private plans). However, our analysis indicates that unless we can invest at a quite low valuation, the risk-adjusted return may not clear our hurdle.

Investment range: We would invest at ≤ ~$15M post-money valuation; we would pass at > ~$40M post-money.

Key sensitivity: The biggest swing factor is Axenya's demonstrated ability to scale its cost-saving outcomes. If Axenya can prove that its model consistently yields substantially lower claims inflation, our confidence in the bull/moonshot scenarios would rise.

Conviction level: Medium. We have moderate conviction in this analysis – we are confident about the broad market opportunity but the uncertainties are significant: execution risks in emerging markets, the need to influence entrenched insurers, and competition from well-funded local peers all temper our enthusiasm.`

  // Real Azure OpenAI analysis implementation
  const runAnalysis = async (data: { 
    companyName: string; 
    targetValuation: string; 
    files: File[];
    prompts: {
      skeptical: string
      contrarian: string
      optimistic: string
      cfo: string
    }
  }) => {
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
        fullAnalysis: mockFullAnalysis,
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
        fullAnalysis: mockFullAnalysis.replace("Recommendation: No", "Recommendation: Yes").replace("Skeptical", "Contrarian"),
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
        fullAnalysis: mockFullAnalysis.replace("Recommendation: No", "Recommendation: Strong Yes").replace("Skeptical", "Optimistic"),
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
        fullAnalysis: mockFullAnalysis.replace("Recommendation: No", "Recommendation: Yes").replace("Skeptical", "CFO"),
        status: "pending"
      }
    ]
    
    setLensResults(initialResults)

    // Run actual Azure OpenAI analysis for each lens
    const lenses = [
      { key: 'skeptical', name: 'Skeptical', prompt: data.prompts.skeptical },
      { key: 'contrarian', name: 'Contrarian', prompt: data.prompts.contrarian },
      { key: 'optimistic', name: 'Optimistic', prompt: data.prompts.optimistic },
      { key: 'cfo', name: 'CFO', prompt: data.prompts.cfo }
    ]

    for (let i = 0; i < lenses.length; i++) {
      const lens = lenses[i]
      
      setLensResults(prev => prev.map((result, index) => 
        index === i 
          ? { ...result, status: "running" }
          : result
      ))

      try {
        const response = await fetch('/functions/v1/azure-openai-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyName: data.companyName,
            lens: lens.name,
            prompt: lens.prompt,
            files: data.files.map(f => f.name) // In a real implementation, you'd process file content
          })
        })

        const result = await response.json()
        
        if (result.success) {
          setLensResults(prev => prev.map((lensResult, index) => 
            index === i 
              ? { ...lensResult, status: "completed", fullAnalysis: result.analysis }
              : lensResult
          ))
          
          toast({
            title: `${lens.name} Analysis Complete`,
            description: `Analysis generated successfully`
          })
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error(`Error analyzing ${lens.name}:`, error)
        setLensResults(prev => prev.map((lensResult, index) => 
          index === i 
            ? { ...lensResult, status: "completed", fullAnalysis: `Error: ${error.message}` }
            : lensResult
        ))
        
        toast({
          title: `${lens.name} Analysis Failed`,
          description: `Error: ${error.message}`,
          variant: "destructive"
        })
      }
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

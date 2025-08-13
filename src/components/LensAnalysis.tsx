import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Clock, AlertTriangle, TrendingDown, TrendingUp, DollarSign, Users, FileText, Calculator, Brain, Target, Search } from "lucide-react"

export interface LensResult {
  lens: "Skeptical" | "Contrarian" | "Optimistic" | "CFO"
  recommendation: "Strong Yes" | "Yes" | "No" | "Strong No"
  entryRange: string
  conviction: "High" | "Medium" | "Low"
  keySensitivity: string
  scenarios: {
    writeOff: { 
      probability: number; 
      value: string; 
      reasoning?: string;
      probabilityReasoning?: string;
      valuationMethodology?: string;
      businessConditions?: string;
      riskFactors?: string;
      // New detailed reasoning fields
      probabilityCalculation?: string;
      riskFactorAnalysis?: string;
      industryBenchmarks?: string;
      probabilityAdjustment?: string;
      valuationMethod?: string;
      comparableCompanies?: string;
      calculationSteps?: string;
      assumptionsSensitivity?: string;
      operationalConditions?: string;
      marketConditions?: string;
      validationMetrics?: string;
      scenarioDifferentiation?: string;
      riskFactorQuantification?: string;
      earlyWarningIndicators?: string;
      asymmetricAnalysis?: string;
      mitigationStrategies?: string;
    }
    bear: { 
      probability: number; 
      value: string; 
      reasoning?: string;
      probabilityReasoning?: string;
      valuationMethodology?: string;
      businessConditions?: string;
      riskFactors?: string;
      // New detailed reasoning fields
      probabilityCalculation?: string;
      riskFactorAnalysis?: string;
      industryBenchmarks?: string;
      probabilityAdjustment?: string;
      valuationMethod?: string;
      comparableCompanies?: string;
      calculationSteps?: string;
      assumptionsSensitivity?: string;
      operationalConditions?: string;
      marketConditions?: string;
      validationMetrics?: string;
      scenarioDifferentiation?: string;
      riskFactorQuantification?: string;
      earlyWarningIndicators?: string;
      asymmetricAnalysis?: string;
      mitigationStrategies?: string;
    }
    base: { 
      probability: number; 
      value: string; 
      reasoning?: string;
      probabilityReasoning?: string;
      valuationMethodology?: string;
      businessConditions?: string;
      riskFactors?: string;
      // New detailed reasoning fields
      probabilityCalculation?: string;
      riskFactorAnalysis?: string;
      industryBenchmarks?: string;
      probabilityAdjustment?: string;
      valuationMethod?: string;
      comparableCompanies?: string;
      calculationSteps?: string;
      assumptionsSensitivity?: string;
      operationalConditions?: string;
      marketConditions?: string;
      validationMetrics?: string;
      scenarioDifferentiation?: string;
      riskFactorQuantification?: string;
      earlyWarningIndicators?: string;
      asymmetricAnalysis?: string;
      mitigationStrategies?: string;
    }
    bull: { 
      probability: number; 
      value: string; 
      reasoning?: string;
      probabilityReasoning?: string;
      valuationMethodology?: string;
      businessConditions?: string;
      riskFactors?: string;
      // New detailed reasoning fields
      probabilityCalculation?: string;
      riskFactorAnalysis?: string;
      industryBenchmarks?: string;
      probabilityAdjustment?: string;
      valuationMethod?: string;
      comparableCompanies?: string;
      calculationSteps?: string;
      assumptionsSensitivity?: string;
      operationalConditions?: string;
      marketConditions?: string;
      validationMetrics?: string;
      scenarioDifferentiation?: string;
      riskFactorQuantification?: string;
      earlyWarningIndicators?: string;
      asymmetricAnalysis?: string;
      mitigationStrategies?: string;
    }
    moonshot: { 
      probability: number; 
      value: string; 
      reasoning?: string;
      probabilityReasoning?: string;
      valuationMethodology?: string;
      businessConditions?: string;
      riskFactors?: string;
      // New detailed reasoning fields
      probabilityCalculation?: string;
      riskFactorAnalysis?: string;
      industryBenchmarks?: string;
      probabilityAdjustment?: string;
      valuationMethod?: string;
      comparableCompanies?: string;
      calculationSteps?: string;
      assumptionsSensitivity?: string;
      operationalConditions?: string;
      marketConditions?: string;
      validationMetrics?: string;
      scenarioDifferentiation?: string;
      riskFactorQuantification?: string;
      earlyWarningIndicators?: string;
      asymmetricAnalysis?: string;
      mitigationStrategies?: string;
    }
  }
  weightedValuation: string
  wvtReasoning?: string // Reasoning behind the WVT calculation
  // New detailed WVT fields
  wvtCalculation?: string;
  wvtAdjustments?: string;
  industryComparison?: string;
  entryPriceBands?: {
    strongYes: string;
    yes: string;
    no: string;
    strongNo: string;
  }
  fundLogic?: string;
  fullAnalysis?: string // Full detailed analysis output
  status: "completed" | "running" | "pending"
}

interface LensAnalysisProps {
  results: LensResult[]
  isLoading?: boolean
}

const lensIcons = {
  Skeptical: AlertTriangle,
  Contrarian: TrendingUp,
  Optimistic: TrendingUp,
  CFO: DollarSign
}

const lensColors = {
  Skeptical: "bg-chart-4",
  Contrarian: "bg-chart-5", 
  Optimistic: "bg-chart-2",
  CFO: "bg-chart-1"
}

const recommendationColors = {
  "Strong Yes": "bg-decision-strong-yes text-white",
  "Yes": "bg-decision-yes text-white",
  "No": "bg-decision-no text-white",
  "Strong No": "bg-decision-strong-no text-white"
}

const convictionColors = {
  "High": "text-success",
  "Medium": "text-warning",
  "Low": "text-destructive"
}

// New component for PVWT reasoning
function PVWTReasoning({ result }: { result: LensResult }) {
  const scenarios = [
    { key: 'writeOff', name: 'Write-Off', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    { key: 'bear', name: 'Bear', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { key: 'base', name: 'Base', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { key: 'bull', name: 'Bull', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { key: 'moonshot', name: 'Moonshot', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' }
  ]

  return (
    <div className="space-y-6">
      {/* Simple Lens Analysis Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              <CardTitle className="text-primary">{result.lens} Lens</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Analysis Complete</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground font-medium mb-2">Recommendation</div>
              <Badge variant={result.recommendation === "No" || result.recommendation === "Strong No" ? "destructive" : "default"} className="text-lg px-4 py-2">
                {result.recommendation}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground font-medium mb-2">Conviction</div>
              <Badge variant="outline" className="text-lg px-4 py-2 border-orange-200 text-orange-700 bg-orange-50">
                {result.conviction}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground font-medium mb-2">Entry Range</div>
              <div className="text-lg font-bold text-gray-800">{result.entryRange}</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground font-medium mb-2">Weighted Valuation</div>
              <div className="text-lg font-bold text-blue-600">{result.weightedValuation}</div>
            </div>
          </div>

          {/* Key Sensitivity */}
          <div className="mb-6">
            <div className="text-sm text-muted-foreground font-medium mb-2">Key Sensitivity</div>
            <div className="text-base text-gray-800">{result.keySensitivity}</div>
          </div>

          {/* View Full Analysis Button */}
          <div className="text-center">
            <Button 
              variant="outline" 
              className="w-full max-w-xs"
              onClick={() => {
                // This will show the full analysis in a modal or expand the section
                console.log('View Full Analysis clicked')
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              View Full Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function LensAnalysis({ results, isLoading }: LensAnalysisProps) {
  const completedResults = results.filter(r => r.status === "completed")
  const runningResults = results.filter(r => r.status === "running")
  const progress = (completedResults.length / 4) * 100

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                4-Lens Analysis Progress
              </CardTitle>
              <CardDescription>
                {completedResults.length}/4 lenses completed
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Individual Lens Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {results.map((result) => {
          const Icon = lensIcons[result.lens]
          const isCompleted = result.status === "completed"
          const isRunning = result.status === "running"
          
          return (
            <Card key={result.lens} className={`transition-all duration-300 ${
              isCompleted ? "shadow-md border-success/30" : 
              isRunning ? "border-primary/30 animate-pulse" : 
              "border-muted"
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${lensColors[result.lens]} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{result.lens} Lens</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-success" />}
                        {isRunning && <Clock className="w-4 h-4 text-primary animate-spin" />}
                        {result.status === "pending" && <Clock className="w-4 h-4 text-muted-foreground" />}
                        {isCompleted ? "Analysis Complete" : 
                         isRunning ? "Running Analysis..." : "Pending"}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {isCompleted && (
                <CardContent className="space-y-4">
                  <PVWTReasoning result={result} />
                  
                  {result.fullAnalysis && (
                    <div className="pt-3 border-t border-border">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            <FileText className="w-4 h-4 mr-2" />
                            View Full Analysis
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{result.lens} Lens - Full Analysis</DialogTitle>
                            <DialogDescription>
                              Complete detailed analysis from the {result.lens.toLowerCase()} perspective
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh] pr-6">
                            <div className="prose prose-sm max-w-none">
                              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                                {result.fullAnalysis}
                              </pre>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
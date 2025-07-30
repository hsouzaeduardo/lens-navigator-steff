import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertTriangle, TrendingDown, TrendingUp, DollarSign, Users } from "lucide-react"

export interface LensResult {
  lens: "Skeptical" | "Contrarian" | "Optimistic" | "CFO"
  recommendation: "Strong Yes" | "Yes" | "No" | "Strong No"
  entryRange: string
  conviction: "High" | "Medium" | "Low"
  keySensitivity: string
  scenarios: {
    writeOff: { probability: number; value: string }
    bear: { probability: number; value: string }
    base: { probability: number; value: string }
    bull: { probability: number; value: string }
    moonshot: { probability: number; value: string }
  }
  weightedValuation: string
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Recommendation</div>
                      <Badge className={`${recommendationColors[result.recommendation]} text-xs`}>
                        {result.recommendation}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Conviction</div>
                      <div className={`text-sm font-medium ${convictionColors[result.conviction]}`}>
                        {result.conviction}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Entry Range</div>
                    <div className="text-sm font-mono bg-muted px-2 py-1 rounded text-center">
                      {result.entryRange}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Weighted Valuation</div>
                    <div className="text-lg font-bold text-primary">
                      {result.weightedValuation}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Key Sensitivity</div>
                    <div className="text-xs bg-muted/50 p-2 rounded leading-relaxed">
                      {result.keySensitivity}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
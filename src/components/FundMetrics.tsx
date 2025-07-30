import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, MapPin, Calendar, DollarSign, Users } from "lucide-react"

export function FundMetrics() {
  const metrics = [
    {
      label: "Fund Size",
      value: "$120M",
      icon: DollarSign,
      color: "text-chart-1"
    },
    {
      label: "Portfolio Target",
      value: "25-30 cos",
      icon: Users,
      color: "text-chart-2"
    },
    {
      label: "Average Check",
      value: "$3-4M",
      icon: Target,
      color: "text-chart-3"
    },
    {
      label: "Expected Return",
      value: "7-10x",
      icon: TrendingUp,
      color: "text-chart-4"
    }
  ]

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          Fund Parameters
        </CardTitle>
        <CardDescription>
          Investment criteria and target metrics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <Icon className={`w-4 h-4 ${metric.color}`} />
                <div>
                  <div className="text-sm font-medium">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              Geography: <Badge variant="secondary" className="ml-1">Latin America</Badge>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              Stage: <Badge variant="secondary" className="ml-1">Pre-seed to Series A</Badge>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
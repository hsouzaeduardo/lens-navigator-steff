import { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Share, FileText, Target, Lightbulb, CheckSquare, Loader2 } from "lucide-react"
import { LensResult } from "./LensAnalysis"
import { exportToPDF, exportToPDFFromElement } from "@/lib/pdf-export"
import { toast } from "@/hooks/use-toast"
import { PDFPreview } from "./PDFPreview"

interface ICReportProps {
  companyName: string
  targetValuation?: string
  results: LensResult[]
  consensusSensitivity: string
  actionItem: string
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

export function ICReport({ companyName, targetValuation, results, consensusSensitivity, actionItem }: ICReportProps) {
  const completedResults = results.filter(r => r.status === "completed")
  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  
  if (completedResults.length === 0) {
    return null
  }

  const generateSlackMessage = () => {
    const table = completedResults.map(r => 
      `${r.lens}\t${r.recommendation}\t${r.entryRange}\t${r.conviction}\t${r.keySensitivity}`
    ).join('\n')
    
    return `📊 Investment Committee Summary: ${companyName}
${targetValuation ? `Target: ${targetValuation}` : ''}

Lens\tRecommendation\tEntry Range\tConviction\tKey Sensitivity
${table}

💡 Consensus Sensitivity: ${consensusSensitivity}

✅ Action: ${actionItem}

📁 [View full report] | [Open Notion entry]`
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    
    try {
      // Preparar dados para exportação
      const exportData = {
        companyName,
        targetValuation,
        results: completedResults,
        consensusSensitivity,
        actionItem,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }

      // Tentar exportação programática primeiro
      await exportToPDF(exportData, reportRef.current)
      
      toast({
        title: "PDF Exportado",
        description: "Relatório salvo com sucesso!",
      })
      
    } catch (error) {
      console.error('Erro na exportação programática, tentando captura visual:', error)
      
      try {
        // Fallback para captura visual
        const fileName = `IC_Report_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
        await exportToPDFFromElement(reportRef.current, fileName)
        
        toast({
          title: "PDF Exportado",
          description: "Relatório salvo com sucesso!",
        })
        
      } catch (fallbackError) {
        console.error('Erro na exportação:', fallbackError)
        toast({
          title: "Erro na Exportação",
          description: "Não foi possível gerar o PDF. Tente novamente.",
          variant: "destructive"
        })
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div ref={reportRef}>
      <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Investment Committee Summary</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {companyName} • 4-Lens Analysis Complete
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Summary Table */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Lens Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Lens</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Recommendation</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Entry Range</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Conviction</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Key Sensitivity</th>
                </tr>
              </thead>
              <tbody>
                {completedResults.map((result, index) => (
                  <tr key={result.lens} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                    <td className="py-3 px-2 font-medium">{result.lens}</td>
                    <td className="py-3 px-2">
                      <Badge className={`${recommendationColors[result.recommendation]} text-xs`}>
                        {result.recommendation}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 font-mono text-sm">{result.entryRange}</td>
                    <td className="py-3 px-2">
                      <span className={`font-medium ${convictionColors[result.conviction]}`}>
                        {result.conviction}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm max-w-xs truncate" title={result.keySensitivity}>
                      {result.keySensitivity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Separator />

        {/* Consensus Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Consensus Sensitivity
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{consensusSensitivity}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Recommended Action
            </h3>
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <p className="text-sm leading-relaxed font-medium">{actionItem}</p>
            </div>
          </div>
        </div>

        {/* Slack Message Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Slack Message Preview</h3>
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm whitespace-pre-line">
            {generateSlackMessage()}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => navigator.clipboard.writeText(generateSlackMessage())}
          >
            Copy to Clipboard
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* PDF Preview Component */}
    <div className="mt-6">
      <PDFPreview
        companyName={companyName}
        targetValuation={targetValuation}
        results={results}
        consensusSensitivity={consensusSensitivity}
        actionItem={actionItem}
        onExport={handleExportPDF}
        isExporting={isExporting}
      />
    </div>
    </div>
  )
}
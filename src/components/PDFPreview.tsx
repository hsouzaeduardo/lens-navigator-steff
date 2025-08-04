import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Target, Lightbulb, CheckSquare, Eye, Download } from "lucide-react"
import { LensResult } from "./LensAnalysis"

interface PDFPreviewProps {
  companyName: string
  targetValuation?: string
  results: LensResult[]
  consensusSensitivity: string
  actionItem: string
  onExport: () => void
  isExporting: boolean
}

const recommendationColors = {
  "Strong Yes": "bg-green-600 text-white",
  "Yes": "bg-green-500 text-white", 
  "No": "bg-red-500 text-white",
  "Strong No": "bg-red-600 text-white"
}

const convictionColors = {
  "High": "text-green-600",
  "Medium": "text-yellow-600",
  "Low": "text-red-600"
}

export function PDFPreview({ 
  companyName, 
  targetValuation, 
  results, 
  consensusSensitivity, 
  actionItem, 
  onExport, 
  isExporting 
}: PDFPreviewProps) {
  const [showPreview, setShowPreview] = useState(false)
  const completedResults = results.filter(r => r.status === "completed")

  if (completedResults.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Preview Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          PDF Export Preview
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onExport}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Generating...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      {/* PDF Preview */}
      {showPreview && (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">AI Investment Committee Report</h1>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Company:</strong> {companyName}</p>
                {targetValuation && <p><strong>Target Valuation:</strong> {targetValuation}</p>}
                <p><strong>Date:</strong> {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <Separator />

            {/* Summary Table */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Lens Comparison Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-2 font-medium text-gray-700">Lens</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700">Recommendation</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700">Entry Range</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700">Conviction</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700">Key Sensitivity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedResults.map((result, index) => (
                      <tr key={result.lens} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                        <td className="py-2 px-2 font-medium">{result.lens}</td>
                        <td className="py-2 px-2">
                          <Badge className={`${recommendationColors[result.recommendation]} text-xs`}>
                            {result.recommendation}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 font-mono text-xs">{result.entryRange}</td>
                        <td className="py-2 px-2">
                          <span className={`font-medium ${convictionColors[result.conviction]}`}>
                            {result.conviction}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-xs max-w-xs truncate" title={result.keySensitivity}>
                          {result.keySensitivity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Valuation Scenarios */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Valuation Scenarios</h3>
              <div className="grid grid-cols-5 gap-2 text-xs">
                {['Write-Off', 'Bear', 'Base', 'Bull', 'Moonshot'].map((scenario, index) => {
                  const result = completedResults.find(r => r.scenarios && r.scenarios[scenario.toLowerCase().replace('-', '')])
                  const scenarioData = result?.scenarios[scenario.toLowerCase().replace('-', '')]
                  
                  return (
                    <div key={scenario} className="text-center p-2 border border-gray-300 rounded">
                      <div className="font-semibold text-gray-800">{scenario}</div>
                      {scenarioData && (
                        <>
                          <div className="text-blue-600">{scenarioData.probability}%</div>
                          <div className="text-green-600 font-mono">{scenarioData.value}</div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Consensus Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  Consensus Sensitivity
                </h3>
                <div className="bg-gray-100 p-3 rounded text-sm">
                  {consensusSensitivity}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                  Recommended Action
                </h3>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm font-medium">
                  {actionItem}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
              <p>This report contains confidential investment analysis</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
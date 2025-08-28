import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Brain, 
  Download, 
  FileText,
  CheckCircle
} from 'lucide-react'

interface DeepResearchReportProps {
  companyName: string
  targetValuation: string
  analysis: string
}

export const DeepResearchReport: React.FC<DeepResearchReportProps> = ({
  companyName,
  targetValuation,
  analysis
}) => {
  const handleDownload = () => {
    const blob = new Blob([analysis], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${companyName}-investment-analysis.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="shadow-lg border-2 border-primary/20 apple-card">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center space-x-2 apple-heading-2">
                <span>Investment Analysis Report</span>
                <CheckCircle className="h-6 w-6 text-primary" />
              </CardTitle>
              <CardDescription className="text-base mt-1">
                4-Lens Deep Research Analysis for {companyName}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1 apple-badge">
            ${targetValuation}M Valuation
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex items-center justify-between border-b pb-4 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Comprehensive Analysis Results</h3>
            <div className="flex space-x-2">
              <Button onClick={handleDownload} className="apple-button-filled" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Analysis
              </Button>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">Full Analysis</h4>
            <ScrollArea className="h-[600px] w-full rounded-md border dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed dark:text-gray-200">
                {analysis}
              </div>
            </ScrollArea>
          </div>

          {/* Summary Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
            <div className="text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">Analysis Type</p>
              <p className="text-lg font-semibold text-primary dark:text-primary">4-Lens Framework</p>
            </div>
            <div className="text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">Model Used</p>
              <p className="text-lg font-semibold text-primary dark:text-primary">Deep Research AI</p>
            </div>
            <div className="text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">Status</p>
              <p className="text-lg font-semibold text-primary dark:text-primary">Complete</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

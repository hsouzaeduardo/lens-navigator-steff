import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  FileText,
  TrendingUp,
  BarChart3,
  Users,
  Building,
  DollarSign
} from 'lucide-react'
import { ProcessedDocument } from '@/lib/document-processor'

interface DocumentValidationProps {
  documents: ProcessedDocument[]
  onUploadMore?: () => void
}

export function DocumentValidation({ documents, onUploadMore }: DocumentValidationProps) {
  if (documents.length === 0) {
    return null
  }

  // Calculate validation metrics
  const successfulDocs = documents.filter(doc => doc.processingStatus === 'completed')
  const failedDocs = documents.filter(doc => doc.processingStatus === 'error')
  const totalWordCount = successfulDocs.reduce((sum, doc) => sum + doc.wordCount, 0)
  
  // Document type analysis
  const hasFinancialDocs = successfulDocs.some(doc => 
    doc.fileType === 'xlsx' || doc.fileType === 'csv' || 
    doc.content.toLowerCase().includes('financial') || 
    doc.content.toLowerCase().includes('revenue')
  )
  
  const hasBusinessPlan = successfulDocs.some(doc => 
    doc.content.toLowerCase().includes('business plan') ||
    doc.content.toLowerCase().includes('pitch deck') ||
    doc.content.toLowerCase().includes('executive summary')
  )
  
  const hasMarketAnalysis = successfulDocs.some(doc => 
    doc.content.toLowerCase().includes('market') || 
    doc.content.toLowerCase().includes('competition') ||
    doc.content.toLowerCase().includes('industry')
  )
  
  const hasTeamInfo = successfulDocs.some(doc => 
    doc.content.toLowerCase().includes('team') || 
    doc.content.toLowerCase().includes('founder') ||
    doc.content.toLowerCase().includes('employee')
  )
  
  const hasProductInfo = successfulDocs.some(doc => 
    doc.content.toLowerCase().includes('product') || 
    doc.content.toLowerCase().includes('technology') ||
    doc.content.toLowerCase().includes('feature')
  )

  // Content quality assessment
  let contentQuality: 'excellent' | 'good' | 'fair' | 'poor' = 'fair'
  if (totalWordCount > 15000 && successfulDocs.length > 5 && hasFinancialDocs && hasBusinessPlan) {
    contentQuality = 'excellent'
  } else if (totalWordCount > 8000 && successfulDocs.length > 3 && (hasFinancialDocs || hasBusinessPlan)) {
    contentQuality = 'good'
  } else if (totalWordCount > 3000 && successfulDocs.length > 2) {
    contentQuality = 'fair'
  } else {
    contentQuality = 'poor'
  }

  // Generate recommendations
  const recommendations: string[] = []
  if (!hasFinancialDocs) {
    recommendations.push('Upload financial documents (spreadsheets, financial reports, projections)')
  }
  if (!hasBusinessPlan) {
    recommendations.push('Include business plans, pitch decks, or executive summaries')
  }
  if (!hasMarketAnalysis) {
    recommendations.push('Add market research, competitive analysis, or industry reports')
  }
  if (!hasTeamInfo) {
    recommendations.push('Include team bios, organizational charts, or founder information')
  }
  if (!hasProductInfo) {
    recommendations.push('Add product specifications, technical documentation, or feature lists')
  }
  if (totalWordCount < 5000) {
    recommendations.push('Upload more comprehensive documents for better analysis depth')
  }
  if (successfulDocs.length < 3) {
    recommendations.push('Include multiple document types for comprehensive evaluation')
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200'
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'poor': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-600" />
      case 'fair': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'poor': return <XCircle className="w-4 h-4 text-red-600" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Document Quality Assessment</CardTitle>
            <CardDescription>
              Analysis of uploaded documents for investment evaluation
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Quality Score */}
        <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getQualityIcon(contentQuality)}
            <span className="text-lg font-semibold">Content Quality</span>
          </div>
          <Badge className={`text-sm px-4 py-2 ${getQualityColor(contentQuality)}`}>
            {contentQuality.charAt(0).toUpperCase() + contentQuality.slice(1)}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Based on {successfulDocs.length} documents with {totalWordCount.toLocaleString()} total words
          </p>
        </div>

        {/* Document Coverage Analysis */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Document Coverage Analysis
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg border text-center ${
              hasFinancialDocs ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                hasFinancialDocs ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div className="text-sm font-medium">Financial Data</div>
              <div className="text-xs text-muted-foreground">
                {hasFinancialDocs ? 'Available' : 'Missing'}
              </div>
            </div>

            <div className={`p-3 rounded-lg border text-center ${
              hasBusinessPlan ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <FileText className={`w-6 h-6 mx-auto mb-2 ${
                hasBusinessPlan ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div className="text-sm font-medium">Business Plan</div>
              <div className="text-xs text-muted-foreground">
                {hasBusinessPlan ? 'Available' : 'Missing'}
              </div>
            </div>

            <div className={`p-3 rounded-lg border text-center ${
              hasMarketAnalysis ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
                hasMarketAnalysis ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div className="text-sm font-medium">Market Analysis</div>
              <div className="text-xs text-muted-foreground">
                {hasMarketAnalysis ? 'Available' : 'Missing'}
              </div>
            </div>

            <div className={`p-3 rounded-lg border text-center ${
              hasTeamInfo ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <Users className={`w-6 h-6 mx-auto mb-2 ${
                hasTeamInfo ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div className="text-sm font-medium">Team Info</div>
              <div className="text-xs text-muted-foreground">
                {hasTeamInfo ? 'Available' : 'Missing'}
              </div>
            </div>

            <div className={`p-3 rounded-lg border text-center ${
              hasProductInfo ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <Building className={`w-6 h-6 mx-auto mb-2 ${
                hasProductInfo ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div className="text-sm font-medium">Product Info</div>
              <div className="text-xs text-muted-foreground">
                {hasProductInfo ? 'Available' : 'Missing'}
              </div>
            </div>

            <div className={`p-3 rounded-lg border text-center ${
              successfulDocs.length >= 3 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="w-6 h-6 mx-auto mb-2 text-center text-lg font-bold">
                {successfulDocs.length}
              </div>
              <div className="text-sm font-medium">Documents</div>
              <div className="text-xs text-muted-foreground">
                {successfulDocs.length >= 3 ? 'Sufficient' : 'Need more'}
              </div>
            </div>
          </div>
        </div>

        {/* Processing Status Summary */}
        {failedDocs.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {failedDocs.length} document{failedDocs.length > 1 ? 's' : ''} failed to process. 
              This may affect analysis quality.
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              Recommendations for Better Analysis
            </h4>
            
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-yellow-800">{rec}</span>
                </div>
              ))}
            </div>

            {onUploadMore && (
              <Button 
                variant="outline" 
                onClick={onUploadMore}
                className="w-full"
              >
                Upload Additional Documents
              </Button>
            )}
          </div>
        )}

        {/* Success Message */}
        {contentQuality === 'excellent' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Excellent document coverage! You have comprehensive materials for thorough investment analysis.
            </AlertDescription>
          </Alert>
        )}

        {/* Analysis Readiness */}
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-1">
            Analysis Readiness
          </div>
          <div className="text-xs text-blue-600">
            {contentQuality === 'excellent' || contentQuality === 'good' 
              ? 'Ready for comprehensive 4-lens analysis' 
              : contentQuality === 'fair'
              ? 'Ready for basic analysis (consider adding more documents)'
              : 'Limited analysis possible (recommend adding more documents)'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

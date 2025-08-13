import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react'
import { ProcessedDocument, ProcessingProgress, ProcessingSummary } from '@/lib/document-processor'

interface DocumentProcessingProgressProps {
  isProcessing: boolean
  progress: ProcessingProgress | null
  processedDocuments: ProcessedDocument[]
  onRetry?: () => void
  onDownload?: () => void
}

export function DocumentProcessingProgress({
  isProcessing,
  progress,
  processedDocuments,
  onRetry,
  onDownload
}: DocumentProcessingProgressProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [processingStats, setProcessingStats] = useState<ProcessingSummary | null>(null)

  useEffect(() => {
    if (processedDocuments.length > 0) {
      // Calculate processing summary
      const successful = processedDocuments.filter(doc => doc.processingStatus === 'completed')
      const failed = processedDocuments.filter(doc => doc.processingStatus === 'error')
      const totalProcessingTime = successful.reduce((sum, doc) => sum + (doc.processingTime || 0), 0)
      const averageProcessingTime = successful.length > 0 ? totalProcessingTime / successful.length : 0
      
      const fileTypeBreakdown: Record<string, number> = {}
      processedDocuments.forEach(doc => {
        fileTypeBreakdown[doc.fileType] = (fileTypeBreakdown[doc.fileType] || 0) + 1
      })
      
      const sizeBreakdown = { small: 0, medium: 0, large: 0 }
      processedDocuments.forEach(doc => {
        const fileSizeMB = doc.metadata.fileSize / (1024 * 1024)
        if (fileSizeMB < 1) sizeBreakdown.small++
        else if (fileSizeMB < 10) sizeBreakdown.medium++
        else sizeBreakdown.large++
      })

      setProcessingStats({
        successful: successful.length,
        failed: failed.length,
        totalProcessingTime,
        averageProcessingTime,
        fileTypeBreakdown,
        sizeBreakdown
      })
    }
  }, [processedDocuments])

  if (!isProcessing && processedDocuments.length === 0) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatProcessingTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Document Processing</CardTitle>
              <CardDescription>
                {isProcessing ? 'Processing uploaded documents...' : 'Processing complete'}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {onRetry && processedDocuments.some(doc => doc.processingStatus === 'error') && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Failed
              </Button>
            )}
            {onDownload && processedDocuments.length > 0 && (
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="w-4 h-4 mr-2" />
                Export Summary
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {isProcessing && progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Processing {progress.currentFile || 'documents'}...</span>
              <span>{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {progress.currentIndex + 1} of {progress.totalFiles} files
            </div>
          </div>
        )}

        {/* Processing Summary */}
        {processingStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{processingStats.successful}</div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border">
              <div className="text-2xl font-bold text-red-600">{processingStats.failed}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {formatProcessingTime(processingStats.averageProcessingTime)}
              </div>
              <div className="text-sm text-blue-700">Avg Time</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {processedDocuments.reduce((sum, doc) => sum + doc.wordCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">Total Words</div>
            </div>
          </div>
        )}

        {/* File Type Breakdown */}
        {processingStats && Object.keys(processingStats.fileTypeBreakdown).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="w-4 h-4" />
              File Type Distribution
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(processingStats.fileTypeBreakdown).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type.toUpperCase()}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Document List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Processed Documents</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {processedDocuments.map((doc, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all ${
                  doc.processingStatus === 'completed' 
                    ? 'bg-green-50 border-green-200' 
                    : doc.processingStatus === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(doc.processingStatus)}
                      <span className="font-medium text-sm truncate">{doc.fileName}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(doc.processingStatus)}`}
                      >
                        {doc.fileType.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {showDetails && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Size: {formatFileSize(doc.metadata.fileSize)}</div>
                        {doc.processingStatus === 'completed' && (
                          <>
                            <div>Words: {doc.wordCount.toLocaleString()}</div>
                            {doc.processingTime && (
                              <div>Processing: {formatProcessingTime(doc.processingTime)}</div>
                            )}
                            {doc.metadata.pageCount && <div>Pages: {doc.metadata.pageCount}</div>}
                            {doc.metadata.sheetCount && <div>Sheets: {doc.metadata.sheetCount}</div>}
                          </>
                        )}
                        {doc.processingStatus === 'error' && doc.errorMessage && (
                          <div className="text-red-600">Error: {doc.errorMessage}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Summary */}
        {processedDocuments.some(doc => doc.processingStatus === 'error') && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Some documents failed to process. Check the details above and try uploading them again.
            </AlertDescription>
          </Alert>
        )}

        {/* Success Summary */}
        {!isProcessing && processedDocuments.length > 0 && 
         processedDocuments.every(doc => doc.processingStatus === 'completed') && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              All documents processed successfully! Ready for analysis.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

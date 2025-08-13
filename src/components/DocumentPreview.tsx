import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, FileText, BarChart3, AlertTriangle } from 'lucide-react'
import { ProcessedDocument } from '@/lib/document-processor'

interface DocumentPreviewProps {
  documents: ProcessedDocument[]
  onRemove?: (index: number) => void
  className?: string
}

export function DocumentPreview({ documents, onRemove, className }: DocumentPreviewProps) {
  const [openDocuments, setOpenDocuments] = React.useState<Set<number>>(new Set())

  const toggleDocument = (index: number) => {
    const newOpen = new Set(openDocuments)
    if (newOpen.has(index)) {
      newOpen.delete(index)
    } else {
      newOpen.add(index)
    }
    setOpenDocuments(newOpen)
  }

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return '📄'
      case 'docx':
        return '📝'
      case 'pptx':
        return '📊'
      case 'xlsx':
        return '📈'
      case 'txt':
        return '📄'
      default:
        return '📄'
    }
  }

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800'
      case 'docx':
        return 'bg-blue-100 text-blue-800'
      case 'pptx':
        return 'bg-orange-100 text-orange-800'
      case 'xlsx':
        return 'bg-green-100 text-green-800'
      case 'txt':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (documents.length === 0) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Analysis Preview
        </CardTitle>
        <CardDescription>
          Review the extracted content that will be analyzed by the AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((doc, index) => (
          <Collapsible
            key={`${doc.fileName}-${index}`}
            open={openDocuments.has(index)}
            onOpenChange={() => toggleDocument(index)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">{getFileTypeIcon(doc.fileType)}</span>
                  <div>
                    <div className="font-medium">{doc.fileName}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className={getFileTypeColor(doc.fileType)}>
                        {doc.fileType.toUpperCase()}
                      </Badge>
                      <span>{doc.wordCount} words</span>
                    </div>
                  </div>
                </div>
                {openDocuments.has(index) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-2">
              <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
                {/* Document Summary */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Document Summary</h4>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {doc.summary}
                  </div>
                </div>

                {/* Key Metrics (for spreadsheets) */}
                {doc.keyMetrics && Object.keys(doc.keyMetrics).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Key Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(doc.keyMetrics).map(([sheet, metrics]: [string, any]) => (
                        <div key={sheet} className="bg-background p-2 rounded border">
                          <div className="font-medium text-xs text-muted-foreground">{sheet}</div>
                          <div className="text-xs">
                            {metrics.rows} rows × {metrics.columns} columns
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Preview */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Content Preview</h4>
                  <div className="max-h-40 overflow-y-auto text-sm text-muted-foreground bg-background p-3 rounded border">
                    {doc.content.length > 1000 
                      ? `${doc.content.substring(0, 1000)}...`
                      : doc.content
                    }
                  </div>
                  {doc.content.length > 1000 && (
                    <div className="text-xs text-muted-foreground text-center">
                      Content truncated for preview (full content will be analyzed)
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                {onRemove && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemove(index)}
                      className="w-full text-destructive hover:text-destructive"
                    >
                      Remove Document
                    </Button>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Analysis Note */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <div className="font-medium">AI Analysis Note:</div>
              <div className="text-xs mt-1">
                The AI will analyze all {documents.length} document(s) with a total of{' '}
                {documents.reduce((sum, doc) => sum + doc.wordCount, 0)} words to provide 
                comprehensive investment insights based on the uploaded materials.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

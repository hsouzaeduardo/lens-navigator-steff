import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface SimplePDFPreviewProps {
  filename: string
  content: string
}

export function SimplePDFPreview({ 
  filename,
  content
}: SimplePDFPreviewProps) {
  const [showPreview, setShowPreview] = useState(false)

  const handleExport = () => {
    // Create a blob from the content
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    // Create a link and trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.txt`
    a.click()
    
    // Clean up
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
    >
      <Download className="h-4 w-4 mr-2" />
      Export as Text
    </Button>
  )
}

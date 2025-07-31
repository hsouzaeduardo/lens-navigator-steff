import * as React from "react"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileUpload: (files: File[]) => void
  onFileRemove: (index: number) => void
  uploadedFiles: File[]
  isUploading?: boolean
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  className?: string
}

export function FileUpload({
  onFileUpload,
  onFileRemove,
  uploadedFiles,
  isUploading = false,
  accept = ".pdf,.docx,.pptx,.xlsx,.txt",
  maxSize = 10,
  maxFiles = 20,
  className
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(Array.from(files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const validFiles: File[] = []
    
    for (const file of newFiles) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is ${maxSize}MB`)
        continue
      }
      
      // Check if we'll exceed max files
      if (uploadedFiles.length + validFiles.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`)
        break
      }
      
      // Check if file already exists
      if (uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
        continue
      }
      
      validFiles.push(file)
    }
    
    if (validFiles.length > 0) {
      onFileUpload([...uploadedFiles, ...validFiles])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200",
          isDragging 
            ? "border-primary bg-primary/5 scale-105" 
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          uploadedFiles.length >= maxFiles && "opacity-50 pointer-events-none"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploadedFiles.length >= maxFiles}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isDragging ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isUploading ? "Uploading..." : "Drop files here or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              Up to {maxFiles} files • PDF, DOCX, PPTX, XLSX, TXT (max {maxSize}MB each)
            </p>
            {uploadedFiles.length > 0 && (
              <p className="text-xs text-primary">
                {uploadedFiles.length} of {maxFiles} files uploaded
              </p>
            )}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || uploadedFiles.length >= maxFiles}
          >
            {uploadedFiles.length === 0 ? "Select Files" : "Add More Files"}
          </Button>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Uploaded Files ({uploadedFiles.length})
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onFileRemove(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
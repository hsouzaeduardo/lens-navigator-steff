import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"
import { Briefcase, DollarSign, TrendingUp } from "lucide-react"

interface AnalysisFormProps {
  onSubmit: (data: {
    companyName: string
    targetValuation: string
    file: File
  }) => void
  isLoading?: boolean
}

export function AnalysisForm({ onSubmit, isLoading = false }: AnalysisFormProps) {
  const [companyName, setCompanyName] = useState("")
  const [targetValuation, setTargetValuation] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName || !uploadedFile) return
    
    onSubmit({
      companyName,
      targetValuation,
      file: uploadedFile
    })
  }

  const isFormValid = companyName.trim() && uploadedFile

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl">Investment Analysis Request</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Upload materials for 4-lens IC evaluation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Company Name *
              </Label>
              <Input
                id="company-name"
                type="text"
                placeholder="e.g., Axenya"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="transition-all duration-200 focus:shadow-md"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-valuation" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Target Post-Money (Optional)
              </Label>
              <Input
                id="target-valuation"
                type="text"
                placeholder="e.g., $40M"
                value={targetValuation}
                onChange={(e) => setTargetValuation(e.target.value)}
                className="transition-all duration-200 focus:shadow-md"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Supporting Materials *</Label>
            <FileUpload
              onFileUpload={setUploadedFile}
              onFileRemove={() => setUploadedFile(null)}
              uploadedFile={uploadedFile}
              isUploading={isLoading}
              maxSize={25}
            />
          </div>
          
          <div className="pt-4 border-t">
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-primary shadow-md hover:shadow-lg transition-all duration-300"
              size="lg"
            >
              {isLoading ? "Running Analysis..." : "Start 4-Lens Analysis"}
            </Button>
            
            {isFormValid && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Analysis will evaluate through Skeptical, Contrarian, Optimistic, and CFO lenses
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
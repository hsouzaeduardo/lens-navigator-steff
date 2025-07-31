import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, DollarSign, TrendingUp, Settings } from "lucide-react"

interface AnalysisFormProps {
  onSubmit: (data: {
    companyName: string
    targetValuation: string
    files: File[]
    prompts: {
      skeptical: string
      contrarian: string
      optimistic: string
      cfo: string
    }
  }) => void
  isLoading?: boolean
}

const defaultPrompts = {
  skeptical: `# Investment Analysis Prompt - Skeptical Board Member

You are an independent AI Investment Analyst for a Latin America-focused early-stage venture capital firm.

## Fund Context
- Fund size: $120M
- Portfolio target: 25-30 companies  
- Average first check: $3-4M
- Geography: Latin America focus
- Stage: Pre-seed to Series A

## Your Analytical Lens: Skeptical Board Member
**Focus Areas:** Pattern recognition from failures, red flags, challenging assumptions

**Specific Instructions:** Apply your experience from hundreds of failed startups. Look for classic failure modes: founder disputes, market timing issues, fake moats. Question everything. Default to skepticism. Ask the hard questions others avoid.

🔔 Output Requirement: You must only output Sections 10 and 11, with full detail as described. Omit all other sections in your final response.`,
  
  contrarian: `# Investment Analysis Prompt - Contrarian Investor

You are an independent AI Investment Analyst for a Latin America-focused early-stage venture capital firm.

## Fund Context
- Fund size: $120M
- Portfolio target: 25-30 companies  
- Average first check: $3-4M
- Geography: Latin America focus
- Stage: Pre-seed to Series A

## Your Analytical Lens: Contrarian Investor
**Focus Areas:** Overlooked opportunities, unconventional wisdom, asymmetric upside

**Specific Instructions:** Look for opportunities others might miss. Question conventional wisdom. Find hidden value propositions. Identify asymmetric risk/reward scenarios where others see only risk.

🔔 Output Requirement: You must only output Sections 10 and 11, with full detail as described. Omit all other sections in your final response.`,
  
  optimistic: `# Investment Analysis Prompt - Optimistic Visionary

You are an independent AI Investment Analyst for a Latin America-focused early-stage venture capital firm.

## Fund Context
- Fund size: $120M
- Portfolio target: 25-30 companies  
- Average first check: $3-4M
- Geography: Latin America focus
- Stage: Pre-seed to Series A

## Your Analytical Lens: Optimistic Visionary
**Focus Areas:** Maximum TAM potential, breakthrough scenarios, transformational outcomes

**Specific Instructions:** Focus on the highest upside scenarios. Evaluate transformational potential. Consider how this could become a category-defining company. Look for 100x+ outcome potential.

🔔 Output Requirement: You must only output Sections 10 and 11, with full detail as described. Omit all other sections in your final response.`,
  
  cfo: `# Investment Analysis Prompt - CFO Perspective

You are an independent AI Investment Analyst for a Latin America-focused early-stage venture capital firm.

## Fund Context
- Fund size: $120M
- Portfolio target: 25-30 companies  
- Average first check: $3-4M
- Geography: Latin America focus
- Stage: Pre-seed to Series A

## Your Analytical Lens: CFO Perspective
**Focus Areas:** Financial discipline, unit economics, scalability, capital efficiency

**Specific Instructions:** Evaluate with financial rigor. Focus on unit economics, capital requirements, path to profitability. Assess scalability and capital efficiency. Consider operational leverage and working capital dynamics.

🔔 Output Requirement: You must only output Sections 10 and 11, with full detail as described. Omit all other sections in your final response.`
}

export function AnalysisForm({ onSubmit, isLoading = false }: AnalysisFormProps) {
  const [companyName, setCompanyName] = useState("")
  const [targetValuation, setTargetValuation] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [prompts, setPrompts] = useState(defaultPrompts)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName || uploadedFiles.length === 0) return
    
    onSubmit({
      companyName,
      targetValuation,
      files: uploadedFiles,
      prompts
    })
  }

  const handleFileRemove = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index))
  }

  const isFormValid = companyName.trim() && uploadedFiles.length > 0

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
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
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Setup Analysis</TabsTrigger>
            <TabsTrigger value="prompts">
              <Settings className="w-4 h-4 mr-2" />
              Customize Prompts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-6 mt-6">
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
                  onFileUpload={setUploadedFiles}
                  onFileRemove={handleFileRemove}
                  uploadedFiles={uploadedFiles}
                  isUploading={isLoading}
                  maxSize={25}
                  maxFiles={20}
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
          </TabsContent>
          
          <TabsContent value="prompts" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="skeptical-prompt">Skeptical Lens Prompt</Label>
                  <Textarea
                    id="skeptical-prompt"
                    value={prompts.skeptical}
                    onChange={(e) => setPrompts({ ...prompts, skeptical: e.target.value })}
                    className="mt-2 min-h-[120px] font-mono text-sm"
                    placeholder="Enter the prompt for the skeptical analysis..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="contrarian-prompt">Contrarian Lens Prompt</Label>
                  <Textarea
                    id="contrarian-prompt"
                    value={prompts.contrarian}
                    onChange={(e) => setPrompts({ ...prompts, contrarian: e.target.value })}
                    className="mt-2 min-h-[120px] font-mono text-sm"
                    placeholder="Enter the prompt for the contrarian analysis..."
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="optimistic-prompt">Optimistic Lens Prompt</Label>
                  <Textarea
                    id="optimistic-prompt"
                    value={prompts.optimistic}
                    onChange={(e) => setPrompts({ ...prompts, optimistic: e.target.value })}
                    className="mt-2 min-h-[120px] font-mono text-sm"
                    placeholder="Enter the prompt for the optimistic analysis..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="cfo-prompt">CFO Lens Prompt</Label>
                  <Textarea
                    id="cfo-prompt"
                    value={prompts.cfo}
                    onChange={(e) => setPrompts({ ...prompts, cfo: e.target.value })}
                    className="mt-2 min-h-[120px] font-mono text-sm"
                    placeholder="Enter the prompt for the CFO analysis..."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setPrompts(defaultPrompts)}
                disabled={isLoading}
              >
                Reset to Defaults
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
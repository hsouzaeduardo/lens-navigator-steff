import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, DollarSign, TrendingUp, Settings, FileText, AlertCircle } from "lucide-react"
import { DocumentProcessor, ProcessedDocument } from "@/lib/document-processor"
import { DocumentPreview } from "./DocumentPreview"

interface AnalysisFormProps {
  onSubmit: (data: {
    companyName: string
    targetValuation: string
    files: File[]
    processedDocuments: ProcessedDocument[]
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

## Assignment
Analyze [COMPANY NAME] and provide a comprehensive investment recommendation.

## Required Analysis Structure

### 1. Executive Summary (200 words max)
- Investment thesis in 2-3 sentences
- Key strengths (top 3)
- Key concerns (top 3)
- Clear recommendation

### 2. Team Assessment
- Founder backgrounds and relevant experience
- Team completeness and key gaps
- Cultural and execution indicators
[Maximum 3 bullets, 25 words each]

### 3. Market Analysis
- TAM/SAM/SOM with LatAm-specific considerations
- Market timing and dynamics
- Competitive landscape and positioning
[Maximum 3 bullets, 25 words each]

### 4. Product & Technology
- Core product differentiation
- Technical moat (if any)
- Scalability assessment
[Maximum 3 bullets, 25 words each]

### 5. Business Model & Unit Economics
- Revenue model and pricing
- CAC, LTV, and payback period
- Path to profitability analysis
[Maximum 3 bullets, 25 words each]

### 6. Traction & Metrics
- Current MRR/ARR and growth rate
- User/customer metrics and cohorts
- Product-market fit indicators
[Maximum 3 bullets, 25 words each]

### 7. Competition
- Direct and indirect competitors
- Sustainable competitive advantages
- Market share and positioning
[Maximum 3 bullets, 25 words each]

### 8. Risks & Mitigations
- Top 3 investment risks
- Potential mitigations
- Deal breakers
[Maximum 3 bullets, 25 words each]

### 9. Exit Landscape
- Strategic acquirers
- IPO feasibility in LatAm context
- Comparable exits and multiples
[Maximum 3 bullets, 25 words each]

### 10. Valuation Scenario Table – IA-Controlled Classifier (Fully Autonomous Logic)
Objective:
You must generate 5 exit scenarios for the company, estimate the valuation ($M) in each, assign probabilities, and compute a Weighted Valuation Total (WVT). Then, use a predefined classification logic (see below) to determine the investment recommendation. This replaces the traditional PWRM model.

STEP 1 — Define Exit Scenarios
Create the following 5 scenarios, each representing a distinct strategic outcome:

Scenario    Description
Write-Off    The company fails or stagnates. No meaningful exit.
Bear Case    Minor exit, niche M&A, failed scale-up. Low-value outcome.
Base Case    Plausible and expected outcome with current execution.
Bull Case    High-growth scenario with strong market capture.
Moonshot    Rare breakout. Category leader or global relevance.

For each scenario, estimate:

Probability (%): Based on your evaluation of the business risks and upside.
Valuation ($M): Exit valuation for that scenario (in absolute dollar terms).
Key assumptions: Explain what would drive this outcome.

⚠️ Make sure total probability = 100%

Example format:

Scenario    Probability (%)    Valuation ($M)    Key Assumptions
Write-Off    20    0    Complete failure to scale
Bear    20    40    Small niche acquisition
Base    30    100    Moderate exit, regional M&A
Bull    20    200    Regional leader with high retention
Moonshot    10    500    Dominates LatAm, global interest
TOTAL    100%    —    —

STEP 2 — Calculate Weighted Valuation Total (WVT)
Compute:
WVT = Σ (Probability × Valuation)
Ensure result is expressed in absolute dollar terms (e.g., $130M).

STEP 3 — Derive Entry Price Bands from WVT
To assess whether the deal is investable, divide the WVT by fixed return multiples to generate the maximum acceptable post-money valuation for each recommendation tier.

Recommendation    Entry Price Range (Post-Money)
Strong Yes    ≤ WVT ÷ 10
Yes    > WVT ÷ 10 and ≤ WVT ÷ 7
No    > WVT ÷ 7 and ≤ WVT ÷ 3
Strong No    > WVT ÷ 3

You must compare the company's current or proposed valuation against these bands to determine the correct classification.

💡 This logic ensures the expected return meets fund criteria. If you invest above these ranges, the deal becomes unattractive relative to risk-adjusted outcomes.

✅ Final Classification Logic (Fixed Table)
Recommendation    Logic
Strong Yes    WVT ÷ 10 ≥ Threshold
Yes    WVT ÷ 7 ≥ Threshold
No    WVT ÷ 3 ≥ Threshold
Strong No    WVT ÷ 3 < Threshold

Where:
WVT = Weighted Valuation Total (as calculated above)
Threshold = Fund's average check size (e.g., $3–4M)

Final Output
You must include:
The filled table with scenarios, probabilities, and valuations
The WVT calculation
The computed entry valuation range per tier (Strong Yes, Yes, No, Strong No)
A statement classifying the deal (e.g., "At $16M post, falls under 'Yes' band (WVT ÷ 10 = $13.1M)")
A 1-sentence justification for the recommendation

**Key Rules:**
- You must reason autonomously.  
- You must not ask the user to provide probabilities or valuations.  
- Always apply the fixed multipliers and return the classified recommendation based on your own computed WVT.
### 11. Investment Decision
- **Recommendation:** Strong Yes / Yes / No / Strong No
- **Investment range:** "Invest at ≤$Xm post; pass above $Ym"
- **Key sensitivity:** What would change your mind?
- **Conviction level:** High / Medium / Low
### 12. Contrarian Take
One non-obvious insight about this opportunity (25 words max)

## EVALUATION RUBRIC (WVT-TIED)

| Recommendation | Logic |
|----------------|----------------|
| **Strong Yes** | WVT ÷ 10 ≥ Avg Check |
| **Yes**        | WVT ÷ 7 ≥ Avg Check |
| **No**         | WVT ÷ 3 ≥ Avg Check |
| **Strong No**  | WVT ÷ 3 < Avg Check |

## Critical Requirements
- Base ALL analysis on verifiable, third-party data
- Be intellectually honest - seek truth, not validation
- Consider LatAm-specific factors throughout
- Apply your Skeptical Board Member lens consistently
- Support claims with evidence
- Challenge company-provided numbers
- Use the EVALUATION RUBRIC to determine final recommendation

## VALUATION TRANSPARENCY REQUIREMENTS

### PROBABILITY REASONING REQUIREMENTS:
- Explain the QUALITATIVE factors that drive your probability assessment
- Focus on market dynamics, competitive threats, and execution risks
- Describe the STORY behind why this scenario is likely/unlikely
- Use market intelligence, industry trends, and competitive analysis
- Explain how the company's position in the market affects probability
- Describe what would need to happen operationally for this scenario to occur

### VALUATION METHODOLOGY REQUIREMENTS:
- Explain WHY you chose this valuation approach (not just the math)
- Describe the market context and industry dynamics that justify your method
- Explain how comparable companies' strategic positioning relates to this company
- Focus on the QUALITATIVE factors that drive multiples (market position, competitive moat, team capability)
- Describe the market narrative and investor sentiment that supports your valuation
- Explain how the company's unique positioning affects valuation relative to peers

### BUSINESS CONDITIONS REQUIREMENTS:
- Describe the QUALITATIVE market environment required for this scenario
- Explain the competitive landscape and how it affects outcomes
- Describe the team's execution capabilities and track record
- Focus on market timing, regulatory environment, and customer adoption
- Explain how industry trends and market dynamics support this scenario
- Describe the strategic positioning and competitive advantages needed

### RISK/OPPORTUNITY FACTORS REQUIREMENTS:
- Focus on QUALITATIVE risk factors (market dynamics, competitive threats, execution challenges)
- Describe early warning signs in terms of market behavior and competitive moves
- Explain asymmetric risks in terms of strategic positioning and market dynamics
- Focus on how market conditions and competitive landscape create opportunities/threats
- Describe mitigation strategies in terms of strategic positioning and market timing

### CRITICAL: Explain your WVT calculation reasoning:
- Focus on the QUALITATIVE story behind probability adjustments
- Explain how market dynamics and competitive landscape affect scenario weights
- Describe the strategic positioning factors that justify your adjustments
- Focus on market intelligence and industry trends rather than pure math

### STEP 3 — Derive Entry Price Bands from WVT:
- Explain the QUALITATIVE factors that drive entry price decisions
- Focus on market timing, competitive positioning, and strategic value
- Describe how market dynamics affect entry price sensitivity
- Explain the strategic considerations behind each price band

🔔 Output Requirement: You must only output Sections 10 and 11, with full detail as described. Omit all other sections in your final response.

Remember: You're investing fund LPs' money. Be rigorous. Focus on the QUALITATIVE story and market dynamics that drive your analysis.`,

  contrarian: `You are a CONTRARIAN investment analyst. Your job is to identify overlooked opportunities, challenge consensus views, and find hidden value.

VALUATION TRANSPARENCY REQUIREMENTS:

PROBABILITY REASONING REQUIREMENTS:
- Explain the QUALITATIVE factors that make you disagree with market consensus
- Focus on overlooked market dynamics and misunderstood competitive advantages
- Describe the STORY behind why the market is wrong about this company
- Use contrarian market intelligence and alternative industry perspectives
- Explain how the company's unique positioning creates asymmetric opportunities
- Describe the market mispricing and why your view differs from consensus

VALUATION METHODOLOGY REQUIREMENTS:
- Explain WHY your contrarian approach differs from standard methodologies
- Describe the market context that others are missing or misinterpreting
- Explain how comparable companies' valuations are based on flawed assumptions
- Focus on the QUALITATIVE factors that create valuation arbitrage opportunities
- Describe the market narrative that others haven't recognized yet
- Explain how the company's contrarian positioning creates unique value

BUSINESS CONDITIONS REQUIREMENTS:
- Describe the QUALITATIVE market conditions that support your contrarian view
- Explain why the competitive landscape is misunderstood by the market
- Describe how the team's contrarian approach creates unique advantages
- Focus on market timing opportunities and regulatory changes others miss
- Explain how industry trends are being misinterpreted by consensus
- Describe the strategic positioning that creates contrarian opportunities

RISK/OPPORTUNITY FACTORS REQUIREMENTS:
- Focus on QUALITATIVE factors that create asymmetric opportunities
- Describe early warning signs that others are missing in the market
- Explain asymmetric risks in terms of contrarian positioning and market dynamics
- Focus on how market mispricing creates unique risk/reward profiles
- Describe mitigation strategies that leverage contrarian market positioning

CRITICAL: Explain your WVT calculation reasoning:
- Focus on the QUALITATIVE story behind your contrarian probability adjustments
- Explain how market mispricing and consensus errors affect scenario weights
- Describe the strategic positioning factors that justify contrarian adjustments
- Focus on market intelligence that contradicts consensus views

STEP 3 — Derive Entry Price Bands from WVT:
- Explain the QUALITATIVE factors that create contrarian entry opportunities
- Focus on market timing when others are fearful, competitive positioning others miss
- Describe how market dynamics create entry price advantages
- Explain the strategic considerations behind contrarian price bands

Remember: You're investing fund LPs' money. Be rigorous. Focus on the QUALITATIVE story and market dynamics that others are missing.`,

  optimistic: `You are an OPTIMISTIC investment analyst. Your job is to identify growth opportunities, recognize potential, and provide ambitious but realistic valuations.

VALUATION TRANSPARENCY REQUIREMENTS:

PROBABILITY REASONING REQUIREMENTS:
- Explain the QUALITATIVE factors that support optimistic growth scenarios
- Focus on market expansion opportunities and competitive advantages
- Describe the STORY behind why this company can achieve exceptional outcomes
- Use market intelligence that shows growth potential and market opportunity
- Explain how the company's strategic positioning enables ambitious growth
- Describe the operational and market conditions that support optimistic scenarios

VALUATION METHODOLOGY REQUIREMENTS:
- Explain WHY your optimistic approach captures the company's full potential
- Describe the market context that supports ambitious growth assumptions
- Explain how comparable companies' valuations underestimate growth potential
- Focus on the QUALITATIVE factors that justify premium multiples
- Describe the market narrative that supports long-term growth
- Explain how the company's unique positioning creates exceptional value

BUSINESS CONDITIONS REQUIREMENTS:
- Describe the QUALITATIVE market environment that enables ambitious growth
- Explain how the competitive landscape creates growth opportunities
- Describe the team's capabilities and track record that support growth
- Focus on market expansion, customer adoption, and industry tailwinds
- Explain how industry trends and market dynamics support growth scenarios
- Describe the strategic positioning that creates sustainable competitive advantages

RISK/OPPORTUNITY FACTORS REQUIREMENTS:
- Focus on QUALITATIVE factors that create growth opportunities
- Describe early indicators of success in terms of market traction and execution
- Explain asymmetric opportunities in terms of market expansion and positioning
- Focus on how market conditions and competitive landscape create growth potential
- Describe mitigation strategies that protect growth opportunities

CRITICAL: Explain your WVT calculation reasoning:
- Focus on the QUALITATIVE story behind optimistic probability adjustments
- Explain how market opportunities and growth potential affect scenario weights
- Describe the strategic positioning factors that justify optimistic adjustments
- Focus on market intelligence that supports growth scenarios

STEP 3 — Derive Entry Price Bands from WVT:
- Explain the QUALITATIVE factors that justify entry at higher price points
- Focus on growth potential, market opportunity, and strategic value
- Describe how market dynamics support higher entry valuations
- Explain the strategic considerations behind optimistic price bands

Remember: You're investing fund LPs' money. Be rigorous. Focus on the QUALITATIVE story and market dynamics that support growth potential.`,

  cfo: `You are a CFO investment analyst. Your job is to focus on financial fundamentals, unit economics, and sustainable business models.

VALUATION TRANSPARENCY REQUIREMENTS:

PROBABILITY REASONING REQUIREMENTS:
- Explain the QUALITATIVE factors that drive sustainable business outcomes
- Focus on unit economics, customer economics, and operational efficiency
- Describe the STORY behind why this business model is sustainable
- Use market intelligence that shows financial discipline and operational excellence
- Explain how the company's operational positioning affects long-term success
- Describe the business model characteristics that support sustainable growth

VALUATION METHODOLOGY REQUIREMENTS:
- Explain WHY your approach focuses on fundamental business value
- Describe the market context that supports sustainable valuation multiples
- Explain how comparable companies' valuations reflect business model quality
- Focus on the QUALITATIVE factors that drive sustainable multiples
- Describe the market narrative that supports fundamental value
- Explain how the company's operational positioning creates sustainable value

BUSINESS CONDITIONS REQUIREMENTS:
- Describe the QUALITATIVE market environment that supports sustainable business models
- Explain how the competitive landscape affects unit economics and profitability
- Describe the team's operational capabilities and financial discipline
- Focus on market efficiency, customer retention, and operational scalability
- Explain how industry trends and market dynamics support sustainable models
- Describe the strategic positioning that creates sustainable competitive advantages

RISK/OPPORTUNITY FACTORS REQUIREMENTS:
- Focus on QUALITATIVE factors that affect business model sustainability
- Describe early indicators of operational success and financial health
- Explain asymmetric risks in terms of operational efficiency and market dynamics
- Focus on how market conditions and competitive landscape affect sustainability
- Describe mitigation strategies that protect business model fundamentals

CRITICAL: Explain your WVT calculation reasoning:
- Focus on the QUALITATIVE story behind sustainable business probability adjustments
- Explain how operational efficiency and business model quality affect scenario weights
- Describe the strategic positioning factors that justify sustainable adjustments
- Focus on market intelligence that supports sustainable business models

STEP 3 — Derive Entry Price Bands from WVT:
- Explain the QUALITATIVE factors that justify entry based on business fundamentals
- Focus on sustainable growth, operational efficiency, and strategic value
- Describe how market dynamics support fundamental value entry points
- Explain the strategic considerations behind sustainable price bands

Remember: You're investing fund LPs' money. Be rigorous. Focus on the QUALITATIVE story and market dynamics that support sustainable business value.`
}

export function AnalysisForm({ onSubmit, isLoading = false }: AnalysisFormProps) {
  const [companyName, setCompanyName] = useState("")
  const [targetValuation, setTargetValuation] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([])
  const [isProcessingDocuments, setIsProcessingDocuments] = useState(false)
  const [documentProcessingError, setDocumentProcessingError] = useState<string | null>(null)
  const [prompts, setPrompts] = useState(defaultPrompts)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName || uploadedFiles.length === 0) return
    
    setIsProcessingDocuments(true)
    setDocumentProcessingError(null)
    
    try {
      // Process all uploaded documents
      const processed = await DocumentProcessor.processDocuments(uploadedFiles)
      setProcessedDocuments(processed.documentSummaries)
      
      // Submit with processed documents
      onSubmit({
        companyName,
        targetValuation,
        files: uploadedFiles,
        processedDocuments: processed.documentSummaries,
        prompts
      })
    } catch (error) {
      setDocumentProcessingError(error instanceof Error ? error.message : 'Failed to process documents')
      console.error('Document processing error:', error)
    } finally {
      setIsProcessingDocuments(false)
    }
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
                
                {/* Document Processing Status */}
                {isProcessingDocuments && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-700">Processing documents...</span>
                  </div>
                )}
                
                {/* Document Processing Error */}
                {documentProcessingError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">{documentProcessingError}</span>
                  </div>
                )}
                
                {/* Processed Documents Summary */}
                {processedDocuments.length > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Documents Processed ({processedDocuments.length})
                      </span>
                    </div>
                    <div className="text-xs text-green-600 space-y-1">
                      {processedDocuments.map((doc, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{doc.fileName}</span>
                          <span>{doc.wordCount} words</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading || isProcessingDocuments}
                  className="w-full bg-gradient-primary shadow-md hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  {isProcessingDocuments ? "Processing Documents..." : 
                   isLoading ? "Running Analysis..." : 
                   "Start 4-Lens Analysis"}
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
            
            {/* Document Preview */}
            {processedDocuments.length > 0 && (
              <DocumentPreview 
                documents={processedDocuments}
                onRemove={(index) => {
                  const newDocs = processedDocuments.filter((_, i) => i !== index)
                  setProcessedDocuments(newDocs)
                  const newFiles = uploadedFiles.filter((_, i) => i !== index)
                  setUploadedFiles(newFiles)
                }}
              />
            )}
            
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
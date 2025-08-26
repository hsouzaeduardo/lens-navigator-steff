import OpenAI from 'openai'
import type { Response } from 'openai/resources/responses/responses'

// Lazy initialization of OpenAI client
let openai: OpenAI | null = null

const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.')
    }
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Only for development - in production, use server-side
    })
  }
  return openai
}

// Types for deep research
export interface DeepResearchRequest {
  query: string
  companyName: string
  vectorStoreIds?: string[]
  files?: File[]  // Add direct file upload support
  useWebSearch?: boolean
  useCodeInterpreter?: boolean
  maxToolCalls?: number
}

export interface DeepResearchResponse {
  id: string
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'incomplete'
  output?: string
  annotations?: Array<{
    url: string
    title: string
    start_index: number
    end_index: number
  }>
  error?: string
}

// Unified 4-Lens Deep Research Prompt
export const enrichInvestmentPrompt = (request: DeepResearchRequest): string => {
  return `# Investment Analysis Prompt - 4-Lens Deep Research Analysis

You are an independent AI Investment Analyst for a Latin America-focused early-stage venture capital firm conducting a comprehensive 4-lens analysis.

## Fund Context
- Fund size: $120M
- Portfolio target: 25-30 companies  
- Average first check: $3-4M
- Geography: Latin America focus
- Stage: Pre-seed to Series A

## Your Analytical Approach: 4-Lens Deep Research
You must analyze ${request.companyName} through FOUR distinct analytical perspectives simultaneously:

### LENS 1: SKEPTICAL BOARD MEMBER
**Focus:** Pattern recognition from failures, red flags, challenging assumptions
**Instructions:** Apply experience from hundreds of failed startups. Look for classic failure modes: founder disputes, market timing issues, fake moats. Question everything. Default to skepticism. Ask the hard questions others avoid.

### LENS 2: CONTRARIAN ANALYST  
**Focus:** Non-consensus insights, market misconceptions, hidden opportunities
**Instructions:** Challenge ALL consensus views. Find where the market is wrong. Identify hidden strengths in 'bad' ideas and hidden weaknesses in 'hot' startups. Look for asymmetric risk/reward. Your edge comes from seeing what others miss.

### LENS 3: OPTIMISTIC FOUNDER
**Focus:** Massive upside potential, network effects, vision
**Instructions:** Focus on what could go RIGHT. Model exponential growth scenarios, network effects, and winner-take-all dynamics. See the billion-dollar outcome. Balance optimism with fund return requirements.

### LENS 4: CFO MODE
**Focus:** Unit economics, burn rate, financial sustainability
**Instructions:** Obsess over unit economics, CAC payback periods, LTV/CAC ratios, gross margins, contribution margins, burn rate, and runway. Model different growth scenarios and their cash needs. Flag any financial red flags immediately.

## Assignment
Analyze ${request.companyName} through ALL FOUR lenses simultaneously and provide a unified investment recommendation that synthesizes these perspectives.

## Required Analysis Structure

### 1. Executive Summary (300 words max)
- Investment thesis in 2-3 sentences
- Key strengths (top 3) - synthesize across all lenses
- Key concerns (top 3) - synthesize across all lenses
- Clear recommendation with lens-specific reasoning

### 2. Multi-Lens Analysis
For each of the 4 lenses, provide:

#### SKEPTICAL LENS INSIGHTS
- Top 3 failure risks and red flags
- Critical assumptions that could be wrong
- Deal breakers and warning signs

#### CONTRARIAN LENS INSIGHTS  
- Non-consensus market views
- Hidden opportunities others miss
- Asymmetric risk/reward scenarios

#### OPTIMISTIC LENS INSIGHTS
- Exponential growth potential
- Network effects and winner-take-all dynamics
- Billion-dollar outcome scenarios

#### CFO LENS INSIGHTS
- Unit economics analysis
- Financial sustainability assessment
- Cash flow and runway considerations

### 3. Unified Team Assessment
- Founder backgrounds and relevant experience
- Team completeness and key gaps
- Cultural and execution indicators
[Maximum 3 bullets, 25 words each]

### 4. Unified Market Analysis
- TAM/SAM/SOM with LatAm-specific considerations
- Market timing and dynamics
- Competitive landscape and positioning
[Maximum 3 bullets, 25 words each]

### 5. Unified Product & Technology
- Core product differentiation
- Technical moat (if any)
- Scalability assessment
[Maximum 3 bullets, 25 words each]

### 6. Unified Business Model & Unit Economics
- Revenue model and pricing
- CAC, LTV, and payback period
- Path to profitability analysis
[Maximum 3 bullets, 25 words each]

### 7. Unified Traction & Metrics
- Current MRR/ARR and growth rate
- User/customer metrics and cohorts
- Product-market fit indicators
[Maximum 3 bullets, 25 words each]

### 8. Unified Competition
- Direct and indirect competitors
- Sustainable competitive advantages
- Market share and positioning
[Maximum 3 bullets, 25 words each]

### 9. Unified Risks & Mitigations
- Top 3 investment risks (synthesized across lenses)
- Potential mitigations
- Deal breakers
[Maximum 3 bullets, 25 words each]

### 10. Unified Exit Landscape
- Strategic acquirers
- IPO feasibility in LatAm context
- Comparable exits and multiples
[Maximum 3 bullets, 25 words each]

### 11. Valuation Scenario Table – 4-Lens IA-Controlled Classifier
Objective:
Generate 5 exit scenarios using insights from ALL FOUR lenses, estimate valuations, assign probabilities, and compute WVT. Use the predefined classification logic to determine the investment recommendation.

STEP 1 — Define Exit Scenarios (4-Lens Informed)
Create the following 5 scenarios, each representing a distinct strategic outcome informed by all 4 lenses:

Scenario    Description
Write-Off    The company fails or stagnates. No meaningful exit.
Bear Case    Minor exit, niche M&A, failed scale-up. Low-value outcome.
Base Case    Plausible and expected outcome with current execution.
Bull Case    High-growth scenario with strong market capture.
Moonshot    Rare breakout. Category leader or global relevance.

For each scenario, estimate:

Probability (%): Based on your 4-lens evaluation of business risks and upside.
Valuation ($M): Exit valuation for that scenario (in absolute dollar terms).
Key assumptions: Explain what would drive this outcome (reference specific lens insights).

⚠️ Make sure total probability = 100%

Example format:

Scenario    Probability (%)    Valuation ($M)    Key Assumptions (4-Lens Informed)
Write-Off    20    0    [Skeptical: Founder disputes + CFO: Cash burn]
Bear    20    40    [Contrarian: Hidden niche + CFO: Unit economics]
Base    30    100    [All lenses balanced assessment]
Bull    20    200    [Optimistic: Network effects + CFO: Sustainable growth]
Moonshot    10    500    [Optimistic: Winner-take-all + Contrarian: Market blind spot]
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
- You must reason autonomously using ALL FOUR lenses.  
- You must not ask the user to provide probabilities or valuations.  
- Always apply the fixed multipliers and return the classified recommendation based on your own computed WVT.
- Each scenario must reflect insights from multiple lenses.

### 12. Investment Decision
- **Recommendation:** Strong Yes / Yes / No / Strong No
- **Investment range:** "Invest at ≤$Xm post; pass above $Ym"
- **Key sensitivity:** What would change your mind? (4-lens perspective)
- **Conviction level:** High / Medium / Low
- **Lens-specific reasoning:** Brief explanation of how each lens influenced the decision

### 13. 4-Lens Synthesis
- **Skeptical take:** What's the biggest risk others are missing?
- **Contrarian take:** What non-obvious insight gives us an edge?
- **Optimistic take:** What's the path to massive upside?
- **CFO take:** What financial metric is most critical?

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
- Apply ALL FOUR lenses consistently throughout the analysis
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
- **4-LENS INTEGRATION:** Show how each lens influences probability assessment

### VALUATION METHODOLOGY REQUIREMENTS:
- Explain WHY you chose this valuation approach (not just the math)
- Describe the market context and industry dynamics that justify your method
- Explain how comparable companies' strategic positioning relates to this company
- Focus on the QUALITATIVE factors that drive multiples (market position, competitive moat, team capability)
- Describe the market narrative and investor sentiment that supports your valuation
- Explain how the company's unique positioning affects valuation relative to peers
- **4-LENS INTEGRATION:** Show how each lens affects valuation methodology

### BUSINESS CONDITIONS REQUIREMENTS:
- Describe the QUALITATIVE market environment required for this scenario
- Explain the competitive landscape and how it affects outcomes
- Describe the team's execution capabilities and track record
- Focus on market timing, regulatory environment, and customer adoption
- Explain how industry trends and market dynamics support this scenario
- Describe the strategic positioning and competitive advantages needed
- **4-LENS INTEGRATION:** Show how each lens affects business condition assessment

### RISK/OPPORTUNITY FACTORS REQUIREMENTS:
- Focus on QUALITATIVE risk factors (market dynamics, competitive threats, execution challenges)
- Describe early warning signs in terms of market behavior and competitive moves
- Explain asymmetric risks in terms of strategic positioning and market dynamics
- Focus on how market conditions and competitive landscape create opportunities/threats
- Describe mitigation strategies in terms of strategic positioning and market timing
- **4-LENS INTEGRATION:** Show how each lens identifies different risk/opportunity factors

### CRITICAL: Explain your WVT calculation reasoning:
- Focus on the QUALITATIVE story behind probability adjustments
- Explain how market dynamics and competitive landscape affect scenario weights
- Describe the strategic positioning factors that justify your adjustments
- Focus on market intelligence and industry trends rather than pure math
- **4-LENS INTEGRATION:** Show how each lens influences probability and valuation adjustments

### STEP 3 — Derive Entry Price Bands from WVT:
- Explain the QUALITATIVE factors that drive entry price decisions
- Focus on market timing, competitive positioning, and strategic value
- Describe how market dynamics affect entry price sensitivity
- Explain the strategic considerations behind each price band
- **4-LENS INTEGRATION:** Show how each lens affects entry price sensitivity

🔔 Output Requirement: You must only output Sections 11, 12, and 13, with full detail as described. Omit all other sections in your final response.

Remember: You're investing fund LPs' money. Be rigorous. Focus on the QUALITATIVE story and market dynamics that drive your analysis. Your analysis must reflect ALL FOUR lenses working together to provide a comprehensive investment thesis.`
}

// Start a deep research task
export const startDeepResearch = async (
  request: DeepResearchRequest
): Promise<DeepResearchResponse> => {
  try {
    console.log('🔬 Starting deep research for:', request.companyName)
    
    // Enrich the prompt with additional context about uploaded files
    let enrichedPrompt = enrichInvestmentPrompt(request)
    
    // If files are provided, add information about them to the prompt
    if (request.files && request.files.length > 0) {
      const fileInfo = request.files.map(file => 
        `- ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${file.type || 'unknown type'})`
      ).join('\n');
      
      enrichedPrompt += `\n\n## UPLOADED COMPANY DOCUMENTS\nThe following documents have been provided for analysis:\n${fileInfo}\n\nPlease incorporate insights from these documents into your analysis.`;
      console.log(`📄 Including ${request.files.length} uploaded documents in analysis`)
    }
    
    // Build tools array based on request
    const tools: any[] = []
    
    if (request.useWebSearch !== false) {
      tools.push({ type: 'web_search_preview' })
    }
    
    if (request.vectorStoreIds && request.vectorStoreIds.length > 0) {
      tools.push({
        type: 'file_search',
        vector_store_ids: request.vectorStoreIds.slice(0, 2) // Max 2 vector stores
      })
    }
    
    // Add file_upload tool if files are provided
    if (request.files && request.files.length > 0) {
      tools.push({
        type: 'file_upload',
        file_count: request.files.length
      })
    }
    
    if (request.useCodeInterpreter) {
      tools.push({
        type: 'code_interpreter',
        container: { type: 'auto' }
      })
    }
    
    // Create FormData for file uploads if needed
    let requestOptions: any = {
      model: 'o3-deep-research',
      input: enrichedPrompt,
      background: true, // Use background mode for long-running tasks
      tools: tools.length > 0 ? tools : [{ type: 'web_search_preview' }],
      max_tool_calls: request.maxToolCalls || 100,
      store: true, // Required for background mode
      metadata: {
        company: request.companyName,
        timestamp: new Date().toISOString()
      }
    }
    
    // If files are provided, prepare them for upload
    if (request.files && request.files.length > 0) {
      const formData = new FormData()
      
      // Add all request parameters to formData
      formData.append('model', requestOptions.model)
      formData.append('input', requestOptions.input)
      formData.append('background', String(requestOptions.background))
      formData.append('tools', JSON.stringify(requestOptions.tools))
      formData.append('max_tool_calls', String(requestOptions.maxToolCalls || 100))
      formData.append('store', String(requestOptions.store))
      formData.append('metadata', JSON.stringify(requestOptions.metadata))
      
      // Add all files
      request.files.forEach((file, index) => {
        formData.append(`file_${index}`, file)
      })
      
      console.log('📤 Uploading files with deep research request')
      
      // Note: This is a placeholder as the current SDK doesn't directly support file uploads
      // In a production environment, you would use the OpenAI API directly with fetch
      console.log('⚠️ File upload with deep research is not fully implemented in the current SDK')
      
      // For now, we'll use the standard request without files
    }
    
    const response = await getOpenAIClient().responses.create(requestOptions as any)
    
    return {
      id: response.id,
      status: response.status,
      output: response.output_text,
      annotations: response.output_text ? extractAnnotations(response) : undefined
    }
  } catch (error) {
    console.error('❌ Deep research error:', error)
    return {
      id: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Poll for research completion
export const pollDeepResearch = async (
  responseId: string,
  onProgress?: (status: string) => void
): Promise<DeepResearchResponse> => {
  let attempts = 0
  const maxAttempts = 600 // 20 minutes with 2 second intervals
  
  while (attempts < maxAttempts) {
    try {
      const response = await getOpenAIClient().responses.retrieve(responseId)
      
      if (onProgress) {
        onProgress(response.status)
      }
      
      if (response.status === 'completed') {
        return {
          id: response.id,
          status: response.status,
          output: response.output_text,
          annotations: response.output_text ? extractAnnotations(response) : undefined
        }
      } else if (response.status === 'failed' || response.status === 'cancelled') {
        return {
          id: response.id,
          status: response.status,
          error: `Research ${response.status}`
        }
      }
      
      // Continue polling for queued or in_progress
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
      attempts++
    } catch (error) {
      console.error('❌ Polling error:', error)
      return {
        id: responseId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  return {
    id: responseId,
    status: 'failed',
    error: 'Research timed out after 20 minutes'
  }
}

// Cancel a running research task
export const cancelDeepResearch = async (responseId: string): Promise<boolean> => {
  try {
    await getOpenAIClient().responses.cancel(responseId)
    return true
  } catch (error) {
    console.error('❌ Cancel error:', error)
    return false
  }
}

// Extract citations/annotations from response
const extractAnnotations = (response: Response): any[] => {
  // Deep research includes annotations in the message output
  if (response.output && Array.isArray(response.output)) {
    for (const item of response.output) {
      if (item.type === 'message' && item.content) {
        for (const content of item.content) {
          if (content.type === 'output_text' && content.annotations) {
            return content.annotations
          }
        }
      }
    }
  }
  return []
}

// Create and manage vector stores for company data
// Note: Vector stores API is not available in current OpenAI SDK version
// These functions are placeholder implementations
export const createVectorStore = async (
  name: string,
  files: File[]
): Promise<string | null> => {
  try {
    console.log('⚠️ Vector stores not implemented in current SDK version')
    console.log('Would create vector store:', name, 'with', files.length, 'files')
    
    // Return a mock ID for now
    return `mock-vector-store-${Date.now()}`
  } catch (error) {
    console.error('❌ Vector store creation error:', error)
    return null
  }
}

// List available vector stores
export const listVectorStores = async (): Promise<Array<{
  id: string
  name: string
  file_count: number
  created_at: string
}>> => {
  try {
    console.log('⚠️ Vector stores not implemented in current SDK version')
    
    // Return empty array for now
    return []
  } catch (error) {
    console.error('❌ List vector stores error:', error)
    return []
  }
}

// Delete a vector store
export const deleteVectorStore = async (vectorStoreId: string): Promise<boolean> => {
  try {
    console.log('⚠️ Vector stores not implemented in current SDK version')
    console.log('Would delete vector store:', vectorStoreId)
    
    return true
  } catch (error) {
    console.error('❌ Delete vector store error:', error)
    return false
  }
}

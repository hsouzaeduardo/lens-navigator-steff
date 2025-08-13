import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  companyName: string
  lens: string
  prompt: string
  files?: string[] // Base64 encoded files or file content
  documentContent?: string
}

async function callAzureOpenAI(prompt: string, companyName: string, lens: string): Promise<any> {
  const endpoint = 'https://oai-canarynho-brsouth-dev-001.openai.azure.com'
  const deployment = 'gpt-4o-mini'
  const apiVersion = '2025-01-01-preview'
  const api_key = '4yFNLK4bxi0ATZibAZzxKodlMU4cgVn9YoX93oEHltWongBtSh4vJQQJ99BHACYeBjFXJ3w3AAABACOGgUMa'
  
  if (!endpoint) {
    throw new Error('Missing Azure OpenAI endpoint')
  }

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`
  
  const payload = {
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: prompt
          }
        ]
      },
      {
        role: "user", 
        content: [
          {
            type: "text",
            text: `Please analyze ${companyName} using the ${lens} lens according to the instructions provided. 

IMPORTANT: You must return ONLY valid JSON that matches this exact structure - no other text, no HTML, no markdown:

{
  "lens": "${lens}",
  "recommendation": "Yes/No/Strong Yes/Strong No",
  "entryRange": "$X - $Y",
  "conviction": "Low/Medium/High",
  "keySensitivity": "Description of main factor",
  "scenarios": {
    "writeOff": {
      "probability": 15,
      "value": "$0",
      "probabilityCalculation": "Detailed reasoning for this probability",
      "riskFactorAnalysis": "Risk analysis for this scenario",
      "valuationMethod": "How valuation was calculated",
      "comparableCompanies": "Market comparables analysis",
      "calculationSteps": "Step-by-step calculation",
      "operationalConditions": "Operational factors",
      "validationMetrics": "Validation metrics",
      "riskFactorQuantification": "Quantified risk factors",
      "earlyWarningIndicators": "Early warning signs"
    },
    "bear": { /* same structure as writeOff */ },
    "base": { /* same structure as writeOff */ },
    "bull": { /* same structure as writeOff */ },
    "moonshot": { /* same structure as writeOff */ }
  },
  "weightedValuation": "$XM",
  "wvtReasoning": "Reasoning behind WVT",
  "wvtCalculation": "WVT calculation steps",
  "wvtAdjustments": "Adjustments made to WVT",
  "industryComparison": "Industry positioning",
  "entryPriceBands": {
    "strongYes": "$X",
    "yes": "$Y",
    "no": "$Z",
    "strongNo": "$W+"
  },
  "fundLogic": "Investment logic for this lens",
  "status": "completed"
}

Ensure all probabilities sum to 100% and provide realistic valuations based on the ${lens} perspective.`
          }
        ]
      }
    ],
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 16384
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': `${api_key}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Azure OpenAI API call failed: ${response.statusText}`)
  }

  return await response.json()
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 BREAKPOINT: Iniciando análise Azure OpenAI')
    const { companyName, lens, prompt, files }: AnalysisRequest = await req.json()
    console.log('📊 Dados recebidos:', { companyName, lens, prompt: prompt.substring(0, 100) + '...' })

    // Call Azure OpenAI
    const result = await callAzureOpenAI(prompt, companyName, lens)
    
    // Extract the content from the LLM response
    const llmContent = result.choices[0]?.message?.content || ''
    
    // Try to parse the JSON response
    let parsedResult
    try {
      parsedResult = JSON.parse(llmContent)
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError)
      console.log('Raw LLM response:', llmContent)
      
      // Return error if we can't parse the response
      return new Response(
        JSON.stringify({
          success: false,
          error: 'LLM returned invalid JSON format',
          rawResponse: llmContent
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        lens,
        result: parsedResult,
        usage: result.usage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in azure-openai-analysis:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
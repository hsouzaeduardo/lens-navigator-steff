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
}

async function callAzureOpenAI(prompt: string, companyName: string): Promise<any> {
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
            text: `Please analyze ${companyName} according to the instructions provided.`
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
    const { companyName, lens, prompt, files }: AnalysisRequest = await req.json()

    // Call Azure OpenAI
    const result = await callAzureOpenAI(prompt, companyName)

    return new Response(
      JSON.stringify({
        success: true,
        lens,
        analysis: result.choices[0]?.message?.content || '',
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
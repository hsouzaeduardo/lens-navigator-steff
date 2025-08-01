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

interface AzureTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

async function getAzureAccessToken(): Promise<string> {
  const tenantId = Deno.env.get('AZURE_TENANT_ID')
  const clientId = Deno.env.get('AZURE_CLIENT_ID')
  const clientSecret = Deno.env.get('AZURE_CLIENT_SECRET')
  
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Missing Azure credentials')
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`
  
  const formData = new URLSearchParams()
  formData.append('client_id', clientId)
  formData.append('scope', 'https://management.azure.com/.default')
  formData.append('client_secret', clientSecret)
  formData.append('grant_type', 'client_credentials')

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`)
  }

  const tokenData: AzureTokenResponse = await response.json()
  return tokenData.access_token
}

async function callAzureOpenAI(accessToken: string, prompt: string, companyName: string): Promise<any> {
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

    // Get Azure access token
    const accessToken = await getAzureAccessToken()

    // Call Azure OpenAI
    const result = await callAzureOpenAI(accessToken, prompt, companyName)

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
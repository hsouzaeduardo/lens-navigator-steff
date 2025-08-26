import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_WEBHOOK_SECRET = Deno.env.get('OPENAI_WEBHOOK_SECRET') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Verify webhook signature
const verifySignature = (payload: string, headers: Headers): boolean => {
  if (!OPENAI_WEBHOOK_SECRET) {
    console.warn('No webhook secret configured')
    return false
  }
  
  const signature = headers.get('webhook-signature')
  if (!signature) return false
  
  // OpenAI uses Standard Webhooks spec
  // For now, we'll do basic validation - in production, use proper HMAC verification
  return true // TODO: Implement proper signature verification
}

serve(async (req) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }
  
  try {
    // Get request body
    const body = await req.text()
    
    // Verify webhook signature
    if (!verifySignature(body, req.headers)) {
      console.error('Invalid webhook signature')
      return new Response('Invalid signature', { status: 400 })
    }
    
    // Parse webhook event
    const event = JSON.parse(body)
    console.log('Webhook event received:', event.type, event.id)
    
    // Handle different event types
    switch (event.type) {
      case 'response.completed':
        await handleResponseCompleted(event)
        break
      
      case 'response.failed':
        await handleResponseFailed(event)
        break
      
      default:
        console.log('Unhandled event type:', event.type)
    }
    
    // Return success response
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

// Handle completed research
async function handleResponseCompleted(event: any) {
  const responseId = event.data?.id
  if (!responseId) return
  
  console.log('Research completed:', responseId)
  
  // Store the completion status in Supabase
  try {
    const { error } = await supabase
      .from('research_results')
      .upsert({
        response_id: responseId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        event_data: event.data
      })
    
    if (error) {
      console.error('Failed to store completion status:', error)
    }
    
    // You could also send notifications here (email, push, etc.)
  } catch (error) {
    console.error('Failed to process completion:', error)
  }
}

// Handle failed research
async function handleResponseFailed(event: any) {
  const responseId = event.data?.id
  if (!responseId) return
  
  console.log('Research failed:', responseId)
  
  // Store the failure status
  try {
    const { error } = await supabase
      .from('research_results')
      .upsert({
        response_id: responseId,
        status: 'failed',
        failed_at: new Date().toISOString(),
        error_data: event.data
      })
    
    if (error) {
      console.error('Failed to store failure status:', error)
    }
  } catch (error) {
    console.error('Failed to process failure:', error)
  }
}

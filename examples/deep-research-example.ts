/**
 * Example: Using Deep Research API for Investment Analysis
 * 
 * This example demonstrates how to use OpenAI's deep research models
 * for comprehensive investment analysis.
 */

import { 
  startDeepResearch, 
  pollDeepResearch, 
  createVectorStore,
  type DeepResearchRequest 
} from '../src/lib/openai-deep-research'

// Example 1: Basic web search research
async function basicResearch() {
  console.log('🔍 Example 1: Basic Web Search Research')
  
  const request: DeepResearchRequest = {
    query: 'Analyze the investment potential of Stripe',
    companyName: 'Stripe',
    useWebSearch: true,
    useCodeInterpreter: true,
    maxToolCalls: 100
  }
  
  // Start research
  const response = await startDeepResearch(request)
  console.log('Research started, ID:', response.id)
  
  // Poll for completion
  const result = await pollDeepResearch(response.id, (status) => {
    console.log('Status:', status)
  })
  
  if (result.status === 'completed') {
    console.log('✅ Research complete!')
    console.log('Analysis:', result.output)
    console.log('Sources cited:', result.annotations?.length || 0)
  }
}

// Example 2: Research with private documents
async function privateDataResearch() {
  console.log('\n📁 Example 2: Research with Private Documents')
  
  // First, create a vector store with company documents
  const files = [
    new File(['Q3 2024 Revenue: $2.5M...'], 'q3-report.pdf'),
    new File(['Product roadmap for 2025...'], 'roadmap.txt'),
    new File(['Customer testimonials...'], 'testimonials.docx')
  ]
  
  const vectorStoreId = await createVectorStore('Acme Corp Docs', files)
  if (!vectorStoreId) {
    console.error('Failed to create vector store')
    return
  }
  
  console.log('Vector store created:', vectorStoreId)
  
  // Run research using the vector store
  const request: DeepResearchRequest = {
    query: 'Based on internal documents, assess Acme Corp revenue growth and product-market fit',
    companyName: 'Acme Corp',
    vectorStoreIds: [vectorStoreId],
    useWebSearch: false, // Only use internal data
    useCodeInterpreter: true
  }
  
  const response = await startDeepResearch(request)
  const result = await pollDeepResearch(response.id)
  
  console.log('Analysis:', result.output)
}

// Example 3: Comprehensive research (web + private data)
async function comprehensiveResearch() {
  console.log('\n🌐 Example 3: Comprehensive Research')
  
  const request: DeepResearchRequest = {
    query: `
      Provide investment analysis for TechCo:
      1. Compare against public competitors
      2. Analyze our internal metrics
      3. Project 5-year growth scenarios
      4. Recommend entry valuation
    `,
    companyName: 'TechCo',
    vectorStoreIds: ['vs_your_vector_store_id'],
    useWebSearch: true,
    useCodeInterpreter: true,
    maxToolCalls: 150 // Allow more searches for thorough analysis
  }
  
  const response = await startDeepResearch(request)
  
  // Show progress updates
  let lastUpdate = Date.now()
  const result = await pollDeepResearch(response.id, (status) => {
    const elapsed = Math.round((Date.now() - lastUpdate) / 1000)
    console.log(`[${elapsed}s] Status: ${status}`)
  })
  
  if (result.status === 'completed' && result.output) {
    // Extract key insights
    const lines = result.output.split('\n')
    const recommendation = lines.find(l => l.includes('Recommendation:'))
    const valuation = lines.find(l => l.includes('Entry Range:'))
    
    console.log('\n📊 Key Insights:')
    console.log(recommendation)
    console.log(valuation)
    
    // Show sources
    if (result.annotations) {
      console.log('\n📚 Sources Used:')
      result.annotations.slice(0, 5).forEach(ann => {
        console.log(`- ${ann.title} (${ann.url})`)
      })
    }
  }
}

// Example 4: Using in a React component
export function ReactExample() {
  /*
  import { useDeepResearch } from '@/hooks/use-deep-research'
  
  function InvestmentAnalysis() {
    const { 
      startResearch, 
      isLoading, 
      progress, 
      result, 
      error 
    } = useDeepResearch()
    
    const handleAnalyze = async () => {
      await startResearch({
        query: 'Full investment analysis',
        companyName: 'Target Company',
        useWebSearch: true,
        useCodeInterpreter: true
      })
    }
    
    return (
      <div>
        <button onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? progress : 'Start Deep Research'}
        </button>
        
        {error && <div>Error: {error}</div>}
        
        {result?.output && (
          <div dangerouslySetInnerHTML={{ __html: result.output }} />
        )}
      </div>
    )
  }
  */
}

// Run examples (uncomment to test)
// basicResearch().catch(console.error)
// privateDataResearch().catch(console.error)
// comprehensiveResearch().catch(console.error)

# Deep Research Integration Guide

This guide explains how to set up and use OpenAI's Deep Research API in your Lens Navigator platform.

## Overview

Deep Research models (o3-deep-research and o4-mini-deep-research) are designed for complex analysis tasks that require:
- Searching and synthesizing hundreds of sources
- Creating comprehensive reports at the level of a research analyst
- Analyzing both public web data and private company documents
- Performing complex calculations and data analysis

## Setup Instructions

### 1. Get OpenAI API Access

1. Sign up for an OpenAI account at [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys section
3. Create a new API key
4. **Important**: Deep Research requires access to o3-deep-research model. Contact OpenAI sales if you need access.

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-openai-api-key

# For webhook support (optional but recommended)
OPENAI_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 3. Set Up Webhooks (Recommended)

Webhooks allow you to receive notifications when long-running research tasks complete:

1. Go to [OpenAI Dashboard > Webhooks](https://platform.openai.com/webhooks)
2. Create a new webhook endpoint:
   - Name: "Deep Research Notifications"
   - URL: `https://your-domain.com/functions/v1/openai-webhook`
   - Events: Select `response.completed` and `response.failed`
3. Copy the webhook secret and add it to your `.env` file

### 4. Deploy Webhook Handler

If using Supabase Edge Functions:

```bash
supabase functions deploy openai-webhook
```

## Using Deep Research in Your Application

### Basic Usage

```typescript
import { useDeepResearch } from '@/hooks/use-deep-research'

function MyComponent() {
  const { startResearch, isLoading, result, error } = useDeepResearch()
  
  const handleResearch = async () => {
    await startResearch({
      query: "Analyze Apple's competitive position in the smartphone market",
      companyName: "Apple Inc.",
      useWebSearch: true,
      useCodeInterpreter: true
    })
  }
  
  // ... render UI
}
```

### With Vector Stores (Private Data)

1. **Upload Company Documents**:
```typescript
const { uploadFiles } = useDeepResearch()

// Upload financial reports, presentations, etc.
const vectorStoreId = await uploadFiles(
  "Q3 2024 Reports", 
  [file1, file2, file3]
)
```

2. **Use in Research**:
```typescript
await startResearch({
  query: "Analyze revenue trends from our internal reports",
  companyName: "Acme Corp",
  vectorStoreIds: [vectorStoreId],
  useWebSearch: false // Only use internal data
})
```

## Key Features

### 1. Background Mode
- Deep research runs asynchronously
- Can take 2-20 minutes depending on complexity
- Continues running even if connection drops
- Use polling or webhooks to check status

### 2. Tool Configuration
- **Web Search**: Searches public internet for information
- **File Search**: Searches your uploaded documents in vector stores
- **Code Interpreter**: Performs calculations and data analysis

### 3. Cost Control
- Use `maxToolCalls` parameter to limit the number of searches
- Default is 100, can go up to 200+ for thorough research
- Each tool call incurs API costs

## Best Practices

### 1. Prompt Engineering

Good prompts for investment analysis:
```typescript
const enrichedPrompt = `
Research ${companyName} for investment potential.

REQUIREMENTS:
1. Investment Decision: Clear Yes/No with conviction (1-10)
2. Valuation: Entry ranges and targets with rationale
3. Risk Assessment: Key risks and mitigations
4. Scenarios: 5 cases (Write-off to Moonshot) with probabilities
5. Data: Use recent financials, cite all sources

FORMAT: Structured sections with headers
TONE: Professional, data-driven, analytical
`
```

### 2. Data Organization

- Create separate vector stores for different data types:
  - Financial reports
  - Industry research
  - Competitor analysis
  - Internal memos
- Name vector stores descriptively
- Delete old vector stores to save costs

### 3. Security Considerations

- **Never expose API keys in frontend code**
- Use server-side functions for production
- Validate webhook signatures
- Be careful with prompt injection when using web search
- Consider running in phases:
  1. Public web search first
  2. Then private data analysis (without web access)

### 4. Error Handling

```typescript
const { startResearch, error, cancelResearch } = useDeepResearch()

// Handle timeouts
setTimeout(() => {
  if (isLoading) {
    cancelResearch()
  }
}, 20 * 60 * 1000) // 20 minute timeout

// Handle errors
if (error) {
  if (error.includes('timeout')) {
    // Retry with fewer tool calls
  } else if (error.includes('rate limit')) {
    // Wait and retry
  }
}
```

## Cost Optimization

1. **Use o4-mini-deep-research for**:
   - Smaller research tasks
   - Initial exploration
   - Cost-sensitive applications

2. **Use o3-deep-research for**:
   - Comprehensive investment analysis
   - Complex multi-source research
   - High-stakes decisions

3. **Reduce costs by**:
   - Limiting `maxToolCalls`
   - Using vector stores instead of web search when possible
   - Caching results for repeated queries
   - Using more specific queries

## Troubleshooting

### Common Issues

1. **"Model not found" error**
   - Ensure you have access to deep research models
   - Contact OpenAI sales for access

2. **Timeouts**
   - Use background mode (already configured)
   - Implement proper polling
   - Consider webhooks for long tasks

3. **Empty results**
   - Check if web search is enabled
   - Verify vector store IDs are correct
   - Ensure query is specific enough

4. **High costs**
   - Monitor usage in OpenAI dashboard
   - Reduce `maxToolCalls`
   - Use o4-mini for testing

## Example Integration

Here's how to add deep research to your existing analysis flow:

```typescript
// In your main analysis component
import { DeepResearchAnalysis } from '@/components/DeepResearchAnalysis'

function AnalysisPage() {
  const [companyName, setCompanyName] = useState('')
  const [deepResearchResult, setDeepResearchResult] = useState('')
  
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="quick">Quick Analysis</TabsTrigger>
        <TabsTrigger value="deep">Deep Research</TabsTrigger>
      </TabsList>
      
      <TabsContent value="quick">
        {/* Your existing Azure OpenAI analysis */}
      </TabsContent>
      
      <TabsContent value="deep">
        <DeepResearchAnalysis 
          companyName={companyName}
          onComplete={setDeepResearchResult}
        />
      </TabsContent>
    </Tabs>
  )
}
```

## Monitoring and Analytics

Track research performance:

```typescript
// Log research metrics
const logResearch = async (result: DeepResearchResponse) => {
  await fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({
      responseId: result.id,
      duration: Date.now() - startTime,
      toolCalls: result.toolCallCount,
      status: result.status
    })
  })
}
```

## Next Steps

1. **Test with sample companies** to understand response quality
2. **Upload relevant documents** to vector stores
3. **Fine-tune prompts** for your specific use case
4. **Monitor costs** and adjust parameters
5. **Implement caching** for frequently researched companies

## Support

- [OpenAI Documentation](https://platform.openai.com/docs/guides/deep-research)
- [API Reference](https://platform.openai.com/docs/api-reference/responses)
- [Pricing Calculator](https://openai.com/pricing)

For issues specific to this integration, check the error logs in your browser console and Supabase function logs.

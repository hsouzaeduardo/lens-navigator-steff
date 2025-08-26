# Deep Research Troubleshooting Guide

## Common Issues and Solutions

### 1. "Model not found" Error

**Error**: `The model 'o3-deep-research' does not exist`

**Solution**:
- Deep research models require special access
- Contact OpenAI sales: https://openai.com/contact-sales
- In the meantime, you can test with `gpt-4` for similar (but less comprehensive) results

### 2. API Key Issues

**Error**: `Invalid API key provided`

**Solution**:
1. Check your `.env` file has the correct key:
   ```
   VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
   ```
2. Ensure the key has access to deep research models
3. Never commit your API key to git

### 3. CORS Errors in Browser

**Error**: `Access to fetch at 'api.openai.com' blocked by CORS`

**Solution**:
- The integration uses `dangerouslyAllowBrowser: true` for development
- For production, implement a backend API:
  ```typescript
  // Move API calls to your backend
  // Frontend calls your backend, backend calls OpenAI
  ```

### 4. Timeout Issues

**Symptom**: Research takes too long and times out

**Solution**:
- Deep research can take 5-20 minutes
- The integration uses background mode by default
- Check polling is working correctly
- Consider implementing webhooks for better reliability

### 5. Vector Store Issues

**Error**: `Failed to create vector store`

**Solutions**:
1. Check file size limits (max 512MB per file)
2. Ensure supported file types: .pdf, .docx, .txt, .csv
3. Verify your API key has vector store permissions

### 6. High Costs

**Symptom**: Unexpectedly high API usage

**Solutions**:
1. Reduce `maxToolCalls` parameter:
   ```typescript
   maxToolCalls: 50 // Default is 100
   ```
2. Use `o4-mini-deep-research` instead of `o3-deep-research`
3. Disable web search for internal-only analysis
4. Cache results for repeated queries

### 7. Webhook Not Receiving Events

**Checklist**:
1. Verify webhook URL is publicly accessible
2. Check webhook secret matches in both places
3. Ensure your server responds with 2xx status code
4. Check Supabase function logs:
   ```bash
   supabase functions logs openai-webhook
   ```

### 8. Empty or Poor Quality Results

**Solutions**:
1. Improve your prompts - be specific and detailed
2. Ensure web search is enabled for public data
3. Upload relevant documents to vector stores
4. Increase `maxToolCalls` for more thorough research

### 9. Rate Limiting

**Error**: `Rate limit exceeded`

**Solutions**:
1. Implement exponential backoff:
   ```typescript
   await new Promise(resolve => 
     setTimeout(resolve, Math.pow(2, attempt) * 1000)
   )
   ```
2. Queue requests instead of parallel execution
3. Upgrade your OpenAI plan for higher limits

### 10. Development vs Production Issues

**Development Setup**:
```typescript
// Safe for development only
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})
```

**Production Setup**:
```typescript
// Backend API endpoint
app.post('/api/deep-research', async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  // ... handle request
})
```

## Debug Mode

Enable debug logging:

```typescript
// In your .env
VITE_DEBUG_DEEP_RESEARCH=true

// In your code
if (import.meta.env.VITE_DEBUG_DEEP_RESEARCH) {
  console.log('Deep Research Debug:', {
    request,
    response,
    timing: Date.now() - startTime
  })
}
```

## Performance Tips

1. **Pre-warm Vector Stores**: Create and populate vector stores ahead of time
2. **Batch Uploads**: Upload multiple files at once
3. **Use Webhooks**: More efficient than polling for long tasks
4. **Cache Results**: Store completed research in your database

## Getting Help

1. Check OpenAI status: https://status.openai.com
2. Review API docs: https://platform.openai.com/docs
3. OpenAI Discord: https://discord.com/invite/openai
4. Support: https://help.openai.com

## Example Error Handler

```typescript
const handleDeepResearchError = (error: any) => {
  if (error.message?.includes('model')) {
    return 'Deep research access required. Contact OpenAI sales.'
  }
  if (error.message?.includes('timeout')) {
    return 'Research is taking longer than expected. Try again with fewer sources.'
  }
  if (error.message?.includes('rate')) {
    return 'Too many requests. Please wait a moment and try again.'
  }
  return 'An unexpected error occurred. Please try again.'
}
```

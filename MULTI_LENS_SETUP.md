# Setting Up Multi-Lens Analysis with Zapier

This guide explains how to set up your Zapier workflows to run each lens analysis separately.

## Overview

Instead of running a single unified analysis, you'll run four separate analyses - one for each lens perspective:

1. Skeptical Lens
2. Contrarian Lens
3. Optimistic Lens
4. CFO Lens

Each lens will use its own specific prompt and will be processed independently by the OpenAI Deep Research API.

## Implementation Options

### Option 1: Multiple Zaps (Recommended)

Create four separate Zaps, one for each lens:

1. **Skeptical Lens Zap**:
   - Webhook Trigger: `/hooks/catch/skeptical`
   - OpenAI Action: Process with Skeptical lens prompt
   - Response: Return analysis results

2. **Contrarian Lens Zap**:
   - Webhook Trigger: `/hooks/catch/contrarian`
   - OpenAI Action: Process with Contrarian lens prompt
   - Response: Return analysis results

3. **Optimistic Lens Zap**:
   - Webhook Trigger: `/hooks/catch/optimistic`
   - OpenAI Action: Process with Optimistic lens prompt
   - Response: Return analysis results

4. **CFO Lens Zap**:
   - Webhook Trigger: `/hooks/catch/cfo`
   - OpenAI Action: Process with CFO lens prompt
   - Response: Return analysis results

Your application would then:
1. Send four separate requests, one to each Zap
2. Process each response as it comes in
3. Combine the results into a unified analysis

### Option 2: Single Zap with Path Branching

Create one Zap with path branching based on the lens type:

1. **Webhook Trigger**: Catch all lens requests
2. **Path A (Skeptical)**:
   - Condition: `lensType` equals "Skeptical"
   - OpenAI Action: Process with Skeptical lens prompt
3. **Path B (Contrarian)**:
   - Condition: `lensType` equals "Contrarian"
   - OpenAI Action: Process with Contrarian lens prompt
4. **Path C (Optimistic)**:
   - Condition: `lensType` equals "Optimistic"
   - OpenAI Action: Process with Optimistic lens prompt
5. **Path D (CFO)**:
   - Condition: `lensType` equals "CFO"
   - OpenAI Action: Process with CFO lens prompt
6. **Response**: Return analysis results

## Implementing in Your Application

To implement the multi-lens approach in your application:

1. Uncomment the multi-lens code in `src/hooks/use-zapier-deepresearch.ts`
2. Update the `processSingleLensAnalysis` function to use the appropriate prompt for each lens
3. Start the multi-lens proxy server:
   ```
   node proxy-server-multi-lens.js
   ```
4. Update your application's webhook URL:
   ```
   const ZAPIER_WEBHOOK_URL = 'http://localhost:8005/zapier';
   ```

## Testing with Mock Responses

The `proxy-server-multi-lens.js` file includes mock responses for each lens type. When you send a request with a specific `lensType`, it will return the corresponding mock response.

To test:

1. Start the multi-lens proxy server:
   ```
   node proxy-server-multi-lens.js
   ```
2. Update your application to use the multi-lens approach
3. Submit an analysis in your application
4. The proxy server will return the appropriate mock response based on the lens type

## Production Setup

In production, you'll need to:

1. Create the Zapier workflows for each lens (or a single workflow with path branching)
2. Update your application to use the real Zapier webhook URLs
3. Implement error handling for cases where one or more lens analyses fail

## Combining Results

When running each lens separately, you'll need to combine the results into a unified analysis. The commented code in `src/hooks/use-zapier-deepresearch.ts` shows how to do this:

```typescript
// Combine the results from all lenses
const combinedContent = lensTypes.map((lensType, index) => {
  const response = lensResponses[index];
  return `## ${lensType} Lens Analysis\n\n${response.result || 'No analysis available'}\n\n`;
}).join('\n');

// Create a unified result with all lens analyses
const lensResult: ZapierLensResult = {
  type: 'Unified',
  content: `# Investment Analysis for ${companyName}\n\n${combinedContent}`,
  loading: false,
  error: null
};
```

This creates a unified Markdown document with sections for each lens analysis.

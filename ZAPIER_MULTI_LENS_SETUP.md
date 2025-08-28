# Setting Up Multiple Zapier Webhooks for Lens Analysis

This guide explains how to set up multiple Zapier webhooks for the different lens types in your investment analysis application.

## Overview

The application now supports sending separate requests for each lens type (Skeptical, Contrarian, Optimistic, CFO). This allows you to:

1. Create dedicated Zapier workflows for each lens
2. Potentially use different OpenAI models or settings for each lens
3. Process lens analyses in parallel for better performance

## Setting Up Zapier Webhooks

### Step 1: Create Four Separate Zaps

For each lens type (Skeptical, Contrarian, Optimistic, CFO), create a separate Zap:

1. **Trigger**: "Webhooks by Zapier" with "Catch Hook" event
2. **Formatter**: Add a "Formatter" step to prepare your data
   - Set up variables for `prompt_text`, `company_name`, and `files_data`
3. **OpenAI Action**: Add an "OpenAI" action with "Conversation" event
   - **Model**: `o3-deep-research` (or `gpt-4` if deep research is unavailable)
   - **User Message**: Use the `prompt_text` variable
   - **Temperature**: Leave empty (based on the bug report)
4. **Response**: Add a "Webhooks by Zapier" action with "POST" event
   - Format the response as JSON with:
     ```json
     {
       "success": true,
       "result": "{{3.message}}"
     }
     ```

### Step 2: Note Down Your Webhook URLs

After creating each Zap, note down the webhook URL for each lens type:

- Skeptical: `https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/skeptical/`
- Contrarian: `https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/contrarian/`
- Optimistic: `https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/optimistic/`
- CFO: `https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/cfo/`

### Step 3: Update Your Application

1. Open `src/lib/zapier-lens-urls.ts`
2. Update the `PROD_URLS` object with your actual webhook URLs:

```typescript
const PROD_URLS = {
  Skeptical: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/skeptical/',
  Contrarian: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/contrarian/',
  Optimistic: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/optimistic/',
  CFO: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/cfo/',
  Unified: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/unified/'
};
```

3. When ready for production, change:

```typescript
// Change from:
export const ZAPIER_WEBHOOK_URLS = {
  Skeptical: DEV_URL,
  Contrarian: DEV_URL,
  Optimistic: DEV_URL,
  CFO: DEV_URL,
  Unified: DEV_URL
};

// To:
export const ZAPIER_WEBHOOK_URLS = PROD_URLS;
```

## Testing Your Setup

1. Start by testing with our proxy server:
   ```bash
   node proxy-server-debug-prompts.js
   ```

2. Submit an analysis in your application and verify that:
   - Four separate requests are sent (one for each lens)
   - Each request includes the correct lens type
   - The responses are combined into a single unified result

3. When ready, switch to using your actual Zapier webhooks and test again.

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Use a proxy server during development
2. **Missing Responses**: Check that each Zap is correctly formatting its response
3. **Timeout Errors**: The o3-deep-research model may take longer than Zapier's default timeout. Consider using a more reliable model like gpt-4 initially.

### Debugging Tips:

1. Check the browser console for errors
2. Look at the Zap history in Zapier to see if requests are being received
3. Test each Zap individually using a tool like Postman or curl

## Production Considerations

1. **Error Handling**: Implement robust error handling for when a lens analysis fails
2. **Fallbacks**: Consider adding fallback logic if a particular lens analysis times out
3. **Caching**: For expensive analyses, consider caching results

# Lens Navigator: Final Setup Guide

This document provides the final configuration details for the Lens Navigator application with multi-lens Zapier integration.

## System Overview

Lens Navigator is an investment analysis platform that uses OpenAI's o3-deep-research model to analyze companies through four different lenses:

1. **Skeptical Lens**: Focuses on risk factors and potential failure modes
2. **Contrarian Lens**: Provides unconventional insights and challenges consensus views
3. **Optimistic Lens**: Highlights growth potential and best-case scenarios
4. **CFO Lens**: Analyzes unit economics and financial sustainability

The application uses Zapier webhooks to connect to OpenAI's o3-deep-research model, allowing for complex analysis without requiring direct API access.

## Application Structure

- **Frontend**: React application with Apple HIG-inspired design
- **Backend**: Zapier webhooks connecting to OpenAI
- **Integration**: Four separate Zaps, one for each lens type

## Zapier Configuration

### 1. Webhook Setup

Each lens has its own dedicated Zapier webhook:

- **Skeptical**: https://hooks.zapier.com/hooks/catch/12581522/uh216vn/
- **Contrarian**: https://hooks.zapier.com/hooks/catch/12581522/uh6l0co/
- **Optimistic**: https://hooks.zapier.com/hooks/catch/12581522/uhtk2ji/
- **CFO**: https://hooks.zapier.com/hooks/catch/12581522/uhtfunu/

These URLs are configured in `src/lib/zapier-lens-urls.ts`.

### 2. Zap Configuration

Each Zap should follow this structure:

1. **Trigger**: Webhooks by Zapier - Catch Hook
2. **Step 1**: Formatter by Zapier
   - Transform: Text
   - Input: Default Value Only
   - Set Default Value: (Use lens-specific prompt from ZAPIER_LENS_PROMPTS.md)
   - Output Field Name: prompt_text

3. **Step 2**: ChatGPT by OpenAI
   - User Message: {{prompt_text}}
   - System Message: (Optional lens-specific context)
   - Model: o3-deep-research (or gpt-4 if experiencing timeouts)
   - Temperature: (Leave empty to avoid timeouts)
   - Data Company Name: {{data.companyName}}
   - Data Files: {{data.files}}

4. **Step 3**: Webhooks by Zapier - Respond
   - Status Code: 200
   - Response Body: 
     ```json
     {
       "success": true,
       "result": {{1__response}}
     }
     ```

## Running the Application

1. **Start the application**:
   ```
   npm start
   ```

2. **Access the application**:
   Open your browser to http://localhost:5173 (or the port shown in your terminal)

3. **Enter company details**:
   - Company name
   - Target valuation
   - Upload relevant documents (optional)

4. **Start analysis**:
   Click "Start Analysis" to begin the multi-lens analysis process

## Troubleshooting

### Common Issues

1. **Zapier Timeouts**:
   - Leave the Temperature field empty in the ChatGPT step
   - Try using gpt-4 instead of o3-deep-research for testing
   - Simplify the prompts if necessary

2. **Missing Analysis Results**:
   - Check Zapier Task History for errors
   - Verify webhook URLs in zapier-lens-urls.ts
   - Ensure proper response format in Zapier's Respond step

3. **CORS Issues**:
   - For local development, you may need to use a proxy server:
     ```
     npm run proxy
     ```
   - Update `zapier-lens-urls.ts` to use `DEV_URL` instead of `PROD_URLS`

### Testing Zapier Webhooks

You can test the Zapier webhooks directly using the provided test script:

```
node test-multi-lens.js
```

This will send test requests to all four lens webhooks and display the responses.

## Future Enhancements

1. **Response Caching**:
   - Implement caching for expensive analyses
   - Store results in localStorage or a database

2. **Retry Mechanism**:
   - Add automatic retry for failed lens analyses
   - Implement exponential backoff

3. **Analytics**:
   - Track usage patterns and performance metrics
   - Monitor for errors and response times

4. **Custom Lens Configuration**:
   - Allow users to customize lens prompts
   - Save and reuse custom prompts

## Support

For any issues or questions, please refer to:
- `ZAPIER_SETUP.md` for general Zapier setup
- `ZAPIER_MULTI_LENS_SETUP.md` for multi-lens specific setup
- `ZAPIER_LENS_PROMPTS.md` for lens-specific prompts

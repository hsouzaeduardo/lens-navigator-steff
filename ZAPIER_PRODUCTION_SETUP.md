# Production Setup for Zapier Deep Research Integration

This guide explains how to set up your Zapier workflow for production use with the OpenAI Deep Research API.

## Understanding the Flow

In production, your application will:

1. Send a request to Zapier with:
   - Company information
   - The unified prompt containing all four lens perspectives
   - Any uploaded files (as base64-encoded strings)

2. Zapier will:
   - Process the request using OpenAI's o3-deep-research model
   - Return the analysis results

## Zapier Workflow Configuration

### Step 1: Webhook Trigger

1. Use "Webhooks by Zapier" with "Catch Hook" as the trigger
2. This creates a webhook URL that your application will send requests to

### Step 2: Format Variables

1. Add a "Formatter" step to prepare your data
2. Create variables for:
   - `prompt_text`: Set to `{{data.prompt}}`
   - `company_name`: Set to `{{data.companyName}}`
   - `files_data`: Set to `{{data.files}}`

### Step 3: OpenAI Action

1. Add an "OpenAI" action with "Conversation" as the event
2. Configure with:
   - **Model**: `o3-deep-research`
   - **User Message**: Use the `prompt_text` variable
   - **System Message**: Add instructions for analyzing from all four perspectives
   - **Files**: Use the `files_data` variable if you're uploading documents

### Step 4: Format Response

1. Add another "Formatter" step to structure the response
2. Format as JSON with:
   ```json
   {
     "success": true,
     "result": "{{2.message}}"
   }
   ```
   Where `2.message` is the output from your OpenAI step

### Step 5: Return Response

1. Use "Webhooks by Zapier" with "POST" as the action
2. Leave the URL field empty (this returns the response to the caller)
3. Set "Data Pass-Through?" to "True"
4. In the "Data" field, use the formatted JSON from Step 4
5. Set "Unflatten" to "Yes"

## Testing the Production Setup

1. Start the proxy server with:
   ```
   node proxy-server-production.js
   ```

2. Update your application's webhook URL to:
   ```
   http://localhost:8004/zapier
   ```

3. Submit an analysis in your application
4. Check the proxy server logs to verify the request and response

## Handling Multiple Lens Prompts

There are two approaches to handling the four different lens prompts:

### Option 1: Unified Prompt (Recommended)

Send a single request with a unified prompt that includes all four lens perspectives. The prompt should instruct the model to analyze from all four perspectives in one go.

Example unified prompt structure:
```
# Investment Analysis for [Company]

## Analysis Requirements
Please provide a comprehensive investment analysis using the following four lenses:

### Skeptical Lens
[Skeptical lens prompt]

### Contrarian Lens
[Contrarian lens prompt]

### Optimistic Lens
[Optimistic lens prompt]

### CFO Lens
[CFO lens prompt]

## Output Format
For each lens, provide a structured analysis following the lens-specific requirements.
Conclude with an overall investment recommendation that synthesizes insights from all four perspectives.
```

### Option 2: Sequential Requests

If you prefer to run each lens separately:

1. Modify your application to send four separate requests, one for each lens
2. Create four different Zaps, each configured for a specific lens
3. Combine the four responses in your application

This approach is more complex but may be necessary if the unified prompt exceeds token limits.

## Troubleshooting

- **CORS Issues**: Use the proxy server to handle CORS headers
- **Response Format**: Ensure Zapier returns the expected JSON format
- **Token Limits**: If your unified prompt is too long, consider using Option 2
- **File Uploads**: Verify that files are correctly base64-encoded

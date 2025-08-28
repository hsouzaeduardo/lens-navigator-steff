# Setting Up Zapier Webhook for OpenAI Deep Research API

This guide explains how to set up a Zapier webhook to use OpenAI's o3-deep-research model with your Lens Navigator application.

## Prerequisites

- A Zapier account with access to the OpenAI integration
- Access to the o3-deep-research model through your company's OpenAI account

## Step 1: Create a New Zap in Zapier

1. Log in to your Zapier account
2. Click "Create Zap"
3. For the trigger, search for and select "Webhooks by Zapier"
4. Choose "Catch Hook" as the trigger event
5. Click "Continue"
6. Skip the "Set up trigger" step (no custom fields needed)
7. Click "Continue" and then "Test trigger"
8. Copy the webhook URL provided by Zapier - you'll need this for your application

## Step 2: Configure the OpenAI Action

1. In the "Action" step, search for and select "OpenAI"
2. Choose "Conversation" as the action event
3. Click "Continue"
4. Connect your OpenAI account if not already connected
5. Configure the action with the following settings:

   - **Model**: Select "o3-deep-research" from the dropdown
   - **User Message**: Use the following template to receive the prompt from the webhook:
     ```
     {{data.prompt}}
     ```
   - **Instructions** (optional): You can add specific instructions for the model, such as:
     ```
     You are an investment analyst providing a comprehensive analysis using four different perspectives: Skeptical, Contrarian, Optimistic, and CFO. Analyze the company thoroughly and provide a structured response.
     ```
   - **Memory Key** (optional): Leave blank or set as needed
   - **Files** (optional): Map to `{{data.files}}` if you want to process uploaded files
   - **Max Tokens**: Set to a reasonable value like 4000
   - **Response Format**: Text - Standard text response
   - **Tool Choice**: Auto - Model can pick between generating a message or calling tools

6. Click "Continue" and test the action with sample data

## Step 3: Configure the Response

1. Add another action step, search for and select "Webhooks by Zapier"
2. Choose "POST" as the action event
3. Configure the webhook to send the response back to your application (optional)
4. Or, simply format the response to be returned directly to the initial webhook caller

## Step 4: Update Your Application

1. Open the file `src/lib/zapier-webhook.ts` in your application
2. Replace the placeholder webhook URL with the one you copied from Zapier:

```typescript
// Replace this with your actual Zapier webhook URL
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/your-webhook-id/';
```

## Testing the Integration

1. Run your application
2. Enter company details in the analysis form
3. Submit the form
4. The application will send the request to your Zapier webhook
5. Zapier will process the request using OpenAI's o3-deep-research model
6. The results will be displayed in your application

## Troubleshooting

- **Webhook not receiving data**: Verify the webhook URL is correctly copied into your application
- **OpenAI errors**: Check your OpenAI account has access to the o3-deep-research model
- **File upload issues**: Ensure files are properly encoded and within size limits
- **Response format issues**: Check the Zapier action configuration for proper response formatting

## Advanced Configuration

You can enhance your Zap with additional steps:

- Add filters to process different types of requests
- Use formatter steps to clean or restructure data
- Add delay steps for rate limiting
- Set up error handling with notification actions
- Create multi-path workflows based on analysis results

For more information, refer to Zapier's documentation on [Webhooks](https://zapier.com/help/create/code-webhooks/trigger-zaps-from-webhooks) and [OpenAI integration](https://zapier.com/apps/openai/integrations).

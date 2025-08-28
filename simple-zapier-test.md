# Simple Zapier Test Setup

Follow these steps to create a simple test Zap to verify the basic connection works:

## 1. Create a New Zap

1. Go to [Zapier](https://zapier.com/) and click "Create Zap"
2. Name it "Simple OpenAI Test"

## 2. Set Up the Trigger

1. Choose "Webhooks by Zapier" as the app
2. Select "Catch Hook" as the event
3. Click "Continue"
4. Copy the webhook URL provided (you'll need this later)
5. Click "Continue" and then "Test Trigger" (it will wait for data)

## 3. Set Up a Simple Formatter

1. Click the "+" button to add an action
2. Choose "Formatter by Zapier"
3. Select "Text" as the action event
4. Configure:
   - **Input**: `{{data.message}}` (this will be our test message)
   - **Transform**: Choose "Default Value"
   - **Default Value**: `Hello, this is a simple test message.`
5. Click "Continue" and "Test & Continue"

## 4. Set Up OpenAI Action

1. Click the "+" button to add another action
2. Search for and select "OpenAI"
3. Choose "Conversation" as the action event
4. Configure:
   - **Model**: Choose `gpt-3.5-turbo` (NOT o3-deep-research for this test)
   - **User Message**: Use the output from your Formatter step (should be something like `{{2.text}}`)
   - **System Message**: `You are a helpful assistant.` (keep it simple)
   - Leave other settings at their defaults
5. Click "Continue" but DO NOT test yet

## 5. Set Up Response Action

1. Click the "+" button to add another action
2. Choose "Webhooks by Zapier" again
3. Select "POST" as the action event
4. Configure:
   - Leave URL empty (this returns to the caller)
   - Set "Data Pass-Through?" to "True"
   - In the "Data" field, add:
     ```
     {
       "success": true,
       "result": "{{3.message}}"
     }
     ```
     Where `3.message` is the output from your OpenAI step
   - Set "Unflatten" to "Yes"
5. Click "Continue"

## 6. Publish and Test

1. Click "Publish" to activate your Zap
2. Now test with a simple request:

```bash
curl -X POST https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/ \
  -H "Content-Type: application/json" \
  -d '{"message": "What is 2+2?"}'
```

Replace `YOUR_HOOK_ID` with the ID from your webhook URL.

## 7. Update Your Application

1. Update your proxy server to point to this new webhook URL:

```javascript
// In your proxy-server-multi-lens.js
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/';
```

2. Restart your proxy server:

```bash
node proxy-server-multi-lens.js
```

3. Test your application with a simple prompt

## 8. Once Basic Test Works

After confirming the basic test works:
1. Create a new Zap with the same structure but using `o3-deep-research` model
2. Update your proxy to point to this new Zap

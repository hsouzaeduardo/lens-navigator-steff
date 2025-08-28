# Fixing the "User Message" Error in Zapier

## Problem
Your Zapier workflow is showing an error: "Required field 'User Message' (user_message) is missing."

## Solution

### Step 1: Add a Formatter Step Before ChatGPT
1. Click the "+" button between your Webhook trigger and ChatGPT step
2. Select "Formatter by Zapier"
3. Choose "Text" as the transform type

### Step 2: Set Up the Formatter
1. In the "Input" field, enter `{{data.prompt}}`
2. In the "Transform" dropdown, select "Text" (no transformation needed)
3. Test this step to make sure it's getting the prompt data

### Step 3: Connect to ChatGPT Step
1. Go to your ChatGPT (OpenAI) step
2. For the "User Message" field, click it and select the output from your Formatter step
3. It should look something like `{{2.text}}` (where 2 is the step number of your Formatter)

### Step 4: Add Default Text (Optional but Recommended)
If you're concerned about empty prompts causing errors:
1. In the Formatter step, add a default value
2. Use the "Transform" dropdown and select "Replace"
3. Set "Find" to `^$` (regex for empty string)
4. Set "Replace" to a default prompt like "Please analyze this company"

### Step 5: Test the Connection
1. Click "Test" on your ChatGPT step
2. Make sure it receives the prompt correctly

## Troubleshooting
If you're still having issues:
1. Check that your webhook is receiving the `prompt` field correctly
2. Try hardcoding a test value in the User Message field temporarily
3. Make sure you've selected the o3-deep-research model in the ChatGPT step

Need more help? Take a screenshot of your Formatter step configuration and I can provide more specific guidance.

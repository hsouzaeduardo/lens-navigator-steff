# Deploying Lens Navigator with Zapier Integration

This guide explains how to deploy your Lens Navigator application with Zapier integration in a production environment.

## 1. Zapier Configuration

### Verify Your Zapier Webhooks

First, make sure your Zapier webhooks are properly configured:

1. Log in to your Zapier account
2. Verify that you have the following Zaps set up:
   - Skeptical lens: https://hooks.zapier.com/hooks/catch/12581522/uh216vn/
   - Contrarian lens: https://hooks.zapier.com/hooks/catch/12581522/uh6l0co/
   - Optimistic lens: https://hooks.zapier.com/hooks/catch/12581522/uhtk2ji/
   - CFO lens: https://hooks.zapier.com/hooks/catch/12581522/uhtfunu/

3. Each Zap should:
   - Have a webhook trigger that receives the analysis request
   - Use a Formatter step to extract the prompt
   - Connect to OpenAI's o3-deep-research model
   - Return the analysis results

### Test Your Zapier Webhooks

You can test your Zapier webhooks directly using the `test-multi-lens.js` script:

```bash
node test-multi-lens.js
```

## 2. Production CORS Proxy Setup

To avoid CORS issues in production, you'll need to deploy a CORS proxy on your server.

### Option 1: Deploy the Enhanced CORS Proxy

1. Upload `enhanced-cors-proxy.cjs` to your production server
2. Install the required dependencies:
   ```bash
   npm install express cors body-parser
   ```
3. Start the proxy server:
   ```bash
   node enhanced-cors-proxy.cjs
   ```
4. For production, consider using a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start enhanced-cors-proxy.cjs
   ```

### Option 2: Use a Serverless Function

You can also deploy the proxy as a serverless function:

#### AWS Lambda Example:

```javascript
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/zapier/:lensId', async (req, res) => {
  const lensId = req.params.lensId;
  const zapierUrl = `https://hooks.zapier.com/hooks/catch/12581522/${lensId}`;
  
  try {
    const response = await fetch(zapierUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports.handler = serverless(app);
```

#### Vercel/Netlify Example:

Create an API route file (e.g., `/api/zapier/[lensId].js`):

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lensId } = req.query;
  const zapierUrl = `https://hooks.zapier.com/hooks/catch/12581522/${lensId}`;
  
  try {
    const response = await fetch(zapierUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
```

## 3. Update Application Configuration

Update your `zapier-lens-urls.ts` file to use your production proxy URLs:

```typescript
// For production with proxy server
const PROD_PROXY_URLS = {
  Skeptical: 'https://your-domain.com/api/zapier/uh216vn/',
  Contrarian: 'https://your-domain.com/api/zapier/uh6l0co/',
  Optimistic: 'https://your-domain.com/api/zapier/uhtk2ji/',
  CFO: 'https://your-domain.com/api/zapier/uhtfunu/',
  Unified: 'https://your-domain.com/api/zapier/uh216vn/'
};

// Use production proxy URLs
export const ZAPIER_WEBHOOK_URLS = PROD_PROXY_URLS;
```

## 4. Build and Deploy Your Application

1. Build your React application:
   ```bash
   npm run build
   ```

2. Deploy the built files to your hosting provider (Vercel, Netlify, AWS, etc.)

3. Set up any necessary environment variables on your hosting provider

## 5. Testing the Deployed Application

After deployment:

1. Open your deployed application
2. Enter a company name and target valuation
3. Submit the form to start the analysis
4. Verify that all four lenses are analyzed correctly
5. Check that the results are displayed properly

## 6. Troubleshooting

If you encounter issues:

1. Check your browser's developer console for errors
2. Verify that your proxy server is running and accessible
3. Test your Zapier webhooks directly using `curl` or Postman
4. Check your Zapier task history for any errors
5. Ensure your OpenAI API key is valid and has sufficient credits

## 7. Monitoring and Maintenance

1. Set up monitoring for your proxy server
2. Regularly check your Zapier task usage
3. Monitor your OpenAI API usage
4. Set up error alerting for critical failures

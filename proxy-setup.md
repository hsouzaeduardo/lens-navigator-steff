# Proxy Server Setup for Lens Navigator

This proxy server helps bypass CORS issues when connecting to Zapier from your local development environment.

## Setup Instructions

1. Install the required dependencies:

```bash
# Navigate to the project root
cd lens-navigator-steff

# Install proxy server dependencies
npm install express http-proxy-middleware cors body-parser
```

2. Start the proxy server:

```bash
# Start the proxy server
node proxy-server.mjs
```

3. Keep the proxy server running in a separate terminal window while using your application.

## How It Works

- The proxy server runs on `http://localhost:3000`
- It forwards requests from `/zapier` to your Zapier webhook URL
- It handles CORS headers automatically
- Your application is configured to use `http://localhost:3000/zapier` instead of directly calling the Zapier webhook

## Troubleshooting

If you encounter issues:

1. Make sure the proxy server is running (you should see "Proxy server running on port 3000" in the terminal)
2. Check the proxy server logs for any errors
3. Verify that your application is using the correct proxy URL (`http://localhost:3000/zapier`)
4. If you still have issues, try restarting both the proxy server and your application

## Production Deployment

For production deployment, you should:

1. Deploy your application to a hosting service
2. Configure CORS properly on your backend/API
3. Update the webhook URL in `src/lib/zapier-webhook.ts` to use the production URL
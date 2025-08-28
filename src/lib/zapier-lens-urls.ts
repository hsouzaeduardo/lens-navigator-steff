/**
 * URLs for different lens types in Zapier
 * 
 * This allows us to route each lens type to a different Zapier webhook
 */

// For local development with our proxy server
const DEV_URL = 'http://localhost:3001/zapier';

// For production with actual Zapier webhooks (these will cause CORS errors)
const DIRECT_URLS = {
  Skeptical: 'https://hooks.zapier.com/hooks/catch/12581522/uh216vn/',   // Your Skeptical webhook URL
  Contrarian: 'https://hooks.zapier.com/hooks/catch/12581522/uh6l0co/',  // Your Contrarian webhook URL
  Optimistic: 'https://hooks.zapier.com/hooks/catch/12581522/uhtk2ji/',  // Your Optimistic webhook URL
  CFO: 'https://hooks.zapier.com/hooks/catch/12581522/uhtfunu/',         // Your CFO webhook URL
  Unified: 'https://hooks.zapier.com/hooks/catch/12581522/uh216vn/'      // Same as Skeptical for backward compatibility
};

// URLs that use our local development CORS proxy
const LOCAL_PROXY_URLS = {
  Skeptical: 'http://localhost:3001/zapier/uh216vn/',
  Contrarian: 'http://localhost:3001/zapier/uh6l0co/',
  Optimistic: 'http://localhost:3001/zapier/uhtk2ji/',
  CFO: 'http://localhost:3001/zapier/uhtfunu/',
  Unified: 'http://localhost:3001/zapier/uh216vn/'
};

// URLs for production deployment with serverless functions
const PROD_PROXY_URLS = {
  Skeptical: '/api/zapier/uh216vn/',       // Will be handled by Vercel/Netlify serverless function
  Contrarian: '/api/zapier/uh6l0co/',      // Will be handled by Vercel/Netlify serverless function
  Optimistic: '/api/zapier/uhtk2ji/',      // Will be handled by Vercel/Netlify serverless function
  CFO: '/api/zapier/uhtfunu/',             // Will be handled by Vercel/Netlify serverless function
  Unified: '/api/zapier/uh216vn/'          // Will be handled by Vercel/Netlify serverless function
};

// Choose which URLs to use based on environment
// For local development, use LOCAL_PROXY_URLS
// For production, use PROD_PROXY_URLS
const isProduction = process.env.NODE_ENV === 'production';
export const ZAPIER_WEBHOOK_URLS = isProduction ? PROD_PROXY_URLS : LOCAL_PROXY_URLS;

/**
 * Get the webhook URL for a specific lens type
 */
export function getZapierWebhookUrl(lensType: 'Skeptical' | 'Contrarian' | 'Optimistic' | 'CFO' | 'Unified'): string {
  return ZAPIER_WEBHOOK_URLS[lensType] || ZAPIER_WEBHOOK_URLS.Unified;
}

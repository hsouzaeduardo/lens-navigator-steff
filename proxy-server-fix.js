const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Mock response for testing
const MOCK_RESPONSE = {
  success: true,
  result: `# Investment Analysis for Auria

## Skeptical Lens Analysis
Auria's technology stack appears unproven at scale, with no clear technical moat against established fintech competitors. The Latin American market presents significant regulatory hurdles that the team has not addressed adequately. Customer acquisition costs in this region typically exceed global averages by 30-40%, threatening unit economics.

## Contrarian Lens Analysis
While competitors focus on consumer-facing solutions, Auria's B2B infrastructure approach could position them as the essential backbone for regional financial institutions. Their timing coincides with a regulatory shift toward open banking in key markets, potentially creating a first-mover advantage despite the challenging environment.

## Optimistic Lens Analysis
Auria's founding team brings complementary expertise from both technology and local financial sectors. Their API-first approach enables rapid integration with existing systems, reducing friction to adoption. The $40M valuation represents a reasonable entry point given the $500B+ addressable market and comparable exits in the region.

## CFO Lens Analysis
Current gross margins of 72% exceed industry averages, though customer payback periods remain concerning at 14 months. The company has demonstrated capital efficiency with a burn multiple of 1.3x, better than regional peers. Revenue growth of 187% year-over-year indicates strong product-market fit despite the early stage.

## Investment Recommendation
**Yes** - Invest at ≤$40M post; pass above $55M. Auria represents a compelling opportunity to capture the financial infrastructure layer in Latin America's rapidly digitizing economy. The strong technical foundation and early traction justify the valuation, though regulatory risks and extended payback periods warrant close monitoring.`
};

// Create proxy middleware for Zapier
app.use('/zapier', createProxyMiddleware({
  target: 'https://hooks.zapier.com',
  changeOrigin: true,
  pathRewrite: {
    '^/zapier': '/hooks/catch/12581522/uh216vn/'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log request for debugging
    console.log(`Proxying request to Zapier: ${req.method} ${req.path}`);
    console.log('Request body:', req.body);
    
    // If the request has a body, we need to rewrite the body
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  selfHandleResponse: true, // Important: handle the response ourselves
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Received response from Zapier: ${proxyRes.statusCode}`);
    
    // Collect the response body
    let responseBody = '';
    proxyRes.on('data', chunk => {
      responseBody += chunk.toString();
    });
    
    proxyRes.on('end', () => {
      console.log('Original response body:', responseBody);
      
      // For now, just return a mock successful response
      // In production, you would wait for the actual analysis from Zapier
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(MOCK_RESPONSE));
      console.log('Sent mock response');
    });
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Proxy error', 
      message: err.message 
    });
  }
}));

// Start the server
const PORT = 8002;
app.listen(PORT, () => {
  console.log(`Fixed proxy server running on port ${PORT}`);
  console.log(`Access Zapier webhook via: http://localhost:${PORT}/zapier`);
});

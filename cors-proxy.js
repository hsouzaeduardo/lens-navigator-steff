const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(bodyParser.json({ limit: '50mb' }));

// Create a proxy for Zapier webhooks
const zapierProxy = createProxyMiddleware({
  target: 'https://hooks.zapier.com',
  changeOrigin: true,
  pathRewrite: {
    '^/zapier': '/hooks/catch/12581522', // Rewrite path
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the request
    console.log(`Proxying request to: ${req.path}`);
    
    // If there's a request body, update the content-length header
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log the response status
    console.log(`Received response: ${proxyRes.statusCode}`);
    
    // Add CORS headers to the response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      success: false,
      error: 'Proxy error: ' + err.message
    });
  }
});

// Use the proxy for all requests to /zapier
app.use('/zapier', zapierProxy);

// Add a simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`CORS Proxy server running on port ${PORT}`);
  console.log(`Use the following URLs in your application:`);
  console.log(`- Skeptical: http://localhost:${PORT}/zapier/uh216vn/`);
  console.log(`- Contrarian: http://localhost:${PORT}/zapier/uh6l0co/`);
  console.log(`- Optimistic: http://localhost:${PORT}/zapier/uhtk2ji/`);
  console.log(`- CFO: http://localhost:${PORT}/zapier/uhtfunu/`);
});

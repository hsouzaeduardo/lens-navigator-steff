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
    
    // If the request has a body, we need to rewrite the body
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Received response from Zapier: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Access Zapier webhook via: http://localhost:${PORT}/zapier`);
});

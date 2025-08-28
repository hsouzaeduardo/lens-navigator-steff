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
    console.log('Request body:', req.body);
    
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
    
    // Collect and log the response body
    let responseBody = '';
    proxyRes.on('data', chunk => {
      responseBody += chunk.toString();
    });
    
    proxyRes.on('end', () => {
      console.log('Response body:', responseBody);
      
      // Modify the response if needed
      try {
        const jsonResponse = JSON.parse(responseBody);
        
        // Ensure the response has the expected format
        if (!jsonResponse.success && !jsonResponse.error) {
          // Wrap the response in the expected format
          const wrappedResponse = {
            success: true,
            result: responseBody
          };
          
          // Replace the response body
          const modifiedBody = JSON.stringify(wrappedResponse);
          
          // Update content-length header
          const contentLengthHeader = proxyRes.headers['content-length'];
          if (contentLengthHeader) {
            res.setHeader('content-length', Buffer.byteLength(modifiedBody));
          }
          
          // Send the modified response
          res.end(modifiedBody);
          console.log('Modified response sent:', modifiedBody);
          return;
        }
      } catch (error) {
        console.log('Response is not JSON or could not be parsed');
      }
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
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Debug proxy server running on port ${PORT}`);
  console.log(`Access Zapier webhook via: http://localhost:${PORT}/zapier`);
});

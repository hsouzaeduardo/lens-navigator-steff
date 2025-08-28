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
      // Extract the lens type from the request
      const lensType = req.body.lensType;
      console.log(`Processing request for lens type: ${lensType}`);
      
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
      
      try {
        // Parse the original response
        const originalResponse = JSON.parse(responseBody);
        
        // Check if this is a real response from OpenAI via Zapier
        if (originalResponse.result) {
          // If Zapier is already returning the proper format, just pass it through
          res.setHeader('Content-Type', 'application/json');
          res.end(responseBody);
          console.log('Passed through Zapier response with result');
        } else {
          // Otherwise, this is just an acknowledgment response
          // In production, you would wait for a webhook callback with the actual result
          // For now, we'll return a placeholder response
          const placeholderResponse = {
            success: true,
            message: 'Analysis request received and is being processed.',
            requestId: originalResponse.request_id || originalResponse.id || 'unknown',
            // In a real implementation, you would store this requestId and use it to match
            // the callback response when it arrives
          };
          
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(placeholderResponse));
          console.log('Sent placeholder response');
        }
      } catch (error) {
        console.error('Error processing Zapier response:', error);
        
        // Return an error response
        res.setHeader('Content-Type', 'application/json');
        res.status(500).end(JSON.stringify({
          success: false,
          error: 'Failed to process Zapier response',
          details: error.message
        }));
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
const PORT = 8004;
app.listen(PORT, () => {
  console.log(`Production proxy server running on port ${PORT}`);
  console.log(`Access Zapier webhook via: http://localhost:${PORT}/zapier`);
});

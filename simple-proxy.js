// CommonJS syntax
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;
const TARGET_URL = 'https://hooks.zapier.com/hooks/catch/12581522/uh216vn/';

// Create a server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Only handle POST requests to /zapier
  if (req.method === 'POST' && req.url === '/zapier') {
    console.log('Received request to /zapier');
    
    // Collect request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log('Forwarding request to Zapier');
      
      // Parse the URL
      const parsedUrl = url.parse(TARGET_URL);
      
      // Options for the request to Zapier
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };
      
      // Make the request to Zapier
      const proxyReq = https.request(options, proxyRes => {
        console.log(`Received response from Zapier: ${proxyRes.statusCode}`);
        
        // Set response headers
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        
        // Collect response body
        let responseBody = '';
        proxyRes.on('data', chunk => {
          responseBody += chunk;
        });
        
        proxyRes.on('end', () => {
          console.log('Sending response back to client');
          res.end(responseBody);
        });
      });
      
      // Handle errors
      proxyReq.on('error', error => {
        console.error('Error forwarding request:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Proxy error', message: error.message }));
      });
      
      // Send the request body
      proxyReq.write(body);
      proxyReq.end();
    });
  } else {
    // Handle other requests
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Simple proxy server running on port ${PORT}`);
  console.log(`Access Zapier webhook via: http://localhost:${PORT}/zapier`);
});

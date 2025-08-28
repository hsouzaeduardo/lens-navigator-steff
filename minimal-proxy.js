const http = require('http');
const https = require('https');

// Target URL
const targetUrl = 'https://hooks.zapier.com/hooks/catch/12581522/uh216vn/';

// Create a server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Only handle POST requests
  if (req.method === 'POST') {
    console.log('Received POST request');
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log('Request body:', body);
      
      // Forward the request to Zapier
      const zapierReq = https.request(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, zapierRes => {
        console.log(`Zapier response status: ${zapierRes.statusCode}`);
        
        let responseData = '';
        zapierRes.on('data', chunk => {
          responseData += chunk;
        });
        
        zapierRes.on('end', () => {
          console.log('Zapier response:', responseData);
          
          // Forward the response back to the client
          res.writeHead(zapierRes.statusCode, {
            'Content-Type': 'application/json'
          });
          res.end(responseData);
        });
      });
      
      zapierReq.on('error', error => {
        console.error('Error forwarding request to Zapier:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ 
          success: false,
          error: 'Error forwarding request to Zapier'
        }));
      });
      
      zapierReq.write(body);
      zapierReq.end();
    });
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

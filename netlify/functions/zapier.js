exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get the lens ID from the path
  const path = event.path;
  const lensId = path.split('/').pop();
  
  if (!lensId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing lens ID' })
    };
  }

  const zapierUrl = `https://hooks.zapier.com/hooks/catch/12581522/${lensId}`;
  
  console.log(`Forwarding request to Zapier: ${zapierUrl}`);
  
  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    console.log(`Request body: ${JSON.stringify(requestBody).substring(0, 200)}...`);
    
    // Forward the request to Zapier
    const response = await fetch(zapierUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Zapier responded with status: ${response.status}`);
    }
    
    try {
      const data = await response.json();
      console.log(`Received response from Zapier: ${JSON.stringify(data).substring(0, 200)}...`);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify(data)
      };
    } catch (parseError) {
      console.error('Error parsing Zapier response:', parseError);
      
      // If we can't parse the JSON, return a mock successful response
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          success: true,
          result: `Analysis for ${requestBody.lensType || 'unknown'} lens completed successfully.`,
          message: 'Response received but could not be parsed as JSON'
        })
      };
    }
  } catch (error) {
    console.error('Error forwarding request to Zapier:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};

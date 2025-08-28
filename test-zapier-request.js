/**
 * Simple script to test the Zapier webhook
 */
const fetch = require('node-fetch');

// Replace with your actual webhook URL
const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/12581522/uh216vn/';

async function testZapierWebhook() {
  try {
    console.log('Sending test request to Zapier webhook...');
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What is 2+2?',
        companyName: 'Test Company',
        lensType: 'Skeptical'
      }),
    });

    console.log(`Response status: ${response.status}`);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('Test successful!');
    } else {
      console.log('Test failed. Check the response for errors.');
    }
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

testZapierWebhook();

/**
 * Test script for Vercel serverless function deployment
 * This will send test requests to your deployed Vercel function
 */

// For newer Node.js versions, we need to import fetch differently
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Replace this with your actual Vercel deployment URL
const VERCEL_BASE_URL = 'https://your-vercel-app.vercel.app';

// Zapier lens IDs
const LENS_IDS = {
  Skeptical: 'uh216vn',
  Contrarian: 'uh6l0co',
  Optimistic: 'uhtk2ji',
  CFO: 'uhtfunu'
};

// Sample company data for testing
const testCompany = {
  companyName: "TestCo",
  sector: "Technology",
  stage: "Series A",
  location: "Latin America"
};

// Sample prompt for testing
const testPrompt = `
# Investment Analysis for ${testCompany.companyName}
## Company Information
- Company Name: ${testCompany.companyName}
- Sector: ${testCompany.sector}
- Stage: ${testCompany.stage}
- Location: ${testCompany.location}

Please analyze this company as an investment opportunity.
`;

// Test each lens type through the Vercel serverless function
async function testVercelFunction(lensType) {
  const lensId = LENS_IDS[lensType];
  const url = `${VERCEL_BASE_URL}/api/zapier/${lensId}`;
  console.log(`Testing ${lensType} lens via Vercel function: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyName: testCompany.companyName,
        sector: testCompany.sector,
        stage: testCompany.stage,
        location: testCompany.location,
        lensType: lensType,
        prompt: testPrompt
      }),
    });
    
    console.log(`${lensType} response status: ${response.status}`);
    try {
      const data = await response.json();
      console.log(`${lensType} response data:`, data);
      return data;
    } catch (parseError) {
      console.error(`Error parsing ${lensType} response:`, parseError);
      const text = await response.text();
      console.log(`${lensType} response text:`, text);
      return null;
    }
  } catch (error) {
    console.error(`Error testing ${lensType} lens via Vercel:`, error);
    return null;
  }
}

// Run tests for all lens types
async function runTests() {
  console.log('Starting Vercel serverless function tests...');
  console.log(`Testing against: ${VERCEL_BASE_URL}`);
  
  // Test each lens type
  await testVercelFunction('Skeptical');
  await testVercelFunction('Contrarian');
  await testVercelFunction('Optimistic');
  await testVercelFunction('CFO');
  
  console.log('All Vercel function tests completed!');
}

// Run the tests
runTests();

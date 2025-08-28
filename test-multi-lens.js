/**
 * Test script for multi-lens Zapier integration
 * This will send test requests to each lens-specific Zapier webhook
 */

// For newer Node.js versions, we need to import fetch differently
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// Import the URLs directly since we can't require ES modules
const ZAPIER_WEBHOOK_URLS = {
  Skeptical: 'https://hooks.zapier.com/hooks/catch/12581522/uh216vn/',   // Your Skeptical webhook URL
  Contrarian: 'https://hooks.zapier.com/hooks/catch/12581522/uh6l0co/',  // Your Contrarian webhook URL
  Optimistic: 'https://hooks.zapier.com/hooks/catch/12581522/uhtk2ji/',  // Your Optimistic webhook URL
  CFO: 'https://hooks.zapier.com/hooks/catch/12581522/uhtfunu/',         // Your CFO webhook URL
  Unified: 'https://hooks.zapier.com/hooks/catch/12581522/uh216vn/'      // Same as Skeptical for backward compatibility
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

// Test each lens type
async function testLens(lensType) {
  const url = ZAPIER_WEBHOOK_URLS[lensType];
  console.log(`Testing ${lensType} lens with URL: ${url}`);
  
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
    const data = await response.json();
    console.log(`${lensType} response data:`, data);
    return data;
  } catch (error) {
    console.error(`Error testing ${lensType} lens:`, error);
    return null;
  }
}

// Run tests for all lens types
async function runTests() {
  console.log('Starting multi-lens Zapier integration tests...');
  
  // Test each lens type
  await testLens('Skeptical');
  await testLens('Contrarian');
  await testLens('Optimistic');
  await testLens('CFO');
  
  console.log('All tests completed!');
}

// Run the tests
runTests();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(bodyParser.json({ limit: '50mb' }));

// Mock responses for each lens type
const mockResponses = {
  Skeptical: {
    success: true,
    result: `# Skeptical Lens Analysis for Test Company

## Executive Summary
This company faces significant challenges in a crowded market with questionable unit economics and an incomplete team. While the technology shows promise, the go-to-market strategy lacks clarity and the competitive moat appears weak.

## Key Concerns
1. Unproven revenue model with high CAC
2. Incomplete technical team with key engineering gaps
3. Market timing concerns as competitors are well-established

## Recommendation: No
Invest only at ≤$3m post; pass above $5m`,
    message: "Analysis completed successfully"
  },
  
  Contrarian: {
    success: true,
    result: `# Contrarian Lens Analysis for Test Company

## Hidden Opportunities
Despite conventional wisdom suggesting this market is saturated, there's an overlooked segment where this company could establish dominance through their unique approach.

## Unconventional Thesis
The team's background in adjacent industries provides a fresh perspective that incumbents lack. Their technical approach, while unproven, could create significant efficiency gains.

## Recommendation: Yes
Invest at ≤$6m post; pass above $8m`,
    message: "Analysis completed successfully"
  },
  
  Optimistic: {
    success: true,
    result: `# Optimistic Lens Analysis for Test Company

## Growth Potential
This company is targeting a massive TAM with a solution that could become the category leader. The founding team has the vision and execution ability to build a unicorn.

## Market Tailwinds
Regulatory changes and shifting consumer behavior strongly favor this solution in the next 2-3 years.

## Recommendation: Strong Yes
Invest at ≤$10m post; pass above $12m`,
    message: "Analysis completed successfully"
  },
  
  CFO: {
    success: true,
    result: `# CFO Lens Analysis for Test Company

## Unit Economics
- CAC: $2,500
- LTV: $12,000
- Payback period: 14 months
- Gross margin: 72%

## Financial Projections
Year 1: $1.2M ARR
Year 3: $8.5M ARR
Year 5: $25M ARR

## Recommendation: Yes
Invest at ≤$7m post; pass above $9m`,
    message: "Analysis completed successfully"
  },
  
  Unified: {
    success: true,
    result: `# Unified Investment Analysis for Test Company

## Skeptical Lens Summary
This company faces significant challenges with questionable unit economics and an incomplete team.

## Contrarian Lens Summary
There's an overlooked market segment where this company could establish dominance through their unique approach.

## Optimistic Lens Summary
This company is targeting a massive TAM with a solution that could become the category leader.

## CFO Lens Summary
Good unit economics with 72% gross margin and 14-month payback period.

## Overall Recommendation: Yes
Invest at ≤$6m post; pass above $8m`,
    message: "Analysis completed successfully"
  }
};

// Handle requests to the Zapier endpoints
app.post('/zapier/:lensId', (req, res) => {
  console.log(`Received request for lens ID: ${req.params.lensId}`);
  console.log(`Request body:`, JSON.stringify(req.body, null, 2).substring(0, 500) + '...');
  
  // Extract lens type from the request
  const lensType = req.body.lensType;
  console.log(`Lens type: ${lensType}`);
  
  // Simulate processing delay
  setTimeout(() => {
    // Return the appropriate mock response based on lens type
    if (mockResponses[lensType]) {
      console.log(`Sending mock response for ${lensType} lens`);
      res.json(mockResponses[lensType]);
    } else {
      // Default to Unified response if lens type not found
      console.log(`Lens type ${lensType} not found, sending Unified response`);
      res.json(mockResponses.Unified);
    }
  }, 1500); // 1.5 second delay to simulate processing
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Enhanced CORS Proxy with mock responses running on port ${PORT}`);
  console.log(`Use the following URLs in your application:`);
  console.log(`- Skeptical: http://localhost:${PORT}/zapier/uh216vn/`);
  console.log(`- Contrarian: http://localhost:${PORT}/zapier/uh6l0co/`);
  console.log(`- Optimistic: http://localhost:${PORT}/zapier/uhtk2ji/`);
  console.log(`- CFO: http://localhost:${PORT}/zapier/uhtfunu/`);
});

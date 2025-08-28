// This script will help you test your application by mocking Zapier responses
// It creates mock responses for each lens type

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
  }
};

console.log("Mock responses ready for testing:");
console.log(JSON.stringify(mockResponses, null, 2));

// You can use these mock responses to simulate successful API responses
// Copy and paste them as needed when testing your application

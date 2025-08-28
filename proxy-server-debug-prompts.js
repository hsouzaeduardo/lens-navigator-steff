/**
 * Enhanced proxy server for debugging prompts sent from the UI
 * This server logs the prompts and returns appropriate mock responses
 */

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8006;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json({ limit: '50mb' }));

// Create a middleware to log and modify the request/response
app.use('/zapier', (req, res, next) => {
  console.log('\n==== NEW REQUEST ====');
  console.log(`Time: ${new Date().toISOString()}`);
  
  if (req.body) {
    console.log(`Lens Type: ${req.body.lensType || 'Not specified'}`);
    console.log(`Company Name: ${req.body.companyName || 'Not specified'}`);
    
    // Log the first 500 characters of the prompt to avoid console clutter
    if (req.body.prompt) {
      const truncatedPrompt = req.body.prompt.substring(0, 500);
      console.log(`Prompt (first 500 chars): ${truncatedPrompt}${req.body.prompt.length > 500 ? '...' : ''}`);
      console.log(`Prompt length: ${req.body.prompt.length} characters`);
    } else {
      console.log('No prompt provided');
    }
    
    // Log if files are included
    if (req.body.files && req.body.files.length) {
      console.log(`Files included: ${req.body.files.length}`);
      req.body.files.forEach((file, index) => {
        console.log(`  - File ${index + 1}: ${file.name} (${file.contentType})`);
      });
    } else {
      console.log('No files included');
    }
  }

  // Instead of forwarding to Zapier, we'll mock the response
  const lensType = req.body?.lensType || 'Unified';
  
  // Simulate processing delay based on lens type (more realistic)
  const delayTime = Math.floor(Math.random() * 2000) + 3000; // 3-5 seconds
  
  console.log(`Simulating processing delay of ${delayTime}ms for ${lensType} lens...`);
  
  setTimeout(() => {
    // Generate a mock response based on the lens type
    const mockResponse = generateMockResponse(lensType, req.body?.companyName || 'Example Company');
    
    console.log(`Sending mock response for ${lensType} lens`);
    res.json(mockResponse);
  }, delayTime);
});

// Function to generate mock responses based on lens type
function generateMockResponse(lensType, companyName) {
  const baseResponse = {
    success: true,
    requestId: `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  };
  
  let result = '';
  
  switch (lensType) {
    case 'Skeptical':
      result = generateSkepticalResponse(companyName);
      break;
    case 'Contrarian':
      result = generateContrarianResponse(companyName);
      break;
    case 'Optimistic':
      result = generateOptimisticResponse(companyName);
      break;
    case 'CFO':
      result = generateCFOResponse(companyName);
      break;
    case 'Unified':
    default:
      result = generateUnifiedResponse(companyName);
      break;
  }
  
  return {
    ...baseResponse,
    result
  };
}

function generateSkepticalResponse(companyName) {
  return `# Investment Analysis: Skeptical Board Member Perspective

## 10. Valuation Scenario Table

| Scenario | Probability (%) | Valuation ($M) | Key Assumptions |
|----------|----------------|---------------|----------------|
| Write-Off | 30 | 0 | Inability to scale beyond initial market; founder conflicts lead to execution failures |
| Bear | 25 | 40 | Limited market adoption; acquired for technology only with minimal premium |
| Base | 25 | 90 | Moderate growth in LatAm market; regional acquisition at standard multiple |
| Bull | 15 | 180 | Strong regional presence; attractive acquisition target for global player |
| Moonshot | 5 | 400 | Category dominance in LatAm; strategic acquisition at premium valuation |
| TOTAL | 100% | - | - |

**Weighted Valuation Total (WVT)**: $65.5M

**Entry Price Bands:**
- Strong Yes: ≤ $6.55M post-money (WVT ÷ 10)
- Yes: > $6.55M and ≤ $9.36M post-money (WVT ÷ 7)
- No: > $9.36M and ≤ $21.83M post-money (WVT ÷ 3)
- Strong No: > $21.83M post-money

## 11. Investment Decision

- **Recommendation: No**
- **Investment range:** Invest at ≤$9.36M post; pass above $21.83M
- **Key sensitivity:** Proof of scalable unit economics across multiple markets
- **Conviction level:** Medium

## 12. Contrarian Take

${companyName}'s perceived competitive moat relies on network effects that may prove more fragile than expected when faced with well-funded competitors.`;
}

function generateContrarianResponse(companyName) {
  return `# Investment Analysis: Contrarian Perspective

## 10. Valuation Scenario Table

| Scenario | Probability (%) | Valuation ($M) | Key Assumptions |
|----------|----------------|---------------|----------------|
| Write-Off | 15 | 0 | Regulatory changes disrupt business model; unable to pivot effectively |
| Bear | 20 | 50 | Limited growth but stable business; small strategic acquisition |
| Base | 30 | 120 | Successful expansion to 3-4 LatAm markets; moderate growth trajectory |
| Bull | 25 | 250 | Market leader in key segments; attractive acquisition for global player |
| Moonshot | 10 | 600 | Disruptive market position; IPO or major acquisition at premium |
| TOTAL | 100% | - | - |

**Weighted Valuation Total (WVT)**: $147M

**Entry Price Bands:**
- Strong Yes: ≤ $14.7M post-money (WVT ÷ 10)
- Yes: > $14.7M and ≤ $21M post-money (WVT ÷ 7)
- No: > $21M and ≤ $49M post-money (WVT ÷ 3)
- Strong No: > $49M post-money

## 11. Investment Decision

- **Recommendation: Yes**
- **Investment range:** Invest at ≤$21M post; pass above $21M
- **Key sensitivity:** Ability to maintain growth while improving unit economics
- **Conviction level:** Medium

## 12. Contrarian Take

While competitors focus on customer acquisition, ${companyName}'s emphasis on retention metrics may create an undervalued advantage in lifetime customer value.`;
}

function generateOptimisticResponse(companyName) {
  return `# Investment Analysis: Optimistic Perspective

## 10. Valuation Scenario Table

| Scenario | Probability (%) | Valuation ($M) | Key Assumptions |
|----------|----------------|---------------|----------------|
| Write-Off | 10 | 0 | Catastrophic regulatory change or major market shift |
| Bear | 15 | 60 | Slower growth than anticipated; modest exit |
| Base | 30 | 150 | Successful execution in core markets; attractive acquisition target |
| Bull | 30 | 300 | Market leadership position; strategic premium acquisition |
| Moonshot | 15 | 800 | Category-defining company; IPO or major strategic acquisition |
| TOTAL | 100% | - | - |

**Weighted Valuation Total (WVT)**: $226.5M

**Entry Price Bands:**
- Strong Yes: ≤ $22.65M post-money (WVT ÷ 10)
- Yes: > $22.65M and ≤ $32.36M post-money (WVT ÷ 7)
- No: > $32.36M and ≤ $75.5M post-money (WVT ÷ 3)
- Strong No: > $75.5M post-money

## 11. Investment Decision

- **Recommendation: Strong Yes**
- **Investment range:** Invest at ≤$22.65M post; pass above $32.36M
- **Key sensitivity:** Execution speed and competitive response
- **Conviction level:** High

## 12. Contrarian Take

${companyName}'s technology platform is more adaptable to adjacent verticals than competitors realize, creating untapped expansion opportunities beyond current market projections.`;
}

function generateCFOResponse(companyName) {
  return `# Investment Analysis: CFO Perspective

## 10. Valuation Scenario Table

| Scenario | Probability (%) | Valuation ($M) | Key Assumptions |
|----------|----------------|---------------|----------------|
| Write-Off | 20 | 0 | Failure to achieve positive unit economics; cash burn without path to profitability |
| Bear | 25 | 45 | Modest growth but limited scale; small strategic acquisition |
| Base | 35 | 110 | Solid growth with path to profitability; regional market leader |
| Bull | 15 | 220 | Strong financial performance; attractive acquisition target |
| Moonshot | 5 | 500 | Exceptional growth with industry-leading margins; premium valuation |
| TOTAL | 100% | - | - |

**Weighted Valuation Total (WVT)**: $92.75M

**Entry Price Bands:**
- Strong Yes: ≤ $9.28M post-money (WVT ÷ 10)
- Yes: > $9.28M and ≤ $13.25M post-money (WVT ÷ 7)
- No: > $13.25M and ≤ $30.92M post-money (WVT ÷ 3)
- Strong No: > $30.92M post-money

## 11. Investment Decision

- **Recommendation: Yes**
- **Investment range:** Invest at ≤$13.25M post; pass above $30.92M
- **Key sensitivity:** Path to profitability and cash burn rate
- **Conviction level:** Medium

## 12. Contrarian Take

${companyName}'s financial model undervalues the compounding effect of their high customer retention rates, which will drive significantly better long-term economics than peers.`;
}

function generateUnifiedResponse(companyName) {
  return `# Comprehensive Investment Analysis for ${companyName}

## Executive Summary

${companyName} presents a compelling opportunity in the Latin American market with a unique approach to solving [industry problem]. After analyzing the company through four distinct lenses (Skeptical, Contrarian, Optimistic, and CFO perspectives), we arrive at a balanced investment recommendation.

The company demonstrates strong founder-market fit, with the team bringing relevant experience from [previous companies]. Their initial traction shows promising signs of product-market fit, with [key metrics] growing at [growth rate] month-over-month. However, concerns remain around the competitive landscape and path to profitability.

## Lens Analysis Summary

### Skeptical Lens
- **Key Concern**: Scalability across diverse Latin American markets
- **Risk Assessment**: High customer acquisition costs may prove unsustainable
- **Valuation Perspective**: Conservative WVT of $65.5M suggests caution at valuations above $9.36M

### Contrarian Lens
- **Unique Insight**: Market underestimates network effects in this vertical
- **Competitive Advantage**: Proprietary technology creates meaningful barriers to entry
- **Valuation Perspective**: WVT of $147M supports investment up to $21M post-money

### Optimistic Lens
- **Growth Potential**: Clear path to category leadership in multiple markets
- **Expansion Opportunities**: Adjacent verticals provide significant upside
- **Valuation Perspective**: WVT of $226.5M justifies investment up to $32.36M post-money

### CFO Lens
- **Unit Economics**: Path to profitability visible within 18-24 months
- **Capital Efficiency**: Better-than-average metrics for the sector
- **Valuation Perspective**: WVT of $92.75M suggests reasonable investment up to $13.25M

## Consolidated Investment Recommendation

Based on the weighted analysis across all four lenses, we recommend:

- **Recommendation: Yes**
- **Investment range:** Invest at ≤$15M post-money; pass above $25M
- **Key sensitivity factors:**
  1. Unit economics improvement in next 6 months
  2. Successful expansion to at least 2 additional markets
  3. Regulatory landscape stability

- **Conviction level:** Medium-High

## Strategic Value-Add Opportunities

1. Leverage fund's network for key hires in finance and operations
2. Support regional expansion strategy with local market insights
3. Assist with strategic partnerships in complementary verticals
4. Provide guidance on optimal pricing strategy to improve unit economics

## Follow-up Actions

1. Complete customer reference calls with 3-5 enterprise clients
2. Review detailed financial model with focus on CAC and LTV assumptions
3. Conduct additional due diligence on regulatory landscape
4. Arrange meeting between founders and potential strategic partners from portfolio`;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Debug proxy server running on port ${PORT}`);
  console.log(`Access Zapier webhook via: http://localhost:${PORT}/zapier`);
  console.log('This server will log all prompts received from your UI');
});

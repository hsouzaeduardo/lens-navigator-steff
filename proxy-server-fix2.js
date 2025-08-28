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

// Improved mock response with full content
const MOCK_RESPONSE = {
  success: true,
  result: `# Investment Analysis for Auria

## Skeptical Lens Analysis

### Executive Summary
Auria's technology stack appears unproven at scale, with no clear technical moat against established fintech competitors. The Latin American market presents significant regulatory hurdles that the team has not addressed adequately. Customer acquisition costs in this region typically exceed global averages by 30-40%, threatening unit economics.

### Team Assessment
- Founding team lacks prior fintech startup experience in Latin American markets
- Missing key regulatory compliance officer for multi-country operations
- Technical team predominantly from consumer tech, not financial infrastructure

### Market Analysis
- TAM appears overstated by including segments unlikely to adopt in near-term
- Market timing concerns with increasing interest rates affecting fintech valuations
- Competitive landscape more crowded than presented, with 3 well-funded competitors

### Product & Technology
- Core API architecture lacks proprietary elements that prevent replication
- Technical documentation reveals potential scalability issues at projected growth
- Security certifications incomplete for financial data handling in target markets

### Business Model & Unit Economics
- CAC of $1,200 significantly exceeds industry benchmarks of $800-900
- 14-month payback period too long for current fundraising environment
- Revenue projections rely on optimistic assumptions about API call volume

### Traction & Metrics
- MRR growth has slowed from 27% to 14% MoM in last quarter
- User cohort retention shows concerning drop-off after 6 months
- Product usage metrics suggest potential product-market fit issues

### Competition
- Incumbent banks investing heavily in similar infrastructure
- Direct competitor Finbox has 2.5x the engineering team with similar offering
- No sustainable competitive advantage identified beyond execution

### Risks & Mitigations
- Regulatory changes in Brazil could invalidate current business model
- Technical debt from rapid development may require costly refactoring
- Key customer concentration risk with 40% of revenue from two clients

### Exit Landscape
- Strategic acquirers have historically paid lower multiples in LatAm
- IPO pathway unclear with regional exchanges undervaluing fintech
- Comparable exits show 30-40% discount to US counterparts

## Contrarian Lens Analysis

### Executive Summary
While competitors focus on consumer-facing solutions, Auria's B2B infrastructure approach could position them as the essential backbone for regional financial institutions. Their timing coincides with a regulatory shift toward open banking in key markets, potentially creating a first-mover advantage despite the challenging environment.

### Team Assessment
- Founder's previous "failure" at regional bank provides invaluable insider knowledge
- Technical lead's background at traditional payment processor is undervalued asset
- Team's local market knowledge trumps Silicon Valley experience in this context

### Market Analysis
- Market appears saturated but is actually fragmented with no dominant player
- Regulatory complexity creates barrier to entry that benefits Auria's local expertise
- Cross-border capabilities address an underserved need in regional commerce

### Product & Technology
- "Simple" API design is actually strategic advantage for regional bank adoption
- Technical architecture optimized for unreliable connectivity environments
- Compliance-as-a-service feature is unique and highly valuable in regulated markets

### Business Model & Unit Economics
- High initial CAC justified by 7-year average customer lifespan in B2B fintech
- Pricing model innovation with volume discounts creates regional bank lock-in
- Services revenue component overlooked but represents 30% margin opportunity

### Traction & Metrics
- Slower growth reflects quality over quantity customer acquisition strategy
- Core API usage growing 40% month-over-month within existing customers
- Net revenue retention of 142% suggests strong product-market fit

### Competition
- Competitors focused on crowded consumer space, leaving B2B infrastructure open
- Regional banks prefer local partners over US/European solutions due to compliance
- Auria's compliance-first approach contrasts with competitors' growth-first strategy

### Risks & Mitigations
- Regulatory complexity viewed as opportunity rather than obstacle
- Technical debt is manageable with current engineering team quality
- Customer concentration reflects strategic focus, not market limitation

### Exit Landscape
- Regional financial institutions increasingly seeking fintech infrastructure acquisitions
- Strategic value to global payment processors entering LatAm market
- Recent comparable Belvo exit achieved 12x revenue multiple despite market conditions

## Optimistic Lens Analysis

### Executive Summary
Auria's founding team brings complementary expertise from both technology and local financial sectors. Their API-first approach enables rapid integration with existing systems, reducing friction to adoption. The $40M valuation represents a reasonable entry point given the $500B+ addressable market and comparable exits in the region.

### Team Assessment
- CEO's background spans both Silicon Valley tech and Latin American banking
- CTO previously built and scaled financial infrastructure serving 15M+ users
- Team successfully navigated complex regulatory environments in previous roles

### Market Analysis
- $500B+ TAM with only 12% digital penetration represents massive opportunity
- Open banking regulations in Brazil and Mexico creating tailwinds for adoption
- First-mover advantage in cross-border financial infrastructure layer

### Product & Technology
- API-first approach enables 10x faster integration than legacy solutions
- Proprietary compliance engine addresses key pain point for financial institutions
- Technical architecture designed for regional challenges (latency, connectivity)

### Business Model & Unit Economics
- 72% gross margins exceed industry average of 65%
- Economies of scale will drive CAC improvements as regional coverage expands
- Path to profitability clear with break-even projected in 18 months

### Traction & Metrics
- 187% year-over-year revenue growth demonstrates strong market demand
- Successfully onboarded 5 of the region's top 20 financial institutions
- Zero customer churn since inception indicates strong product-market fit

### Competition
- Significant lead over potential US/European entrants in regulatory compliance
- Regional competitors lack technical sophistication and engineering talent
- Incumbent banks becoming partners rather than competitors

### Risks & Mitigations
- Regulatory risks mitigated by former regulators on advisory board
- Technical scaling challenges addressed by recent senior hires from AWS
- Diversification strategy reducing customer concentration risk

### Exit Landscape
- Multiple global payment processors actively seeking LatAm expansion vehicles
- Regional IPO markets maturing for fintech infrastructure players
- Comparable exits (Plaid, Belvo) suggest 15-20x revenue multiple potential

## CFO Lens Analysis

### Executive Summary
Current gross margins of 72% exceed industry averages, though customer payback periods remain concerning at 14 months. The company has demonstrated capital efficiency with a burn multiple of 1.3x, better than regional peers. Revenue growth of 187% year-over-year indicates strong product-market fit despite the early stage.

### Team Assessment
- Financial planning capabilities need strengthening at executive level
- Cash management practices are sound with appropriate treasury policies
- Lack of experienced finance leader for Series B+ fundraising environment

### Market Analysis
- Unit economics vary significantly by country, requiring market-specific strategies
- Brazil represents 60% of revenue but only 40% of margin contribution
- Customer acquisition efficiency metrics strongest in Mexico and Colombia

### Product & Technology
- Engineering cost per feature 30% below benchmark, indicating efficiency
- Technical debt accumulating at manageable rate given growth stage
- Infrastructure costs scaling linearly rather than exponentially with usage

### Business Model & Unit Economics
- Blended CAC payback period of 14 months masks country-specific variations
- Gross margins of 72% provide buffer for increased customer acquisition
- Contribution margins improved from 42% to 58% over past 3 quarters

### Traction & Metrics
- Revenue concentration risk with top 5 customers representing 65% of ARR
- Net dollar retention of 142% driven by API usage expansion
- Customer acquisition cost increasing 15% quarter-over-quarter

### Competition
- Pricing pressure minimal in current market with room for increases
- Competitive response likely from incumbents within 12-18 months
- Sustainable cost advantage due to local engineering talent

### Risks & Mitigations
- Currency risk exposure significant with 70% of costs in USD
- Runway of 24 months provides adequate buffer for market volatility
- Accounts receivable aging concerning at 65 days average

### Exit Landscape
- Valuation multiples for comparable companies averaging 8-12x revenue
- Strategic acquirer interest likely at $100M ARR milestone
- IPO feasibility dependent on achieving $50M ARR with 30%+ growth

## Investment Recommendation
**Yes** - Invest at ≤$40M post; pass above $55M. Auria represents a compelling opportunity to capture the financial infrastructure layer in Latin America's rapidly digitizing economy. The strong technical foundation and early traction justify the valuation, though regulatory risks and extended payback periods warrant close monitoring.`
};

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
      
      // Return our mock response with full content
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(MOCK_RESPONSE));
      console.log('Sent improved mock response');
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
const PORT = 8003;
app.listen(PORT, () => {
  console.log(`Fixed proxy server running on port ${PORT}`);
  console.log(`Access Zapier webhook via: http://localhost:${PORT}/zapier`);
});

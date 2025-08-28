# Lens Navigator

Lens Navigator is an AI-powered investment analysis tool that uses a 4-lens framework to provide comprehensive analysis of potential investments. The application integrates with Zapier to connect to OpenAI's Deep Research model, offering in-depth analysis through four different perspectives: Skeptical, Contrarian, Optimistic, and CFO.

## Features

- **4-Lens Analysis Framework**: Analyze investments from multiple perspectives
- **Zapier Integration**: Connect to OpenAI's Deep Research model via Zapier webhooks
- **Document Upload**: Include documents in your analysis for more context
- **Apple-Inspired UI**: Clean, modern interface following Apple's Human Interface Guidelines
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or bun package manager
- A Zapier account with webhooks configured for OpenAI Deep Research

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lens-navigator.git
   cd lens-navigator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Start the local CORS proxy (for local development):
   ```bash
   npm run proxy
   ```

## Deployment

### Vercel Deployment

The easiest way to deploy Lens Navigator is with Vercel:

1. Import your GitHub repository to Vercel
2. Configure the project with these settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Root Directory: `./`
3. Click "Deploy"

For detailed deployment instructions, see [VERCEL_DEPLOYMENT_STEPS.md](VERCEL_DEPLOYMENT_STEPS.md).

## Configuration

### Zapier Webhooks

The application is configured to use Zapier webhooks for connecting to OpenAI's Deep Research model. Update the webhook URLs in `src/lib/zapier-lens-urls.ts`:

```typescript
const PROD_URLS = {
  Skeptical: 'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_HOOK/',
  Contrarian: 'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_HOOK/',
  Optimistic: 'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_HOOK/',
  CFO: 'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_HOOK/',
  Unified: 'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_HOOK/'
};
```

## Architecture

- **React**: Frontend framework for UI components
- **Vite**: Build tool for fast development
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for UI interactions
- **Zapier Webhooks**: Integration point for OpenAI Deep Research API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenAI for the Deep Research API
- Zapier for webhook integration
- Apple Human Interface Guidelines for design inspiration
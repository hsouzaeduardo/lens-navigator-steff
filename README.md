# Lens Navigator - AI Investment Committee Platform

An AI-powered investment analysis platform featuring multi-lens evaluation and deep research capabilities.

## Features

- **4-Lens Analysis**: Quick investment evaluation through Skeptical, Contrarian, Optimistic, and CFO perspectives
- **Deep Research**: Comprehensive multi-source analysis using OpenAI's o3-deep-research model
- **Vector Store Integration**: Analyze private documents alongside public data
- **Background Processing**: Long-running research tasks with progress tracking
- **Export Capabilities**: Generate PDF reports and structured data exports

## Project info

**URL**: https://lovable.dev/projects/bf36df75-a331-4572-bbbd-e5b3ed2b209d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/bf36df75-a331-4572-bbbd-e5b3ed2b209d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables
cp .env.example .env
# Add your API keys to .env file

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deep Research Setup

To use the deep research features, you'll need:

1. **OpenAI API Access**
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Get access to o3-deep-research model (contact OpenAI sales)
   - Add your API key to `.env`: `VITE_OPENAI_API_KEY=sk-...`

2. **Configure Webhooks (Optional)**
   - Set up webhook endpoint in OpenAI dashboard
   - Deploy the Supabase function: `supabase functions deploy openai-webhook`

3. **Quick Setup**
   ```bash
   # Run the setup script
   chmod +x setup-deep-research.sh
   ./setup-deep-research.sh
   ```

For detailed instructions, see [DEEP_RESEARCH_GUIDE.md](./DEEP_RESEARCH_GUIDE.md)

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/bf36df75-a331-4572-bbbd-e5b3ed2b209d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

#!/bin/bash

echo "🚀 Setting up Deep Research Integration for Lens Navigator"
echo "========================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "⚠️  .env file already exists"
fi

# Check if OpenAI API key is set
if ! grep -q "VITE_OPENAI_API_KEY=sk-" .env; then
    echo ""
    echo "⚠️  OpenAI API key not found in .env file"
    echo "Please add your OpenAI API key to the .env file:"
    echo "VITE_OPENAI_API_KEY=sk-your-api-key-here"
    echo ""
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Deploy Supabase functions (if using Supabase)
if command -v supabase &> /dev/null; then
    echo ""
    echo "Deploying Supabase webhook function..."
    supabase functions deploy openai-webhook
else
    echo ""
    echo "⚠️  Supabase CLI not found. Skip deploying webhook function."
    echo "Install with: npm install -g supabase"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to .env file"
echo "2. Configure webhook in OpenAI dashboard (optional)"
echo "3. Run 'npm run dev' to start the application"
echo "4. Read DEEP_RESEARCH_GUIDE.md for detailed instructions"
echo ""
echo "Important: Make sure you have access to o3-deep-research model"
echo "Contact OpenAI sales if you need access: https://openai.com/contact-sales"

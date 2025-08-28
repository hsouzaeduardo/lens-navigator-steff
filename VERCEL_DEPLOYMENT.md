# Deploying Lens Navigator to Vercel

This guide provides step-by-step instructions for deploying your Lens Navigator application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Git repository with your Lens Navigator code
3. Your Zapier webhooks properly configured

## Step 1: Prepare Your Repository

Ensure your repository includes all the necessary files:

- All application code
- `vercel.json` configuration file
- `api/zapier/[lensId].js` serverless function
- Updated `src/lib/zapier-lens-urls.ts` file

## Step 2: Install Vercel CLI (Optional)

If you want to test your deployment locally first:

```bash
npm install -g vercel
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Root Directory: `./` (or select the appropriate directory)
5. Click "Deploy"

### Option B: Using Vercel CLI

1. Open your terminal
2. Navigate to your project directory
3. Run:
   ```bash
   vercel
   ```
4. Follow the prompts to configure your deployment
5. For production deployment, run:
   ```bash
   vercel --prod
   ```

## Step 4: Verify Your Deployment

1. After deployment completes, Vercel will provide you with a deployment URL (e.g., `https://lens-navigator.vercel.app`)
2. Open this URL in your browser
3. Test your application:
   - Enter a company name and other details
   - Submit the analysis form
   - Verify that all four lenses are analyzed correctly
   - Check that the results are displayed properly

## Step 5: Check Serverless Function Logs

If you encounter issues with the Zapier integration:

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Functions"
4. Find the `api/zapier/[lensId].js` function
5. Check its logs for any errors

## Step 6: Set Up a Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

## Step 7: Configure Environment Variables (Optional)

If you have any environment variables:

1. In your Vercel dashboard, go to your project
2. Click on "Settings" → "Environment Variables"
3. Add your environment variables

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Check that your serverless function (`api/zapier/[lensId].js`) is setting the proper CORS headers
2. Verify that the function is being called correctly from your frontend

### Function Timeouts

If your function times out:

1. Go to your Vercel dashboard
2. Navigate to "Settings" → "Functions"
3. Increase the maximum execution duration

### Zapier Connection Issues

If the Zapier integration isn't working:

1. Test your Zapier webhooks directly using the `test-multi-lens.js` script
2. Check the Vercel function logs for any errors
3. Verify that your Zapier webhooks are active and correctly configured

## Next Steps

1. Set up monitoring for your application
2. Configure automatic deployments from your Git repository
3. Set up error alerting
4. Consider implementing caching to reduce API calls and improve performance

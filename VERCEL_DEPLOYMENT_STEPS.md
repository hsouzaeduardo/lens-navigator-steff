# Vercel Deployment Steps

Now that your code is committed and pushed to GitHub, follow these steps to deploy your application to Vercel:

## Step 1: Sign Up/Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up for an account or log in with your GitHub account

## Step 2: Import Your GitHub Repository

1. From the Vercel dashboard, click "Add New..." → "Project"
2. Connect your GitHub account if not already connected
3. Find and select the `lens-navigator-steff` repository
4. Click "Import"

## Step 3: Configure Project Settings

1. Configure the project with these settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Root Directory: `./`

2. Expand "Environment Variables" if you need to add any (not required for basic setup)

3. Click "Deploy"

## Step 4: Wait for Deployment

1. Vercel will build and deploy your application
2. This typically takes 1-2 minutes

## Step 5: Test Your Deployment

1. Once deployed, Vercel will provide you with a deployment URL (e.g., `https://lens-navigator-steff.vercel.app`)
2. Open this URL in your browser
3. Test your application:
   - Enter a company name and other details
   - Submit the analysis form
   - Verify that all four lenses are analyzed correctly
   - Check that the results are displayed properly

## Step 6: Update Your Test Script

1. Open the `vercel-test.js` file
2. Update the `VERCEL_BASE_URL` variable with your actual Vercel deployment URL:
   ```javascript
   const VERCEL_BASE_URL = 'https://lens-navigator-steff.vercel.app';
   ```
3. Run the test script to verify your serverless functions:
   ```
   node vercel-test.js
   ```

## Step 7: Set Up a Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

## Troubleshooting

If you encounter issues:

1. Check the Vercel deployment logs in your dashboard
2. Verify that your serverless functions are working correctly
3. Make sure your Zapier webhooks are active and correctly configured

## Next Steps

1. Set up monitoring for your application
2. Configure automatic deployments from your GitHub repository
3. Set up error alerting
4. Consider implementing caching to reduce API calls and improve performance

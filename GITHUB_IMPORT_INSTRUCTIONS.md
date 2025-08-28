# Importing the Lens Navigator Project to Your GitHub Account

Follow these steps to import the existing repository to your own GitHub account:

## Option 1: GitHub Import Tool (Recommended)

1. Go to https://github.com/new/import
2. In the "Your old repository's clone URL" field, enter:
   ```
   https://github.com/hsouzaeduardo/lens-navigator-steff
   ```
3. Choose a name for your new repository (e.g., "lens-navigator")
4. Select whether you want it to be public or private
5. Click "Begin import"
6. Wait for the import to complete (usually takes a few minutes)

## Option 2: Clone and Push to a New Repository

If you prefer to use the command line:

1. Create a new empty repository on your GitHub account
2. Clone the existing repository:
   ```bash
   git clone https://github.com/hsouzaeduardo/lens-navigator-steff.git
   cd lens-navigator-steff
   ```
3. Change the remote URL to your new repository:
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git
   ```
4. Push to your new repository:
   ```bash
   git push -u origin main
   ```

## After Importing

Once you've imported the repository to your account:

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Find and select your newly imported repository
4. Configure the project with these settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Root Directory: `./`
5. Click "Deploy"

## Fixing Merge Conflicts

It appears there are merge conflicts in the repository. After importing, you should fix these:

1. Open the problematic file (`src/pages/Index.tsx`)
2. Remove the merge conflict markers:
   - `<<<<<<< HEAD`
   - `=======`
   - `>>>>>>> 8b3e345 (Unified 4-lens analysis with improved UI and error handling)`
3. Resolve the conflicting code sections
4. Commit the changes:
   ```bash
   git add src/pages/Index.tsx
   git commit -m "Fix merge conflicts"
   git push
   ```

## Testing After Deployment

After deployment:

1. Update the `VERCEL_BASE_URL` in `vercel-test.js` with your Vercel deployment URL
2. Run the test script to verify your serverless functions:
   ```bash
   node vercel-test.js
   ```

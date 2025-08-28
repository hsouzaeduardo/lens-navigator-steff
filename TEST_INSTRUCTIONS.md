# Testing the Multi-Lens Analysis System

This document provides instructions for testing your Lens Navigator application with the multi-lens Zapier integration.

## Prerequisites

1. All proxy servers have been stopped
2. Zapier webhooks are properly configured
3. The application has been started with `npm start`

## Test Procedure

### 1. Basic Application Test

1. **Start the application**:
   ```
   npm start
   ```

2. **Verify the UI loads correctly**:
   - Check that the Apple-style UI renders properly
   - Verify dark mode toggle works
   - Ensure the 4-lens framework panel is visible

3. **Test lens item interactions**:
   - Hover over each lens item to see hover effects
   - Click on each lens to verify the sidebar opens
   - Check that the sidebar displays the correct lens content

### 2. Analysis Form Test

1. **Fill out the analysis form**:
   - Enter a company name (e.g., "TestCorp")
   - Enter a target valuation (e.g., "50")
   - Upload a test document if available

2. **Submit the form**:
   - Click "Start Analysis"
   - Verify the loading indicator appears

### 3. Zapier Integration Test

1. **Monitor Zapier task history**:
   - Log into Zapier
   - Navigate to each of your four lens Zaps
   - Check for incoming webhook requests

2. **Check application response**:
   - Wait for the analysis to complete
   - Verify that results from each lens are displayed
   - Check for any error messages

3. **Verify file handling**:
   - If you uploaded files, check Zapier logs to confirm they were received
   - Verify file content is referenced in the analysis

### 4. Caching Test

1. **Run the same analysis again**:
   - Submit the same company and valuation
   - Observe the response time (should be much faster)
   - Check browser console for cache hit messages

2. **Clear cache and retry**:
   - Open browser developer tools
   - Run `localStorage.clear()` in the console
   - Submit the analysis again
   - Verify it takes longer (cache miss)

### 5. Error Handling Test

1. **Test partial failures**:
   - Temporarily disable one of your Zaps in Zapier
   - Run an analysis
   - Verify the application shows results from working lenses
   - Check that an error message appears for the failed lens

2. **Test complete failure**:
   - Temporarily disable all Zaps
   - Run an analysis
   - Verify appropriate error message is displayed
   - Check "Start Over" button works

## Troubleshooting

If you encounter issues during testing:

1. **Check browser console for errors**:
   - Open developer tools (F12)
   - Look for error messages in the console

2. **Verify Zapier webhook URLs**:
   - Check `src/lib/zapier-lens-urls.ts`
   - Ensure URLs match your actual Zapier webhooks

3. **Test webhooks directly**:
   - Run `node test-multi-lens.js`
   - Check the response from each webhook

4. **Check Zapier task history**:
   - Look for errors in the Zapier task execution logs
   - Verify the OpenAI step is receiving the correct input

## Reporting Results

Document your test results including:

1. What worked correctly
2. Any issues encountered
3. Performance observations (response times)
4. Suggestions for improvement

This will help identify any remaining issues that need to be addressed before final deployment.

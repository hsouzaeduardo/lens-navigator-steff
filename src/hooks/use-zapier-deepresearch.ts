import { useState } from 'react';
import { 
  processUnifiedLensAnalysis, 
  processSingleLensAnalysis,
  ZapierDeepResearchResponse
} from '@/lib/zapier-webhook';
import { 
  generateCacheKey, 
  getCachedAnalysisResult, 
  cacheAnalysisResult 
} from '@/lib/cache-service';

// Define a simpler result type for the Zapier integration
export interface ZapierLensResult {
  type: 'Skeptical' | 'Contrarian' | 'Optimistic' | 'CFO' | 'Unified';
  content: string;
  loading: boolean;
  error: string | null;
}

interface UseZapierDeepResearchProps {
  onComplete?: (result: ZapierLensResult) => void;
  onError?: (error: string) => void;
}

export function useZapierDeepResearch({ onComplete, onError }: UseZapierDeepResearchProps = {}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ZapierLensResult | null>(null);

  /**
   * Process a multi-lens analysis by running each lens separately and then combining the results
   */
  const runUnifiedAnalysis = async (
    companyName: string,
    prompt: string,
    sector?: string,
    stage?: string,
    location?: string,
    files?: File[]
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check cache first for unified analysis
      const cacheKey = generateCacheKey(companyName, 'Unified', prompt, files);
      const cachedResult = getCachedAnalysisResult(cacheKey);
      
      if (cachedResult) {
        console.log(`Using cached result for unified analysis of ${companyName}`);
        setResult(cachedResult);
        onComplete?.(cachedResult);
        setLoading(false);
        return;
      }
      
      // Log the start of the analysis
      console.log(`Starting multi-lens analysis for ${companyName}`);
      
      // Define the lens types to run
      const lensTypes: Array<'Skeptical' | 'Contrarian' | 'Optimistic' | 'CFO'> = [
        'Skeptical', 'Contrarian', 'Optimistic', 'CFO'
      ];
      
      console.log(`Running separate analysis for each lens type: ${lensTypes.join(', ')}`);
      
      // Run each lens analysis separately
      const lensPromises = lensTypes.map(lensType => 
        processSingleLensAnalysis(
          companyName,
          lensType,
          prompt, // Using the same prompt for all lenses for now
          sector,
          stage,
          location,
          files
        )
      );
      
      // Wait for all lens analyses to complete
      const lensResponses = await Promise.all(lensPromises);
      
      // Handle partial failures - continue even if some lenses failed
      const successfulResponses: { lensType: string, result: string }[] = [];
      const failedLenses: string[] = [];
      
      lensResponses.forEach((response, index) => {
        const lensType = lensTypes[index];
        if (response.success && response.result) {
          successfulResponses.push({ lensType, result: response.result });
        } else {
          failedLenses.push(lensType);
          console.error(`Failed to process ${lensType} lens:`, response.error);
        }
      });
      
      // If all lenses failed, throw an error
      if (successfulResponses.length === 0) {
        throw new Error('All lens analyses failed. Please try again.');
      }
      
      // Combine the results from successful lenses
      const combinedContent = successfulResponses.map(({ lensType, result }) => {
        return `## ${lensType} Lens Analysis\n\n${result}\n\n`;
      }).join('\n');
      
      // Add a note about failed lenses if any
      const failureNote = failedLenses.length > 0 
        ? `\n\n## Note\nThe following lens analyses failed to complete: ${failedLenses.join(', ')}. You may want to try again for these lenses.\n\n` 
        : '';
      
      // Create a unified result with all lens analyses
      const lensResult: ZapierLensResult = {
        type: 'Unified',
        content: `# Investment Analysis for ${companyName}\n\n${combinedContent}${failureNote}`,
        loading: false,
        error: failedLenses.length > 0 ? `Failed to complete: ${failedLenses.join(', ')}` : null
      };
      
      // Cache the unified result
      cacheAnalysisResult(cacheKey, lensResult);
      
      // Update state and call the completion callback
      setResult(lensResult);
      onComplete?.(lensResult);
      
      /* 
      // Original unified approach:
      const response = await processUnifiedLensAnalysis(
        companyName,
        prompt,
        sector,
        stage,
        location,
        files
      );
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to process analysis');
      }
      
      // Create a result object with the analysis content
      const lensResult: ZapierLensResult = {
        type: 'Unified',
        content: response.result || '',
        loading: false,
        error: null
      };
      
      // Update state and call the completion callback
      setResult(lensResult);
      onComplete?.(lensResult);
      */
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error in runUnifiedAnalysis:', errorMessage);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Process a single lens analysis
   */
  const runSingleLensAnalysis = async (
    companyName: string,
    lensType: 'Skeptical' | 'Contrarian' | 'Optimistic' | 'CFO',
    prompt: string,
    sector?: string,
    stage?: string,
    location?: string,
    files?: File[]
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check cache first
      const cacheKey = generateCacheKey(companyName, lensType, prompt, files);
      const cachedResult = getCachedAnalysisResult(cacheKey);
      
      if (cachedResult) {
        console.log(`Using cached result for ${lensType} lens analysis of ${companyName}`);
        setResult(cachedResult);
        onComplete?.(cachedResult);
        setLoading(false);
        return;
      }
      
      // No cache hit, proceed with API call
      const response = await processSingleLensAnalysis(
        companyName,
        lensType,
        prompt,
        sector,
        stage,
        location,
        files
      );
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to process analysis');
      }
      
      const lensResult: ZapierLensResult = {
        type: lensType,
        content: response.result || '',
        loading: false,
        error: null
      };
      
      // Cache the result
      cacheAnalysisResult(cacheKey, lensResult);
      
      setResult(lensResult);
      onComplete?.(lensResult);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    runUnifiedAnalysis,
    runSingleLensAnalysis
  };
}
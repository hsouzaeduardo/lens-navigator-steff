/**
 * Cache service for storing and retrieving analysis results
 * 
 * This helps reduce API calls for expensive analyses and improves performance
 */

import { ZapierLensResult } from '@/hooks/use-zapier-deepresearch';

// Cache key prefix
const CACHE_PREFIX = 'lens-navigator-cache:';

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Cache entry interface
interface CacheEntry {
  timestamp: number;
  data: ZapierLensResult;
}

/**
 * Generate a cache key based on analysis parameters
 */
export function generateCacheKey(
  companyName: string,
  lensType: string,
  prompt: string,
  files?: File[]
): string {
  // Create a unique key based on the company name, lens type, and prompt
  const fileNames = files ? files.map(file => file.name).join(',') : '';
  const key = `${companyName}:${lensType}:${fileNames}:${prompt.substring(0, 50)}`;
  
  return `${CACHE_PREFIX}${key}`;
}

/**
 * Store analysis result in cache
 */
export function cacheAnalysisResult(
  key: string,
  result: ZapierLensResult
): void {
  try {
    const cacheEntry: CacheEntry = {
      timestamp: Date.now(),
      data: result
    };
    
    localStorage.setItem(key, JSON.stringify(cacheEntry));
    console.log(`Cached result for key: ${key}`);
  } catch (error) {
    console.error('Error caching analysis result:', error);
  }
}

/**
 * Retrieve analysis result from cache
 * Returns null if not found or expired
 */
export function getCachedAnalysisResult(key: string): ZapierLensResult | null {
  try {
    const cachedItem = localStorage.getItem(key);
    
    if (!cachedItem) {
      return null;
    }
    
    const cacheEntry: CacheEntry = JSON.parse(cachedItem);
    
    // Check if cache has expired
    if (Date.now() - cacheEntry.timestamp > CACHE_EXPIRATION) {
      // Remove expired cache
      localStorage.removeItem(key);
      return null;
    }
    
    console.log(`Cache hit for key: ${key}`);
    return cacheEntry.data;
  } catch (error) {
    console.error('Error retrieving cached analysis result:', error);
    return null;
  }
}

/**
 * Clear all cached analysis results
 */
export function clearAnalysisCache(): void {
  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Filter for cache keys and remove them
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('Analysis cache cleared');
  } catch (error) {
    console.error('Error clearing analysis cache:', error);
  }
}

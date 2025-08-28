import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  Brain,
  Zap,
  Eye,
  TrendingUp as TrendingUpIcon,
  Calculator,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { ExpandableLensBox } from '@/components/ExpandableLensBox'
import { AppleSidebar } from '@/components/AppleSidebar'
import { BackgroundExtensionCard } from '@/components/BackgroundExtensionCard'
import { AppleBackgroundExtension } from '@/components/AppleBackgroundExtension'
import { AnalysisForm } from '@/components/AnalysisForm'
import { DeepResearchAnalysis } from '@/components/DeepResearchAnalysis'
import { DeepResearchReport } from '@/components/DeepResearchReport'
import { useDeepResearch } from '@/hooks/use-deep-research'
import { useZapierDeepResearch, ZapierLensResult } from '@/hooks/use-zapier-deepresearch'

// Apple-style Lens Item Component
import { LucideIcon } from 'lucide-react';

interface LensItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  previewContent: string;
}

const LensItem: React.FC<LensItemProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  colorClass, 
  previewContent 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Map Tailwind color classes to Apple system colors
  const colorMap: Record<string, { bg: string, text: string }> = {
    'bg-destructive/10': { 
      bg: 'rgba(255, 59, 48, 0.1)', 
      text: 'rgb(255, 59, 48)' 
    },
    'bg-warning/10': { 
      bg: 'rgba(255, 149, 0, 0.1)', 
      text: 'rgb(255, 149, 0)' 
    },
    'bg-success/10': { 
      bg: 'rgba(52, 199, 89, 0.1)', 
      text: 'rgb(52, 199, 89)' 
    },
    'bg-primary/10': { 
      bg: 'rgba(0, 122, 255, 0.1)', 
      text: 'rgb(0, 122, 255)' 
    }
  };
  
  const appleColor = colorMap[colorClass] || { bg: 'rgba(0, 122, 255, 0.1)', text: 'rgb(0, 122, 255)' };
  
  return (
    <>
      <motion.div
        className="mb-3 last:mb-0 cursor-pointer rounded-xl overflow-hidden"
        style={{ 
          backgroundColor: appleColor.bg,
          border: `1px solid ${appleColor.text}10`,
        }}
        whileHover={{ 
          y: -2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsSidebarOpen(true)}
      >
        <div className="flex items-center space-x-4 p-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ 
              backgroundColor: `${appleColor.text}15`,
            }}
          >
            <Icon className="h-5 w-5" style={{ color: appleColor.text }} />
          </div>
          <div className="flex-1 min-w-0">
            <p 
              style={{ 
                fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'rgba(0, 0, 0, 0.9)',
                marginBottom: '4px'
              }}
              className="dark:text-white"
            >
              {title}
            </p>
            <p 
              style={{ 
                fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: '13px',
                letterSpacing: '-0.01em',
                color: 'rgba(0, 0, 0, 0.65)',
                margin: 0
              }}
              className="dark:text-gray-300"
            >
              {description}
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Apple-style sidebar with background extension effect */}
      <AppleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title={title}
        description={description}
        icon={Icon}
        colorClass={colorClass}
        content={previewContent}
      />
    </>
  );
};

// Lens preview content
const LENS_PREVIEWS = {
  skeptical: `You are an independent AI Investment Analyst for a Latin America-focused early-stage venture capital firm.

Focus Areas: Pattern recognition from failures, red flags, challenging assumptions

Specific Instructions: Apply your experience from hundreds of failed startups. Look for classic failure modes: founder disputes, market timing issues, fake moats. Question everything. Default to skepticism. Ask the hard questions others avoid.`,

  contrarian: `You are an independent AI Investment Analyst for a Latin America-focused early-stage venture capital firm.

Focus Areas: Unconventional insights, market misconceptions, hidden value

Specific Instructions: Challenge the consensus view. Find insights others miss. Identify common investor biases. Uncover hidden strengths or weaknesses. Explore contrarian theses. Prioritize intellectual honesty over popular narratives.`,

  optimistic: `You are an independent AI Investment Analyst for a Latin America-focused early-stage venture capital firm.

Focus Areas: Growth potential, market opportunity, founder vision

Specific Instructions: Adopt a founder-like optimism. Envision the best-case scenario. Focus on market tailwinds, team strengths, and business model advantages. Identify the path to a 100x outcome. Emphasize potential over problems.`,

  cfo: `You are an independent AI Investment Analyst for a Latin America-focused early-stage venture capital firm.

Focus Areas: Unit economics, burn rate, financial sustainability

Specific Instructions: Obsess over unit economics, CAC payback periods, LTV/CAC ratios, gross margins, contribution margins, burn rate, and runway. Model different growth scenarios and their cash needs. Flag any financial red flags immediately.`
};

// Mock data for demonstration
const mockCompanyData = {
  companyName: 'Caveo',
  targetValuation: 40,
  sector: 'Fintech',
  stage: 'Series A',
  location: 'São Paulo, Brazil',
  description: 'Digital banking platform for small businesses in Latin America'
}

interface AnalysisData {
    companyName: string
  targetValuation: string
    files: File[]
    prompts: {
      skeptical: string
      contrarian: string
      optimistic: string
      cfo: string
    }
}
  
const Index = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<typeof mockCompanyData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false)
  const [deepResearchResult, setDeepResearchResult] = useState<string | null>(null)
  
  const { startResearch, isLoading: isDeepResearchLoading } = useDeepResearch()
  
  // Initialize Zapier Deep Research hook
  const { 
    runUnifiedAnalysis: runZapierAnalysis, 
    loading: isZapierLoading,
    error: zapierError,
    result: zapierResult
  } = useZapierDeepResearch({
    onComplete: (result: ZapierLensResult) => {
      handleDeepResearchComplete(result.content)
    },
    onError: (error) => {
      setDeepResearchResult(`Error: ${error}`)
      setIsAnalysisComplete(false)
      setIsAnalyzing(false)
    }
  })
  
  // Initialize theme from localStorage or system preference
  React.useEffect(() => {
    // Check if user has previously set theme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    }
  }, [])

  // Run unified 4-lens deep research analysis
  const runUnifiedAnalysis = async (data: AnalysisData) => {
    setIsAnalyzing(true)
    
    // Convert the data to match our expected format
    const analysisData = {
      companyName: data.companyName,
      targetValuation: parseInt(data.targetValuation) || 0,
      sector: 'Technology', // Default value
      stage: 'Series A', // Default value
      location: 'Latin America', // Default value
      description: 'Technology company'
    }
    
    setCurrentAnalysis(analysisData)
    
    try {
      // Build the unified prompt for all four lenses
      const unifiedPrompt = `
# Investment Analysis for ${data.companyName}

## Company Information
- Company Name: ${data.companyName}
- Target Valuation: $${data.targetValuation}M
- Sector: Technology
- Stage: Series A
- Location: Latin America

## Analysis Requirements
Please provide a comprehensive investment analysis using the following four lenses:

### Skeptical Lens
${LENS_PREVIEWS.skeptical}

### Contrarian Lens
${LENS_PREVIEWS.contrarian}

### Optimistic Lens
${LENS_PREVIEWS.optimistic}

### CFO Lens
${LENS_PREVIEWS.cfo}

## Output Format
For each lens, provide a structured analysis following the lens-specific requirements.
Conclude with an overall investment recommendation that synthesizes insights from all four perspectives.
`;
      
      // Use Zapier webhook integration to run the analysis
      await runZapierAnalysis(
        data.companyName,
        unifiedPrompt,
        'Technology', // Default sector
        'Series A',   // Default stage
        'Latin America', // Default location
        data.files    // Pass uploaded files
      );
      
      } catch (error) {
      console.error('Analysis failed:', error)
      setIsAnalyzing(false)
      // Set error message to be displayed
      setDeepResearchResult(error instanceof Error ? error.message : 'Analysis failed. Please try again.')
      setIsAnalysisComplete(false)
    }
  }

  // Handle deep research completion
  const handleDeepResearchComplete = (analysis: string) => {
    setDeepResearchResult(analysis)
    setIsAnalysisComplete(true)
  }
  
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      
      {/* Apple-style Toolbar */}
      <div className="apple-toolbar">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <div className="apple-toolbar-title">Lens Navigator</div>
            </div>
        <div className="flex-1"></div>
        <button 
          className="apple-toolbar-button" 
          onClick={() => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
          }}
          aria-label="Toggle dark mode"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>
        </button>
        </div>

            <div className="container mx-auto px-6 py-8">
        {/* Header - Removed as requested */}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6" style={{ minWidth: '320px' }}>
            {/* Company Info Card */}
            {currentAnalysis && (
              <Card className="apple-card sticky top-8">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>{currentAnalysis.companyName}</span>
                  </CardTitle>
                  <CardDescription>Investment Analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Target Valuation</span>
                    <Badge className="apple-badge bg-secondary font-mono">
                      ${currentAnalysis.targetValuation}M
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sector</span>
                    <Badge className="apple-badge">{currentAnalysis.sector}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stage</span>
                    <Badge className="apple-badge">{currentAnalysis.stage}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <Badge className="apple-badge">{currentAnalysis.location}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 4-Lens Framework - Apple Style */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ minWidth: '300px', width: '100%' }}
            >
              <AppleBackgroundExtension 
                className="rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(250, 250, 252, 0.85)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  ...(document.documentElement.classList.contains('dark') ? {
                    backgroundColor: 'rgba(28, 28, 30, 0.85)',
                    border: '1px solid rgba(70, 70, 80, 0.3)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.2)'
                  } : {})
                }}
                color={document.documentElement.classList.contains('dark') ? 
                  'rgba(50, 120, 255, 0.3)' : 'rgba(0, 122, 255, 0.2)'}
                intensity={0.3}
                mirrorBackground={true}
              >
              {/* Header with Apple-style typography */}
              <div 
                className="flex items-center justify-center py-4 px-5 border-b dark:border-[rgba(70,70,80,0.3)]"
                style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}
              >
                <h3 
                  className="dark:text-[rgba(255,255,255,0.9)]"
                  style={{ 
                    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: '17px',
                    fontWeight: 600,
                    letterSpacing: '-0.022em',
                    color: 'rgba(0, 0, 0, 0.9)',
                    margin: 0
                  }}
                >
                  4-Lens Framework
                </h3>
              </div>
              
              {/* Content with Apple-style lens items */}
              <div className="p-4">
                <LensItem
                  title="Skeptical"
                  description="Risk & Red Flags"
                  icon={Eye}
                  colorClass="bg-destructive/10"
                  previewContent={LENS_PREVIEWS.skeptical}
                />
                
                <LensItem
                  title="Contrarian"
                  description="Hidden Insights"
                  icon={TrendingUpIcon}
                  colorClass="bg-warning/10"
                  previewContent={LENS_PREVIEWS.contrarian}
                />
                
                <LensItem
                  title="Optimistic"
                  description="Upside Potential"
                  icon={Zap}
                  colorClass="bg-success/10"
                  previewContent={LENS_PREVIEWS.optimistic}
                />
                
                <LensItem
                  title="CFO"
                  description="Unit Economics"
                  icon={Calculator}
                  colorClass="bg-primary/10"
                  previewContent={LENS_PREVIEWS.cfo}
                />
              </div>
              </AppleBackgroundExtension>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!currentAnalysis ? (
              <div className="flex flex-col items-center justify-center">
                <BackgroundExtensionCard className="w-full max-w-3xl">
                  <div className="pt-6 pb-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Brain className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="apple-heading-2 mb-3">
                      Start Your Investment Analysis
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Enter company details to begin a comprehensive 4-lens deep research analysis using OpenAI's advanced AI models.
                    </p>
                    <AnalysisForm onSubmit={runUnifiedAnalysis} isLoading={isAnalyzing} />
                  </div>
                </BackgroundExtensionCard>
              </div>
            ) : (
              <>
                {/* Analysis Status */}
                <BackgroundExtensionCard>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        {isAnalysisComplete ? (
                          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-success" />
                          </div>
                        ) : isAnalyzing ? (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-primary animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                            <XCircle className="h-5 w-5 text-destructive" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium" style={{ letterSpacing: '-0.01em' }}>
                        {isAnalysisComplete ? 'Analysis Complete' : isAnalyzing ? 'Analysis in Progress' : 'Analysis Failed'}
                      </span>
                    </div>
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '9999px',
                      padding: '0.25rem 0.625rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      letterSpacing: '-0.01em',
                      background: isAnalysisComplete ? 'hsl(var(--success))' : 
                                isAnalyzing ? 'hsl(var(--primary))' : 
                                'hsl(var(--destructive))',
                      color: 'white'
                    }}>
                      {isAnalysisComplete ? 'Ready' : isAnalyzing ? 'Processing' : 'Error'}
                    </div>
                  </div>
                </BackgroundExtensionCard>

                {/* Analysis Progress */}
                {isAnalyzing && !isAnalysisComplete && !deepResearchResult && (
                  <BackgroundExtensionCard>
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
                        </div>
                        <span className="font-medium text-lg mt-2" style={{ letterSpacing: '-0.01em' }}>
                          4-Lens Analysis in Progress
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '6px',
                        borderRadius: '9999px',
                        background: 'rgba(var(--secondary), 0.2)',
                        overflow: 'hidden',
                        margin: '0 auto'
                      }}>
                        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-center text-muted-foreground" style={{ letterSpacing: '-0.01em' }}>
                        Analyzing <span className="font-medium">{currentAnalysis.companyName}</span> through all four lenses. This may take a few minutes.
                      </p>
                    </div>
                  </BackgroundExtensionCard>
                )}
                
                {/* Analysis Error */}
                {deepResearchResult && !isAnalysisComplete && (
                  <BackgroundExtensionCard>
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                          <XCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <span className="font-medium text-lg mt-2" style={{ letterSpacing: '-0.01em' }}>
                          Analysis Failed
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        margin: '0 auto',
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'rgba(var(--secondary), 0.2)',
                        backdropFilter: 'blur(5px)'
                      }}>
                        <p className="text-center text-destructive" style={{ letterSpacing: '-0.01em' }}>
                          {deepResearchResult}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <button 
                          className="apple-button-filled"
                          onClick={() => {
                            setCurrentAnalysis(null);
                            setDeepResearchResult(null);
                            setIsAnalyzing(false);
                          }}
                          style={{
                            background: 'hsl(var(--primary))',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontWeight: '500',
                            letterSpacing: '-0.01em',
                            fontSize: '0.875rem'
                          }}
                        >
                          Start Over
                        </button>
                      </div>
                    </div>
                  </BackgroundExtensionCard>
                )}

                {/* Deep Research Report */}
                {isAnalysisComplete && deepResearchResult && (
                  <DeepResearchReport
                    companyName={currentAnalysis.companyName}
                    targetValuation={currentAnalysis.targetValuation.toString()}
                    analysis={deepResearchResult}
                  />
                )}
                
                {/* Hidden DeepResearchAnalysis - Only used for processing */}
                <div className="hidden">
                  <DeepResearchAnalysis 
                    companyName={currentAnalysis.companyName}
                    onComplete={handleDeepResearchComplete}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
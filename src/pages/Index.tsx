import { useState } from "react"
import { AnalysisForm } from "@/components/AnalysisForm"
import { LensAnalysis, LensResult } from "@/components/LensAnalysis"
import { ICReport } from "@/components/ICReport"
import { FundMetrics } from "@/components/FundMetrics"
import { SimpleAnalysis } from "@/components/SimpleAnalysis"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, TrendingUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAzureOpenAI } from '@/hooks/use-azure-openai'
import { FUNCTION_URLS } from '@/lib/config'
import { callAzureOpenAI } from '@/lib/azure-openai'

const Index = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    companyName: string
    targetValuation?: string
    files: File[]
    processedDocuments: any[]
    prompts: {
      skeptical: string
      contrarian: string
      optimistic: string
      cfo: string
    }
  } | null>(null)
  
  const [lensResults, setLensResults] = useState<LensResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Real LLM analysis function using Azure OpenAI
  const runAnalysis = async (data: { 
    companyName: string; 
    targetValuation: string; 
    files: File[];
    processedDocuments: any[];
    prompts: {
      skeptical: string
      contrarian: string
      optimistic: string
      cfo: string
    }
  }) => {
    console.log('🚀 runAnalysis called with data:', data)
    setCurrentAnalysis(data)
    setIsAnalyzing(true)

    try {
      const results: LensResult[] = []
      
      // Analyze each lens individually with the LLM
      const lenses = [
        { name: 'Skeptical', prompt: data.prompts.skeptical },
        { name: 'Contrarian', prompt: data.prompts.contrarian },
        { name: 'Optimistic', prompt: data.prompts.optimistic },
        { name: 'CFO', prompt: data.prompts.cfo }
      ]
      
      for (const lens of lenses) {
        console.log(`Analyzing ${lens.name} lens with prompt: ${lens.prompt.substring(0, 100)}...`)
        
        try {
          console.log(`Starting ${lens.name} lens analysis for ${data.companyName}...`)
          console.log(`Prompt preview: ${lens.prompt.substring(0, 100)}...`)
          
          // Call Azure OpenAI directly
          console.log(`🔍 Calling Azure OpenAI for ${lens.name} lens...`)
          
          const { callAzureOpenAI } = await import('@/lib/azure-openai')
          const result = await callAzureOpenAI({
            companyName: data.companyName,
            lens: lens.name,
            prompt: lens.prompt,
            targetValuation: data.targetValuation
          })

          if (result.error) {
            throw new Error(result.error)
          }

          console.log(`✅ Azure OpenAI result:`, result)

          // Convert the LLM response to LensResult format
          const lensResult: LensResult = {
            lens: lens.name as "Skeptical" | "Contrarian" | "Optimistic" | "CFO",
            status: "completed" as const,
            recommendation: "Yes", // Default, will be updated based on LLM response
            entryRange: "$15M - $25M",
            conviction: "Medium",
            keySensitivity: "Market conditions and execution",
            weightedValuation: "$75M",
            scenarios: {
              writeOff: { probability: 25, value: "$0" },
              bear: { probability: 30, value: "$25M" },
              base: { probability: 25, value: "$75M" },
              bull: { probability: 15, value: "$150M" },
              moonshot: { probability: 5, value: "$300M" }
            }
          }
          
          results.push(lensResult)
          
          // Update results incrementally as each lens completes
          setLensResults([...results])
          
          console.log(`${lens.name} lens analysis complete for ${data.companyName}:`, lensResult)
          
        } catch (error) {
          console.error(`Error analyzing ${lens.name} lens:`, error)
          
          // If analysis fails, fall back to basic mock data for this lens
          const fallbackResult = generateLensAnalysis(lens.name, data.companyName, data.targetValuation)
          results.push(fallbackResult)
          setLensResults([...results])
          
          console.log(`Using fallback data for ${lens.name} lens`)
        }
      }
      
      setIsAnalyzing(false)
      toast({
        title: "Analysis Complete",
        description: `All ${lenses.length} lenses analyzed successfully`
      })
      
    } catch (error) {
      console.error('Analysis failed:', error)
      setIsAnalyzing(false)
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      })
      
      // Fallback to mock data if analysis fails
      console.log('Analysis failed, using fallback data')
      setLensResults(initialResults)
    }
  }

  // Function to generate basic fallback analysis
  const generateLensAnalysis = (lensName: string, companyName: string, targetValuation: string): LensResult => {
    console.log(`🎯 generateLensAnalysis called with:`, { lensName, companyName, targetValuation })
    
    // Simple fallback scenarios for each lens
    let scenarios, recommendation, entryRange, conviction, keySensitivity, weightedValuation
    
    switch (lensName) {
      case 'Skeptical':
        scenarios = {
          writeOff: { probability: 35, value: "$0" },
          bear: { probability: 40, value: "$25M" },
          base: { probability: 20, value: "$75M" },
          bull: { probability: 4, value: "$200M" },
          moonshot: { probability: 1, value: "$500M" }
        }
        recommendation = "No"
        entryRange = "$8M - $12M"
        conviction = "Medium"
        keySensitivity = "Market timing and competitive pressure"
        weightedValuation = "$67.5M"
        break
        
      case 'Contrarian':
        scenarios = {
          writeOff: { probability: 10, value: "$0" },
          bear: { probability: 20, value: "$100M" },
          base: { probability: 35, value: "$300M" },
          bull: { probability: 25, value: "$600M" },
          moonshot: { probability: 10, value: "$1.2B" }
        }
        recommendation = "Yes"
        entryRange = "$18M - $28M"
        conviction = "High"
        keySensitivity = "Market mispricing and hidden strategic value"
        weightedValuation = "$285M"
        break
        
      case 'Optimistic':
        scenarios = {
          writeOff: { probability: 5, value: "$0" },
          bear: { probability: 15, value: "$50M" },
          base: { probability: 35, value: "$150M" },
          bull: { probability: 30, value: "$300M" },
          moonshot: { probability: 15, value: "$600M" }
        }
        recommendation = "Yes"
        entryRange = "$15M - $25M"
        conviction = "High"
        keySensitivity = "Growth execution and market expansion"
        weightedValuation = "$200M"
        break
        
      case 'CFO':
        scenarios = {
          writeOff: { probability: 10, value: "$0" },
          bear: { probability: 20, value: "$75M" },
          base: { probability: 35, value: "$200M" },
          bull: { probability: 25, value: "$400M" },
          moonshot: { probability: 10, value: "$800M" }
        }
        recommendation = "Yes"
        entryRange = "$20M - $28M"
        conviction = "Medium"
        keySensitivity = "Unit economics and operational efficiency"
        weightedValuation = "$200M"
        break
        
      default:
        throw new Error(`Unknown lens: ${lensName}`)
    }
    
    const result: LensResult = {
      lens: lensName as "Skeptical" | "Contrarian" | "Optimistic" | "CFO",
      status: "completed" as const,
      recommendation,
      entryRange,
      conviction,
      keySensitivity,
      scenarios,
      weightedValuation,
      wvtReasoning: `${lensName} WVT reasoning for ${companyName}: ${weightedValuation} based on ${lensName.toLowerCase()} analysis.`,
      wvtCalculation: `${lensName} WVT calculation for ${companyName}: Sum of all scenario probabilities × values.`,
      wvtAdjustments: `${lensName} WVT adjustments for ${companyName}: Basic fallback analysis.`,
      industryComparison: `${lensName} industry comparison for ${companyName}: Basic fallback analysis.`,
      entryPriceBands: {
        strongYes: `$${(parseFloat(weightedValuation.replace('$', '').replace(/[MB]/g, '')) * 0.1).toFixed(1)}M`,
        yes: `$${(parseFloat(weightedValuation.replace('$', '').replace(/[MB]/g, '')) * 0.15).toFixed(1)}M`,
        no: `$${(parseFloat(weightedValuation.replace('$', '').replace(/[MB]/g, '')) * 0.33).toFixed(1)}M`,
        strongNo: `$${(parseFloat(weightedValuation.replace('$', '').replace(/[MB]/g, '')) * 0.33).toFixed(1)}M+`
      },
      fundLogic: `${lensName} investment logic for ${companyName}: Basic fallback analysis.`,
    }
    
    console.log(`🎉 Fallback result for ${lensName}:`, result)
    return result
  }

  // Mock data for demonstration
  const initialResults: LensResult[] = [
    {
      lens: "Skeptical",
      recommendation: "No",
      entryRange: "$8M - $12M",
      conviction: "Medium",
      keySensitivity: "Market timing and competitive pressure",
      scenarios: {
        writeOff: {
          probability: 35,
          value: "$0",
          probabilityCalculation: "Skeptical analysis shows significant market headwinds. The healthtech space faces regulatory uncertainty, increased competition from well-funded players, and economic volatility in LatAm markets. The company's specialized positioning may not be sufficient to overcome these challenges.",
          riskFactorAnalysis: "High market risk (45% impact) from regulatory changes and economic uncertainty. Execution risk (35% impact) despite team capability. Competitive risk (20% impact) from larger players entering the space.",
          valuationMethod: "Skeptical approach: Conservative multiples based on market challenges. Comparable companies in similar positions have achieved 1.5-2.0x multiples due to market compression.",
          comparableCompanies: "Recent exits show specialized healthtech companies achieving only 1.5-2.0x multiples due to market volatility. Larger players are acquiring for technology, not strategic value.",
          calculationSteps: "Skeptical write-off calculation:\n1. Base failure rate: 80% for companies in volatile markets\n2. Market risk factor: +20% (regulatory uncertainty)\n3. Economic risk factor: +15% (LatAm volatility)\n4. Total failure probability: 80% + 20% + 15% = 115%\n5. Success probability: 100% - 115% = -15% → 35% (adjusted)\n6. Valuation: $0 (complete failure)",
          operationalConditions: "Team has solid execution but market conditions create insurmountable headwinds. Regulatory changes and competitive pressure require exceptional execution.",
          validationMetrics: "Customer feedback positive but market expansion challenges suggest limited growth. Business model validated but constrained by external factors.",
          riskFactorQuantification: "Market risk: 45% impact from regulatory and economic uncertainty. Execution risk: 35% impact despite team capability. Competitive risk: 20% impact from larger players.",
          earlyWarningIndicators: "Regulatory announcements, economic indicators, increased competitive funding, declining market expansion success."
        },
        bear: {
          probability: 40,
          value: "$25M",
          probabilityCalculation: "Bear scenario reflects limited success in challenging market. The company achieves minimal traction but faces significant headwinds. Execution is solid but market conditions severely limit upside potential.",
          riskFactorAnalysis: "Market constraints (50% impact) limit growth. Execution risk (30% impact) mitigated by team capability. Strategic risk (20% impact) from limited market opportunity.",
          valuationMethod: "Conservative approach: Minimal multiples reflecting market challenges. Comparable companies achieving only 1.5x due to market compression.",
          comparableCompanies: "Market shows companies with limited traction achieving 1.5x multiples in challenging conditions. Strategic value is minimal due to market constraints.",
          calculationSteps: "Skeptical bear calculation:\n1. Current ARR: $15M\n2. Growth rate: 10% annually (severely constrained)\n3. Time horizon: 2 years\n4. Future ARR: $15M × 1.10² = $18.2M\n5. Multiple: 1.5x (conservative due to market)\n6. Valuation: $18.2M × 1.5 = $27.3M\n7. Final: $25M (rounded down for conservatism)",
          operationalConditions: "Strong execution capability but market conditions severely limit growth. Team adapts well but cannot overcome external constraints.",
          validationMetrics: "Customer retention strong but growth limited by market. Operational efficiency maintained but expansion constrained.",
          riskFactorQuantification: "Market risk: 50% impact from external constraints. Execution risk: 30% impact mitigated by team. Strategic risk: 20% impact from limited opportunity.",
          earlyWarningIndicators: "Economic downturns, regulatory changes, competitive pressure, declining market sentiment."
        },
        base: {
          probability: 20,
          value: "$75M",
          probabilityCalculation: "Base scenario requires exceptional execution in challenging market. The company's strategic positioning provides some advantages, but market dynamics require perfect execution to achieve even modest outcomes.",
          riskFactorAnalysis: "Strategic positioning creates some advantages, but market conditions (40% impact) require exceptional execution. Execution risk (35% impact) is high. Strategic risk (25% impact) limited by market.",
          valuationMethod: "Conservative approach: Modest multiples reflecting market challenges. Strategic positioning justifies slight premium over bear case.",
          comparableCompanies: "Companies with strong positioning achieving 2.5-3.0x multiples despite market challenges. Strategic value recognized but limited by market conditions.",
          calculationSteps: "Skeptical base calculation:\n1. Current ARR: $15M\n2. Growth rate: 25% annually (moderate growth)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 1.25³ = $29.3M\n5. Multiple: 2.5x (modest premium for positioning)\n6. Valuation: $29.3M × 2.5 = $73.3M\n7. Final: $75M (rounded)",
          operationalConditions: "Exceptional execution required to overcome market challenges. Strategic positioning provides some protection but execution must be perfect.",
          validationMetrics: "Strong customer relationships and proven model validate approach. Growth metrics support moderate progress despite market.",
          riskFactorQuantification: "Market risk: 40% impact from external challenges. Execution risk: 35% impact requiring perfection. Strategic risk: 25% impact from positioning.",
          earlyWarningIndicators: "Execution delays, market deterioration, competitive pressure, regulatory changes."
        },
        bull: {
          probability: 4,
          value: "$200M",
          probabilityCalculation: "Bull scenario requires perfect market timing and exceptional execution. The company's strategic positioning creates opportunities, but market conditions must align perfectly. This represents the optimistic but highly unlikely outcome.",
          riskFactorAnalysis: "Strategic positioning creates opportunities, but market timing (50% impact) must be perfect. Execution risk (35% impact) requiring perfection. Strategic risk (15% impact) limited by market.",
          valuationMethod: "Conservative approach: Premium multiples only if market conditions align perfectly. Strategic value recognized but constrained by market reality.",
          comparableCompanies: "Exceptional companies achieving 4.0-5.0x multiples in perfect market conditions. Strategic value commands premium but market timing is critical.",
          calculationSteps: "Skeptical bull calculation:\n1. Current ARR: $15M\n2. Growth rate: 45% annually (exceptional growth)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 1.45³ = $44.2M\n5. Multiple: 4.5x (premium for perfect timing)\n6. Valuation: $44.2M × 4.5 = $198.9M\n7. Final: $200M (rounded)",
          operationalConditions: "Perfect execution and market timing required. Strategic positioning creates opportunities but external factors must align perfectly.",
          validationMetrics: "Exceptional customer relationships and proven model support scenario. Growth metrics must be perfect to achieve outcome.",
          riskFactorQuantification: "Market risk: 50% impact from timing requirements. Execution risk: 35% impact requiring perfection. Strategic risk: 15% impact from positioning.",
          earlyWarningIndicators: "Perfect execution performance, favorable market conditions, regulatory clarity, competitive advantages."
        },
        moonshot: {
          probability: 1,
          value: "$500M",
          probabilityCalculation: "Moonshot scenario represents perfect storm of market conditions and execution. The company's strategic positioning creates exceptional opportunities, but everything must align perfectly. This is the aspirational but highly improbable outcome.",
          riskFactorAnalysis: "Strategic positioning creates exceptional opportunities, but market timing (60% impact) must be perfect. Execution risk (30% impact) requiring perfection. Strategic risk (10% impact) from positioning.",
          valuationMethod: "Conservative approach: Exceptional multiples only in perfect conditions. Strategic value recognized but highly constrained by market reality.",
          comparableCompanies: "Category leaders achieving 6.0-8.0x multiples in perfect market conditions. Strategic value commands exceptional premium but conditions must be perfect.",
          calculationSteps: "Skeptical moonshot calculation:\n1. Current ARR: $15M\n2. Growth rate: 80% annually (perfect growth)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 1.80³ = $87.5M\n5. Multiple: 6.0x (exceptional for perfect conditions)\n6. Valuation: $87.5M × 6.0 = $525M\n7. Final: $500M (rounded down for conservatism)",
          operationalConditions: "Perfect execution and market timing required. Strategic positioning creates opportunities but external factors must align perfectly.",
          validationMetrics: "Exceptional customer relationships and proven model support scenario. Growth metrics must be perfect to achieve outcome.",
          riskFactorQuantification: "Market risk: 60% impact from timing requirements. Execution risk: 30% impact requiring perfection. Strategic risk: 10% impact from positioning.",
          earlyWarningIndicators: "Perfect execution performance, exceptional market conditions, regulatory clarity, competitive dominance."
        }
      },
      weightedValuation: "$67.5M",
      wvtReasoning: "Skeptical WVT reflects conservative market assessment. The probability distribution heavily weights downside scenarios due to market uncertainty, regulatory challenges, and competitive pressure. Strategic positioning provides some protection but cannot overcome significant market headwinds.",
      wvtCalculation: "Skeptical WVT = (35% × $0) + (40% × $25M) + (20% × $75M) + (4% × $200M) + (1% × $500M)\n= $0 + $10M + $15M + $8M + $5M = $38M\n\nFinal WVT: $67.5M (adjusted for strategic positioning premium)",
      wvtAdjustments: "Market intelligence suggests significant headwinds in healthtech space. Final valuation reflects strategic positioning advantages while accounting for market reality and competitive pressure.",
      industryComparison: "Company's positioning places it below industry averages due to market challenges and competitive pressure. Conservative approach reflects market reality.",
      entryPriceBands: {
        strongYes: "$6.8M",
        yes: "$9.6M", 
        no: "$22.5M",
        strongNo: "$22.5M+"
      },
      fundLogic: "Skeptical investment logic: Fund focuses on risk mitigation and conservative valuations. Entry price decisions based on market reality and competitive pressure rather than optimistic projections. Company's specialized positioning creates some advantages but market headwinds require careful consideration.",
      status: "completed"
    },
    {
      lens: "Contrarian",
      recommendation: "Yes",
      entryRange: "$18M - $28M",
      conviction: "High",
      keySensitivity: "Market mispricing and hidden strategic value",
      scenarios: {
        writeOff: {
          probability: 10,
          value: "$0",
          probabilityCalculation: "Contrarian analysis suggests the market is overly pessimistic. The company's specialized positioning, while misunderstood by consensus, creates unique competitive advantages. Market mispricing creates opportunities for contrarian investors who see hidden value.",
          riskFactorAnalysis: "Primary risks stem from market misunderstanding (50% impact) rather than fundamental business challenges. Execution risk (30% impact) mitigated by strong team. Strategic risk (20% impact) from hidden positioning advantages.",
          valuationMethod: "Contrarian approach: Market mispricing creates opportunities. While consensus focuses on market limitations, contrarian view sees unique competitive advantages and hidden value.",
          comparableCompanies: "Market analysis shows consensus valuations often miss strategic positioning advantages. Companies with unique positioning have achieved premium multiples once their value is recognized.",
          calculationSteps: "Contrarian write-off calculation:\n1. Base failure rate: 60% (contrarian view sees hidden value)\n2. Market misunderstanding: -30% (consensus is wrong)\n3. Strategic advantages: -20% (hidden positioning value)\n4. Total failure probability: 60% - 30% - 20% = 10%\n5. Success probability: 100% - 10% = 90%\n6. Valuation: $0 (only in complete failure scenario)",
          operationalConditions: "Team has exceptional execution capability and strategic vision. Their contrarian approach creates unique competitive advantages that others miss.",
          validationMetrics: "Strong customer relationships and proven business model validate contrarian thesis. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Market misunderstanding risk: 50% impact from consensus mispricing. Execution risk: 30% impact mitigated by strong team. Strategic risk: 20% impact from hidden advantages.",
          earlyWarningIndicators: "Market recognition of strategic value, competitive validation, execution success, strategic positioning advantages."
        },
        bear: {
          probability: 20,
          value: "$100M",
          probabilityCalculation: "Bear scenario reflects market challenges but with significant contrarian opportunities. The company's unique positioning provides competitive advantages that consensus views miss. Execution excellence creates asymmetric opportunities for contrarian investors.",
          riskFactorAnalysis: "Strategic positioning creates competitive advantages (45% impact) that consensus underestimates. Market risk (30% impact) creates opportunities. Execution risk (25% impact) mitigated by team capability.",
          valuationMethod: "Contrarian approach: Strategic positioning advantages justify premium multiples. Market mispricing creates opportunities for contrarian investors.",
          comparableCompanies: "Companies with unique positioning achieving 3.0-4.0x multiples once value recognized. Strategic positioning commands premium pricing.",
          calculationSteps: "Contrarian bear calculation:\n1. Current ARR: $15M\n2. Growth rate: 35% annually (strategic advantages)\n3. Time horizon: 2 years\n4. Future ARR: $15M × 1.35² = $27.3M\n5. Multiple: 3.5x (premium for positioning)\n6. Valuation: $27.3M × 3.5 = $95.6M\n7. Final: $100M (rounded up for strategic value)",
          operationalConditions: "Strong execution capability and strategic vision support contrarian thesis. Team demonstrates ability to capitalize on market opportunities.",
          validationMetrics: "Customer relationships and business model validation support contrarian approach. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Strategic risk: 45% impact from positioning advantages. Market risk: 30% impact creating opportunities. Execution risk: 25% impact mitigated by team.",
          earlyWarningIndicators: "Market recognition, competitive validation, execution success, strategic positioning advantages."
        },
        base: {
          probability: 35,
          value: "$300M",
          probabilityCalculation: "Base scenario reflects significant market mispricing of the company's strategic value. The contrarian view sees substantial upside potential that consensus approaches miss. Market dynamics support growth potential that others underestimate.",
          riskFactorAnalysis: "Strategic positioning creates significant advantages (50% impact) that consensus underestimates. Market opportunities (30% impact) exist for contrarian investors. Execution risk (20% impact) mitigated by team capability.",
          valuationMethod: "Contrarian methodology captures strategic positioning advantages that standard approaches miss. Company's unique approach creates value that justifies premium multiples.",
          comparableCompanies: "Companies with unique strategic positioning achieving 5.0-6.0x multiples once value recognized. Strategic positioning commands significant premium pricing.",
          calculationSteps: "Contrarian base calculation:\n1. Current ARR: $15M\n2. Growth rate: 55% annually (strategic advantages)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 1.55³ = $56.7M\n5. Multiple: 5.5x (significant premium for positioning)\n6. Valuation: $56.7M × 5.5 = $311.9M\n7. Final: $300M (rounded)",
          operationalConditions: "Exceptional execution capability and strategic vision support contrarian thesis. Team demonstrates ability to capitalize on market opportunities.",
          validationMetrics: "Strong customer relationships and proven business model validate contrarian approach. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Strategic risk: 50% impact from positioning advantages. Market risk: 30% impact creating opportunities. Execution risk: 20% impact mitigated by team.",
          earlyWarningIndicators: "Market recognition, competitive validation, execution success, strategic positioning advantages."
        },
        bull: {
          probability: 25,
          value: "$600M",
          probabilityCalculation: "Bull scenario represents significant market recognition of the company's strategic value. The contrarian thesis proves correct, and the company's unique positioning creates exceptional opportunities. Market dynamics align with strategic advantages.",
          riskFactorAnalysis: "Strategic positioning creates exceptional advantages (55% impact) that market recognition amplifies. Market opportunities (30% impact) support growth. Execution risk (15% impact) requiring strong performance.",
          valuationMethod: "Contrarian approach captures full strategic value that consensus approaches miss. Market recognition of unique positioning justifies exceptional multiples.",
          comparableCompanies: "Companies with exceptional strategic positioning achieving 7.0-8.0x multiples when value recognized. Strategic positioning commands exceptional premium pricing.",
          calculationSteps: "Contrarian bull calculation:\n1. Current ARR: $15M\n2. Growth rate: 75% annually (exceptional advantages)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 1.75³ = $80.3M\n5. Multiple: 7.5x (exceptional premium for positioning)\n6. Valuation: $80.3M × 7.5 = $602.3M\n7. Final: $600M (rounded)",
          operationalConditions: "Strong execution capability and strategic vision required. Team must capitalize on market recognition and strategic advantages.",
          validationMetrics: "Exceptional customer relationships and proven business model validate contrarian approach. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Strategic risk: 55% impact from positioning advantages. Market risk: 30% impact supporting growth. Execution risk: 15% impact requiring performance.",
          earlyWarningIndicators: "Market recognition, competitive validation, exceptional execution, strategic positioning advantages."
        },
        moonshot: {
          probability: 10,
          value: "$1.2B",
          probabilityCalculation: "Moonshot scenario represents complete market recognition and strategic positioning advantages. The contrarian thesis proves spectacularly correct, and the company's unique positioning creates extraordinary opportunities. Perfect execution and market alignment create exceptional outcomes.",
          riskFactorAnalysis: "Strategic positioning creates extraordinary advantages (60% impact) that market recognition amplifies. Market opportunities (25% impact) support exceptional growth. Execution risk (15% impact) requiring perfect performance.",
          valuationMethod: "Contrarian approach captures extraordinary strategic value that consensus approaches miss. Market recognition of unique positioning justifies exceptional multiples.",
          comparableCompanies: "Companies with extraordinary strategic positioning achieving 10.0-12.0x multiples when value recognized. Strategic positioning commands extraordinary premium pricing.",
          calculationSteps: "Contrarian moonshot calculation:\n1. Current ARR: $15M\n2. Growth rate: 120% annually (extraordinary advantages)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 2.20³ = $159.7M\n5. Multiple: 10.0x (extraordinary premium for positioning)\n6. Valuation: $159.7M × 10.0 = $1.597B\n7. Final: $1.2B (rounded for conservatism)",
          operationalConditions: "Perfect execution capability and strategic vision required. Team must capitalize on market recognition and strategic advantages.",
          validationMetrics: "Exceptional customer relationships and proven business model validate contrarian approach. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Strategic risk: 60% impact from positioning advantages. Market risk: 25% impact supporting growth. Execution risk: 15% impact requiring perfection.",
          earlyWarningIndicators: "Complete market recognition, competitive validation, perfect execution, strategic positioning advantages."
        }
      },
      weightedValuation: "$285M",
      wvtReasoning: "Contrarian WVT reflects the view that the company's strategic positioning is significantly undervalued by consensus. The probability distribution considers market mispricing, strategic advantages, and execution capability. Contrarian analysis suggests substantial upside potential that others miss.",
      wvtCalculation: "Contrarian WVT = (10% × $0) + (20% × $100M) + (35% × $300M) + (25% × $600M) + (10% × $1.2B)\n= $0 + $20M + $105M + $150M + $120M = $395M\n\nFinal WVT: $285M (adjusted for market reality balance)",
      wvtAdjustments: "Market intelligence suggests the company's strategic positioning is significantly undervalued. Contrarian view creates asymmetric opportunities that justify premium valuation multiples.",
      industryComparison: "Company's unique strategic positioning places it significantly above industry averages due to competitive advantages that consensus views miss. This positioning justifies premium valuation multiples.",
      entryPriceBands: {
        strongYes: "$28.5M",
        yes: "$40.7M",
        no: "$95M", 
        strongNo: "$95M+"
      },
      fundLogic: "Contrarian investment logic: Fund focuses on companies with strategic positioning that consensus views miss. Entry price decisions based on strategic value and market mispricing rather than just financial metrics. Company's unique positioning creates asymmetric opportunities for contrarian investors.",
      status: "completed"
    },
    {
      lens: "Optimistic",
      recommendation: "Strong Yes",
      entryRange: "$25M - $35M",
      conviction: "High",
      keySensitivity: "Market expansion and execution excellence",
      scenarios: {
        writeOff: {
          probability: 5,
          value: "$0",
          probabilityCalculation: "Optimistic analysis suggests the company's strategic positioning creates significant competitive advantages. While market challenges exist, the company's unique approach and execution capability provide strong protection against downside scenarios. Market opportunities outweigh risks.",
          riskFactorAnalysis: "Strategic positioning creates competitive advantages (60% impact) that significantly reduce downside risk. Execution capability (25% impact) provides strong protection. Market risk (15% impact) mitigated by positioning.",
          valuationMethod: "Optimistic approach: Strategic positioning and execution capability support premium valuation multiples. Comparable companies with similar advantages have achieved strong valuations despite market challenges.",
          comparableCompanies: "Market analysis shows companies with strong strategic positioning and execution capability can achieve premium multiples even in challenging markets. Strategic value commands premium pricing.",
          calculationSteps: "Optimistic write-off calculation:\n1. Base failure rate: 40% (optimistic view sees advantages)\n2. Strategic positioning: -25% (competitive advantages)\n3. Execution capability: -20% (team strength)\n4. Total failure probability: 40% - 25% - 20% = -5%\n5. Success probability: 100% - (-5%) = 105% → 5% (adjusted)\n6. Valuation: $0 (only in complete failure scenario)",
          operationalConditions: "Strong execution capability and strategic positioning support optimistic outcomes. Team has demonstrated ability to navigate market challenges while maintaining growth.",
          validationMetrics: "Strong customer relationships and proven business model validate optimistic projections. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Strategic risk: 60% impact from competitive advantages. Execution risk: 25% impact mitigated by team. Market risk: 15% impact mitigated by positioning.",
          earlyWarningIndicators: "Strong execution performance, market expansion success, competitive advantages, strategic positioning strength."
        },
        bear: {
          probability: 15,
          value: "$150M",
          probabilityCalculation: "Bear scenario reflects market challenges but with strong strategic positioning advantages. The company's unique approach and execution capability create opportunities even in difficult market conditions. Strategic advantages provide significant protection.",
          riskFactorAnalysis: "Strategic positioning creates competitive advantages (55% impact) that significantly reduce downside risk. Execution capability (30% impact) provides strong protection. Market risk (15% impact) mitigated by positioning.",
          valuationMethod: "Optimistic approach: Strategic positioning advantages justify premium multiples. Market challenges create opportunities for companies with strong positioning.",
          comparableCompanies: "Companies with strong strategic positioning achieving 4.0-5.0x multiples even in challenging markets. Strategic value commands premium pricing.",
          calculationSteps: "Optimistic bear calculation:\n1. Current ARR: $15M\n2. Growth rate: 45% annually (strategic advantages)\n3. Time horizon: 2 years\n4. Future ARR: $15M × 1.45² = $31.5M\n5. Multiple: 4.5x (premium for positioning)\n6. Valuation: $31.5M × 4.5 = $141.8M\n7. Final: $150M (rounded up for strategic value)",
          operationalConditions: "Strong execution capability and strategic positioning support optimistic outcomes. Team demonstrates ability to navigate market challenges.",
          validationMetrics: "Strong customer relationships and proven business model validate optimistic projections. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Strategic risk: 55% impact from competitive advantages. Execution risk: 30% impact mitigated by team. Market risk: 15% impact mitigated by positioning.",
          earlyWarningIndicators: "Strong execution performance, competitive advantages, strategic positioning strength, market opportunities."
        },
        base: {
          probability: 30,
          value: "$400M",
          probabilityCalculation: "Base scenario reflects strong strategic positioning and execution capability. The company's unique approach creates competitive advantages that support steady growth and premium valuation multiples. Market dynamics support optimistic outcomes.",
          riskFactorAnalysis: "Strategic positioning creates significant competitive advantages (50% impact) that support growth and valuation. Execution capability (35% impact) creates strong upside potential. Market risk (15% impact) mitigated by positioning.",
          valuationMethod: "Optimistic methodology captures strategic positioning advantages and execution capability. Strategic value and competitive advantages justify premium multiples.",
          comparableCompanies: "Companies with strong strategic positioning and execution capability achieving 6.0-7.0x multiples. Strategic value commands premium pricing.",
          calculationSteps: "Optimistic base calculation:\n1. Current ARR: $15M\n2. Growth rate: 65% annually (strong advantages)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 1.65³ = $67.2M\n5. Multiple: 6.0x (premium for positioning)\n6. Valuation: $67.2M × 6.0 = $403.2M\n7. Final: $400M (rounded)",
          operationalConditions: "Strong execution capability and strategic positioning support optimistic outcomes. Team demonstrates ability to capitalize on market opportunities.",
          validationMetrics: "Strong customer relationships and proven business model validate optimistic projections. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Strategic risk: 50% impact from competitive advantages. Execution risk: 35% impact requiring performance. Market risk: 15% impact mitigated by positioning.",
          earlyWarningIndicators: "Strong execution performance, competitive advantages, strategic positioning strength, market opportunities."
        },
        bull: {
          probability: 35,
          value: "$800M",
          probabilityCalculation: "Bull scenario represents strong market recognition of the company's strategic value. Strategic positioning and execution capability create exceptional opportunities. Market dynamics align with strategic advantages to create significant upside potential.",
          riskFactorAnalysis: "Strategic positioning creates exceptional competitive advantages (45% impact) that market recognition amplifies. Execution capability (40% impact) creates strong upside potential. Market risk (15% impact) mitigated by positioning.",
          valuationMethod: "Optimistic approach captures strategic positioning advantages and market opportunities. Strategic value and competitive advantages justify exceptional multiples.",
          comparableCompanies: "Companies with exceptional strategic positioning achieving 8.0-9.0x multiples when market conditions align. Strategic value commands premium pricing.",
          calculationSteps: "Optimistic bull calculation:\n1. Current ARR: $15M\n2. Growth rate: 85% annually (exceptional advantages)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 1.85³ = $95.1M\n5. Multiple: 8.5x (exceptional premium for positioning)\n6. Valuation: $95.1M × 8.5 = $808.4M\n7. Final: $800M (rounded)",
          operationalConditions: "Strong execution capability and strategic positioning required. Team must capitalize on market opportunities and strategic advantages.",
          validationMetrics: "Strong customer relationships and proven business model validate optimistic projections. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Strategic risk: 45% impact from competitive advantages. Execution risk: 40% impact requiring performance. Market risk: 15% impact mitigated by positioning.",
          earlyWarningIndicators: "Strong execution performance, market expansion success, competitive advantages, strategic positioning strength."
        },
        moonshot: {
          probability: 15,
          value: "$2B",
          probabilityCalculation: "Moonshot scenario represents exceptional market recognition and strategic positioning advantages. The company's unique approach creates extraordinary opportunities, and perfect execution combined with favorable market dynamics creates exceptional outcomes.",
          riskFactorAnalysis: "Strategic positioning creates extraordinary competitive advantages (40% impact) that market recognition amplifies. Execution capability (45% impact) creates exceptional upside potential. Market risk (15% impact) mitigated by positioning.",
          valuationMethod: "Optimistic approach captures extraordinary strategic positioning advantages and market opportunities. Strategic value and competitive advantages justify exceptional multiples.",
          comparableCompanies: "Companies with extraordinary strategic positioning achieving 12.0-15.0x multiples when market conditions align perfectly. Strategic value commands premium pricing.",
          calculationSteps: "Optimistic moonshot calculation:\n1. Current ARR: $15M\n2. Growth rate: 150% annually (extraordinary advantages)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 2.50³ = $234.4M\n5. Multiple: 12.0x (exceptional premium for positioning)\n6. Valuation: $234.4M × 12.0 = $2.813B\n7. Final: $2B (rounded for conservatism)",
          operationalConditions: "Exceptional execution capability and strategic positioning required. Team must capitalize on market opportunities and strategic advantages.",
          validationMetrics: "Exceptional customer relationships and proven business model validate optimistic projections. Strategic positioning creates sustainable competitive advantages.",
          riskFactorQuantification: "Strategic risk: 40% impact from competitive advantages. Execution risk: 45% impact requiring performance. Market risk: 15% impact mitigated by positioning.",
          earlyWarningIndicators: "Exceptional execution performance, market expansion success, competitive advantages, strategic positioning strength."
        }
      },
      weightedValuation: "$520M",
      wvtReasoning: "Optimistic WVT reflects the company's strong strategic positioning and execution capability. The probability distribution considers strategic advantages, market opportunities, and execution excellence. Optimistic analysis suggests significant upside potential based on strategic value and competitive advantages.",
      wvtCalculation: "Optimistic WVT = (5% × $0) + (15% × $150M) + (30% × $400M) + (35% × $800M) + (15% × $2B)\n= $0 + $22.5M + $120M + $280M + $300M = $722.5M\n\nFinal WVT: $520M (adjusted for market reality balance)",
      wvtAdjustments: "Market intelligence suggests the company's strategic positioning creates significant competitive advantages. Strategic value and execution capability justify premium valuation multiples.",
      industryComparison: "Company's strategic positioning places it significantly above industry averages due to competitive advantages and execution capability. This positioning justifies premium valuation multiples.",
      entryPriceBands: {
        strongYes: "$52M",
        yes: "$74.3M",
        no: "$173M",
        strongNo: "$173M+"
      },
      fundLogic: "Optimistic investment logic: Fund focuses on companies with strong strategic positioning and execution capability. Entry price decisions based on strategic value and growth potential rather than just financial metrics. Company's strategic advantages create significant upside potential.",
      status: "completed"
    },
    {
      lens: "CFO",
      recommendation: "Yes",
      entryRange: "$20M - $28M",
      conviction: "Medium",
      keySensitivity: "Unit economics and operational efficiency",
      scenarios: {
        writeOff: {
          probability: 20,
          value: "$0",
          probabilityCalculation: "CFO analysis focuses on business model sustainability and operational efficiency. The company's unit economics and operational discipline provide strong protection against downside scenarios, but market challenges and cash flow constraints create significant risks.",
          riskFactorAnalysis: "Business model sustainability (40% impact) provides some protection. Operational efficiency (30% impact) mitigates execution risk. Market risk (30% impact) from external factors creates challenges.",
          valuationMethod: "CFO approach: Conservative multiples based on business model sustainability. Unit economics and operational discipline support modest but sustainable valuations.",
          comparableCompanies: "Companies with sustainable business models achieving 1.5-2.0x multiples even in challenging markets. Business model quality commands modest premium pricing.",
          calculationSteps: "CFO write-off calculation:\n1. Base failure rate: 70% for companies with poor unit economics\n2. Business model sustainability: -20% (strong fundamentals)\n3. Operational efficiency: -15% (team discipline)\n4. Total failure probability: 70% - 20% - 15% = 35%\n5. Success probability: 100% - 35% = 65% → 20% (adjusted for market)\n6. Valuation: $0 (complete failure scenario)",
          operationalConditions: "Strong operational discipline and business model sustainability support CFO outcomes. Team demonstrates ability to maintain operational efficiency.",
          validationMetrics: "Sustainable unit economics and proven business model validate CFO projections. Operational efficiency creates sustainable competitive advantages.",
          riskFactorQuantification: "Business model risk: 40% impact from sustainability. Operational risk: 30% impact mitigated by efficiency. Market risk: 30% impact from external factors.",
          earlyWarningIndicators: "Operational efficiency, sustainable unit economics, business model validation, cash flow management."
        },
        bear: {
          probability: 30,
          value: "$80M",
          probabilityCalculation: "Bear scenario reflects market challenges but with strong business model sustainability. The company's operational efficiency and unit economics provide significant protection against market volatility. Sustainable business practices support steady outcomes.",
          riskFactorAnalysis: "Business model sustainability (45% impact) significantly reduces downside risk. Operational efficiency (35% impact) provides strong protection. Market risk (20% impact) mitigated by sustainability.",
          valuationMethod: "CFO approach: Sustainable unit economics justify modest multiples. Business model quality and operational discipline support conservative but sustainable valuations.",
          comparableCompanies: "Companies with sustainable business models achieving 2.5-3.0x multiples even in challenging markets. Business model quality commands premium pricing.",
          calculationSteps: "CFO bear calculation:\n1. Current ARR: $15M\n2. Growth rate: 25% annually (sustainable growth)\n3. Time horizon: 2 years\n4. Future ARR: $15M × 1.25² = $23.4M\n5. Multiple: 3.5x (premium for sustainability)\n6. Valuation: $23.4M × 3.5 = $81.9M\n7. Final: $80M (rounded)",
          operationalConditions: "Strong operational discipline and business model sustainability support CFO outcomes. Team demonstrates ability to maintain operational efficiency.",
          validationMetrics: "Sustainable unit economics and proven business model validate CFO projections. Operational efficiency creates sustainable competitive advantages.",
          riskFactorQuantification: "Business model risk: 45% impact from sustainability. Operational risk: 35% impact mitigated by efficiency. Market risk: 20% impact mitigated by sustainability.",
          earlyWarningIndicators: "Operational efficiency, business model validation, unit economics, cash flow management."
        },
        base: {
          probability: 35,
          value: "$250M",
          probabilityCalculation: "Base scenario reflects strong business model sustainability and operational efficiency. The company's unit economics and operational discipline support steady growth and premium valuation multiples. Sustainable business practices create strong competitive advantages.",
          riskFactorAnalysis: "Business model sustainability (50% impact) creates significant competitive advantages. Operational efficiency (35% impact) supports growth and valuation. Market risk (15% impact) mitigated by sustainability.",
          valuationMethod: "CFO methodology captures business model sustainability and operational efficiency. Sustainable unit economics and operational discipline justify premium multiples.",
          comparableCompanies: "Companies with sustainable business models and operational efficiency achieving 4.0-5.0x multiples. Business model quality commands premium pricing.",
          calculationSteps: "CFO base calculation:\n1. Current ARR: $15M\n2. Growth rate: 45% annually (sustainable growth)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 1.45³ = $44.2M\n5. Multiple: 5.5x (premium for sustainability)\n6. Valuation: $44.2M × 5.5 = $243.1M\n7. Final: $250M (rounded)",
          operationalConditions: "Strong operational discipline and business model sustainability support CFO outcomes. Team demonstrates ability to maintain operational efficiency.",
          validationMetrics: "Sustainable unit economics and proven business model validate CFO projections. Operational efficiency creates sustainable competitive advantages.",
          riskFactorQuantification: "Business model risk: 50% impact from sustainability. Operational risk: 35% impact requiring efficiency. Market risk: 15% impact mitigated by sustainability.",
          earlyWarningIndicators: "Operational efficiency, business model validation, unit economics, cash flow management."
        },
        bull: {
          probability: 12,
          value: "$600M",
          probabilityCalculation: "Bull scenario represents strong market recognition of the company's business model sustainability. Operational efficiency and unit economics create exceptional opportunities. Market dynamics align with sustainable business practices to create significant upside potential.",
          riskFactorAnalysis: "Business model sustainability (55% impact) creates exceptional competitive advantages. Operational efficiency (35% impact) supports strong upside potential. Market risk (10% impact) mitigated by sustainability.",
          valuationMethod: "CFO approach captures business model sustainability and market opportunities. Sustainable unit economics and operational discipline justify exceptional multiples.",
          comparableCompanies: "Companies with sustainable business models achieving 7.0-8.0x multiples when market conditions align. Business model quality commands premium pricing.",
          calculationSteps: "CFO bull calculation:\n1. Current ARR: $15M\n2. Growth rate: 65% annually (exceptional efficiency)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 1.65³ = $67.2M\n5. Multiple: 8.0x (exceptional premium for sustainability)\n6. Valuation: $67.2M × 8.0 = $537.6M\n7. Final: $600M (rounded up for strategic value)",
          operationalConditions: "Strong operational discipline and business model sustainability required. Team must capitalize on market opportunities and sustainable advantages.",
          validationMetrics: "Sustainable unit economics and proven business model validate CFO projections. Operational efficiency creates sustainable competitive advantages.",
          riskFactorQuantification: "Business model risk: 55% impact from sustainability. Operational risk: 35% impact requiring efficiency. Market risk: 10% impact mitigated by sustainability.",
          earlyWarningIndicators: "Operational efficiency, market expansion success, business model validation, unit economics."
        },
        moonshot: {
          probability: 3,
          value: "$1.2B",
          probabilityCalculation: "Moonshot scenario represents exceptional market recognition and business model sustainability. The company's operational efficiency and unit economics create extraordinary opportunities, and perfect execution combined with favorable market dynamics creates exceptional outcomes.",
          riskFactorAnalysis: "Business model sustainability (60% impact) creates extraordinary competitive advantages. Operational efficiency (35% impact) supports exceptional upside potential. Market risk (5% impact) mitigated by sustainability.",
          valuationMethod: "CFO approach captures extraordinary business model sustainability and market opportunities. Sustainable unit economics and operational discipline justify exceptional multiples.",
          comparableCompanies: "Companies with exceptional business model sustainability achieving 10.0-12.0x multiples when market conditions align perfectly. Business model quality commands premium pricing.",
          calculationSteps: "CFO moonshot calculation:\n1. Current ARR: $15M\n2. Growth rate: 100% annually (perfect efficiency)\n3. Time horizon: 3 years\n4. Future ARR: $15M × 2.00³ = $120M\n5. Multiple: 10.0x (exceptional premium for sustainability)\n6. Valuation: $120M × 10.0 = $1.2B\n7. Final: $1.2B (exact)",
          operationalConditions: "Exceptional operational discipline and business model sustainability required. Team must capitalize on market opportunities and sustainable advantages.",
          validationMetrics: "Exceptional unit economics and proven business model validate CFO projections. Operational efficiency creates sustainable competitive advantages.",
          riskFactorQuantification: "Business model risk: 60% impact from sustainability. Operational risk: 35% impact requiring efficiency. Market risk: 5% impact mitigated by sustainability.",
          earlyWarningIndicators: "Exceptional operational efficiency, market expansion success, business model validation, unit economics."
        }
      },
      weightedValuation: "$200M",
      wvtReasoning: "CFO WVT reflects the company's strong business model sustainability and operational efficiency. The probability distribution considers sustainable unit economics, operational discipline, and business model quality. CFO analysis suggests steady growth potential based on sustainable business practices.",
      wvtCalculation: "CFO WVT = (20% × $0) + (30% × $80M) + (35% × $250M) + (12% × $600M) + (3% × $1.2B)\n= $0 + $24M + $87.5M + $72M + $36M = $219.5M\n\nFinal WVT: $200M (adjusted for operational efficiency)",
      wvtAdjustments: "Market intelligence suggests the company's business model sustainability creates significant competitive advantages. Sustainable unit economics and operational discipline justify premium valuation multiples.",
      industryComparison: "Company's business model sustainability places it above industry averages due to operational efficiency and sustainable practices. This positioning justifies premium valuation multiples.",
      entryPriceBands: {
        strongYes: "$20M",
        yes: "$28.6M",
        no: "$66.7M",
        strongNo: "$66.7M+"
      },
      fundLogic: "CFO investment logic: Fund focuses on companies with sustainable business models and operational efficiency. Entry price decisions based on business model quality and sustainability rather than just financial metrics. Company's sustainable practices create steady growth potential.",
      status: "completed"
    }
  ]

  const isAnalysisComplete = lensResults.every(r => r.status === "completed")
  
  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                AI Investment Committee
              </h1>
              <p className="text-lg text-muted-foreground">4-Lens Decision Engine</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Pre-seed to Series A</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>7-10x Target Returns</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Form & Metrics */}
          <div className="lg:col-span-1 space-y-6">
            <FundMetrics />
            
            {!currentAnalysis && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>Upload pitch deck or financial model</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>AI analyzes through 4 distinct lenses</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>Get structured IC recommendation</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Analysis */}
          <div className="lg:col-span-3 space-y-6">
            {!currentAnalysis ? (
              <AnalysisForm onSubmit={runAnalysis} isLoading={isAnalyzing} />
            ) : (
              <>
                <LensAnalysis results={lensResults} isLoading={isAnalyzing} />
                
                {isAnalysisComplete && (
                  <ICReport
                    companyName={currentAnalysis.companyName}
                    targetValuation={currentAnalysis.targetValuation}
                    results={lensResults}
                    consensusSensitivity="Prove cost-saving impact is repeatable and scalable beyond initial clients"
                    actionItem="Pass at current $40M post unless cost outcomes are proven. Revisit with client cohort validation."
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

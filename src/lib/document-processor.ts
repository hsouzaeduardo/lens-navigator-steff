import * as pdfjsLib from 'pdfjs-dist'
import * as XLSX from 'xlsx'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export interface ProcessedDocument {
  fileName: string
  fileType: string
  content: string
  wordCount: number
  summary: string
  keyMetrics?: Record<string, any>
  metadata: DocumentMetadata
  processingStatus: 'pending' | 'processing' | 'completed' | 'error'
  errorMessage?: string
  processingTime?: number
}

export interface DocumentMetadata {
  fileSize: number
  lastModified: Date
  pageCount?: number
  sheetCount?: number
  language?: string
  hasImages: boolean
  hasTables: boolean
  hasCharts: boolean
  encryptionLevel?: string
  author?: string
  title?: string
  subject?: string
  keywords?: string[]
  createdDate?: Date
  modifiedDate?: Date
}

export interface DocumentAnalysis {
  totalDocuments: number
  totalWordCount: number
  combinedContent: string
  documentSummaries: ProcessedDocument[]
  keyInsights: string[]
  processingSummary: ProcessingSummary
}

export interface ProcessingSummary {
  successful: number
  failed: number
  totalProcessingTime: number
  averageProcessingTime: number
  fileTypeBreakdown: Record<string, number>
  sizeBreakdown: {
    small: number // < 1MB
    medium: number // 1-10MB
    large: number // > 10MB
  }
}

export interface ProcessingProgress {
  currentFile: string
  currentIndex: number
  totalFiles: number
  percentage: number
  status: 'idle' | 'processing' | 'completed' | 'error'
}

export class DocumentProcessor {
  private static readonly MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB
  private static readonly MAX_CONTENT_LENGTH = 50000 // 50k characters per document
  private static readonly SUPPORTED_TYPES = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'application/json': 'json',
    'application/xml': 'xml',
    'text/html': 'html',
    // Add fallback for common file extensions
    'pdf': 'pdf',
    'docx': 'docx',
    'pptx': 'pptx',
    'xlsx': 'xlsx',
    'txt': 'txt',
    'csv': 'csv',
    'json': 'json',
    'xml': 'xml',
    'html': 'html'
  }

  /**
   * Process a single document with enhanced error handling and metadata extraction
   */
  static async processDocument(file: File, onProgress?: (progress: ProcessingProgress) => void): Promise<ProcessedDocument> {
    const startTime = Date.now()
    
    try {
      // Validate file
      if (file.size > this.MAX_FILE_SIZE) {
        throw new Error(`File ${file.name} is too large. Maximum size is 25MB.`)
      }

      // Update progress
      onProgress?.({
        currentFile: file.name,
        currentIndex: 0,
        totalFiles: 1,
        percentage: 0,
        status: 'processing'
      })

      // Try to get file type from MIME type first, then from file extension
      let fileType = this.SUPPORTED_TYPES[file.type as keyof typeof this.SUPPORTED_TYPES]
      
      if (!fileType) {
        // Fallback to file extension
        const extension = file.name.split('.').pop()?.toLowerCase()
        if (extension && this.SUPPORTED_TYPES[extension as keyof typeof this.SUPPORTED_TYPES]) {
          fileType = this.SUPPORTED_TYPES[extension as keyof typeof this.SUPPORTED_TYPES]
        }
      }
      
      if (!fileType) {
        throw new Error(`Unsupported file type: ${file.type || 'unknown'} (${file.name})`)
      }

      // Extract metadata first
      const metadata = await this.extractMetadata(file, fileType)
      
      onProgress?.({
        currentFile: file.name,
        currentIndex: 0,
        totalFiles: 1,
        percentage: 30,
        status: 'processing'
      })

      let content = ''
      let keyMetrics: Record<string, any> = {}

      // Process content based on file type
      switch (fileType) {
        case 'pdf':
          content = await this.extractPDFText(file)
          break
        case 'docx':
          content = await this.extractDOCXText(file)
          break
        case 'pptx':
          content = await this.extractPPTXText(file)
          break
        case 'xlsx':
          const result = await this.extractXLSXText(file)
          content = result.content
          keyMetrics = result.metrics
          break
        case 'csv':
          const csvResult = await this.extractCSVText(file)
          content = csvResult.content
          keyMetrics = csvResult.metrics
          break
        case 'json':
          content = await this.extractJSONText(file)
          break
        case 'xml':
          content = await this.extractXMLText(file)
          break
        case 'html':
          content = await this.extractHTMLText(file)
          break
        case 'txt':
          content = await this.extractTXTText(file)
          break
        default:
          throw new Error(`Unsupported file type: ${fileType}`)
      }

      onProgress?.({
        currentFile: file.name,
        currentIndex: 0,
        totalFiles: 1,
        percentage: 80,
        status: 'processing'
      })

      // Truncate content if too long
      if (content.length > this.MAX_CONTENT_LENGTH) {
        content = content.substring(0, this.MAX_CONTENT_LENGTH) + '\n\n[Content truncated due to length]'
      }

      const wordCount = content.split(/\s+/).length
      const summary = this.generateSummary(content, fileType, metadata)
      const processingTime = Date.now() - startTime

      // Update final progress
      onProgress?.({
        currentFile: file.name,
        currentIndex: 0,
        totalFiles: 1,
        percentage: 100,
        status: 'completed'
      })

      return {
        fileName: file.name,
        fileType,
        content,
        wordCount,
        summary,
        keyMetrics,
        metadata,
        processingStatus: 'completed',
        processingTime
      }
    } catch (error) {
      const processingTime = Date.now() - startTime
      
      onProgress?.({
        currentFile: file.name,
        currentIndex: 0,
        totalFiles: 1,
        percentage: 0,
        status: 'error'
      })

      return {
        fileName: file.name,
        fileType: 'unknown',
        content: '',
        wordCount: 0,
        summary: 'Processing failed',
        metadata: await this.extractBasicMetadata(file),
        processingStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        processingTime
      }
    }
  }

  /**
   * Process multiple documents with progress tracking and batch processing
   */
  static async processDocuments(files: File[], onProgress?: (progress: ProcessingProgress) => void): Promise<DocumentAnalysis> {
    const processedDocs: ProcessedDocument[] = []
    let totalWordCount = 0
    let combinedContent = ''
    let totalProcessingTime = 0
    let successfulCount = 0
    let failedCount = 0
    const fileTypeBreakdown: Record<string, number> = {}
    const sizeBreakdown = { small: 0, medium: 0, large: 0 }

    // Initialize progress
    onProgress?.({
      currentFile: '',
      currentIndex: 0,
      totalFiles: files.length,
      percentage: 0,
      status: 'processing'
    })

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Update progress
      onProgress?.({
        currentFile: file.name,
        currentIndex: i,
        totalFiles: files.length,
        percentage: Math.round((i / files.length) * 100),
        status: 'processing'
      })

      try {
        const processed = await this.processDocument(file)
        processedDocs.push(processed)
        
        if (processed.processingStatus === 'completed') {
          totalWordCount += processed.wordCount
          combinedContent += `\n\n=== ${processed.fileName} ===\n${processed.content}`
          successfulCount++
          if (processed.processingTime) totalProcessingTime += processed.processingTime
        } else {
          failedCount++
        }

        // Update breakdowns
        fileTypeBreakdown[processed.fileType] = (fileTypeBreakdown[processed.fileType] || 0) + 1
        
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB < 1) sizeBreakdown.small++
        else if (fileSizeMB < 10) sizeBreakdown.medium++
        else sizeBreakdown.large++

      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error)
        failedCount++
        
        // Add failed document to processed docs
        processedDocs.push({
          fileName: file.name,
          fileType: 'unknown',
          content: '',
          wordCount: 0,
          summary: 'Processing failed',
          metadata: await this.extractBasicMetadata(file),
          processingStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const keyInsights = this.extractKeyInsights(combinedContent)
    const averageProcessingTime = successfulCount > 0 ? totalProcessingTime / successfulCount : 0

    // Final progress update
    onProgress?.({
      currentFile: '',
      currentIndex: files.length,
      totalFiles: files.length,
      percentage: 100,
      status: 'completed'
    })

    return {
      totalDocuments: processedDocs.length,
      totalWordCount,
      combinedContent: combinedContent.trim(),
      documentSummaries: processedDocs,
      keyInsights,
      processingSummary: {
        successful: successfulCount,
        failed: failedCount,
        totalProcessingTime,
        averageProcessingTime,
        fileTypeBreakdown,
        sizeBreakdown
      }
    }
  }

  /**
   * Extract comprehensive metadata from files
   */
  private static async extractMetadata(file: File, fileType: string): Promise<DocumentMetadata> {
    const metadata: DocumentMetadata = {
      fileSize: file.size,
      lastModified: new Date(file.lastModified),
      hasImages: false,
      hasTables: false,
      hasCharts: false
    }

    try {
      switch (fileType) {
        case 'pdf':
          const pdfMetadata = await this.extractPDFMetadata(file)
          Object.assign(metadata, pdfMetadata)
          break
        case 'docx':
          const docxMetadata = await this.extractDOCXMetadata(file)
          Object.assign(metadata, docxMetadata)
          break
        case 'xlsx':
          const xlsxMetadata = await this.extractXLSXMetadata(file)
          Object.assign(metadata, xlsxMetadata)
          break
        case 'pptx':
          const pptxMetadata = await this.extractPPTXMetadata(file)
          Object.assign(metadata, pptxMetadata)
          break
      }
    } catch (error) {
      console.warn(`Failed to extract metadata for ${file.name}:`, error)
    }

    return metadata
  }

  /**
   * Extract basic metadata when full extraction fails
   */
  private static async extractBasicMetadata(file: File): Promise<DocumentMetadata> {
    return {
      fileSize: file.size,
      lastModified: new Date(file.lastModified),
      hasImages: false,
      hasTables: false,
      hasCharts: false
    }
  }

  /**
   * Extract metadata from PDF files
   */
  private static async extractPDFMetadata(file: File): Promise<Partial<DocumentMetadata>> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      return {
        pageCount: pdf.numPages,
        hasImages: true, // PDFs often contain images
        hasTables: true, // PDFs can contain tables
        hasCharts: true  // PDFs can contain charts
      }
    } catch (error) {
      return {}
    }
  }

  /**
   * Extract metadata from DOCX files
   */
  private static async extractDOCXMetadata(file: File): Promise<Partial<DocumentMetadata>> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ arrayBuffer })
      const text = (result && (result as any).value) || ''

      // Basic metadata extraction for DOCX
      return {
        hasImages: text.includes('[Image]') || text.includes('[Picture]'),
        hasTables: text.includes('[Table]'),
        hasCharts: text.includes('[Chart]')
      }
    } catch (error) {
      return {}
    }
  }

  /**
   * Extract metadata from XLSX files
   */
  private static async extractXLSXMetadata(file: File): Promise<Partial<DocumentMetadata>> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      
      return {
        sheetCount: workbook.SheetNames.length,
        hasTables: true,
        hasCharts: workbook.SheetNames.some(name => 
          workbook.Sheets[name] && workbook.Sheets[name]['!drawing']
        )
      }
    } catch (error) {
      return {}
    }
  }

  /**
   * Extract metadata from PPTX files
   */
  private static async extractPPTXMetadata(file: File): Promise<Partial<DocumentMetadata>> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      
      return {
        sheetCount: workbook.SheetNames.length,
        hasImages: true,
        hasCharts: true
      }
    } catch (error) {
      return {}
    }
  }

  /**
   * Extract text from PDF files
   */
  private static async extractPDFText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''

    for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) { // Limit to 50 pages
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }

    return fullText.trim()
  }

  /**
   * Extract text from DOCX files
   */
  private static async extractDOCXText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ arrayBuffer })
    return ((result && (result as any).value) || '').toString()
  }

  /**
   * Extract text from PPTX files
   */
  private static async extractPPTXText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    let fullText = ''

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      jsonData.forEach((row: any) => {
        if (Array.isArray(row)) {
          row.forEach((cell: any) => {
            if (cell && typeof cell === 'string') {
              fullText += cell + ' '
            }
          })
        }
      })
      fullText += '\n'
    })

    return fullText.trim()
  }

  /**
   * Extract text from XLSX files
   */
  private static async extractXLSXText(file: File): Promise<{ content: string; metrics: Record<string, any> }> {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    let fullText = ''
    const metrics: Record<string, any> = {}

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      // Extract headers and data
      if (jsonData.length > 0) {
        const headers = jsonData[0] as string[]
        fullText += `Sheet: ${sheetName}\n`
        fullText += `Headers: ${headers.join(', ')}\n`
        
        // Add first few rows as sample data
        const sampleRows = jsonData.slice(1, 6) // First 5 data rows
        sampleRows.forEach((row: any, index: number) => {
          if (Array.isArray(row)) {
            fullText += `Row ${index + 1}: ${row.join(', ')}\n`
          }
        })
        
        // Store metrics
        metrics[sheetName] = {
          rows: jsonData.length - 1,
          columns: headers.length,
          sampleData: sampleRows
        }
      }
      
      fullText += '\n'
    })

    return { content: fullText.trim(), metrics }
  }

  /**
   * Extract text from CSV files
   */
  private static async extractCSVText(file: File): Promise<{ content: string; metrics: Record<string, any> }> {
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0]?.split(',').map(h => h.trim()) || []
    
    const metrics = {
      rows: lines.length - 1,
      columns: headers.length,
      headers: headers,
      sampleData: lines.slice(1, 6) // First 5 data rows
    }

    return {
      content: `CSV File: ${file.name}\nHeaders: ${headers.join(', ')}\nRows: ${lines.length - 1}\n\nSample Data:\n${lines.slice(1, 6).join('\n')}`,
      metrics
    }
  }

  /**
   * Extract text from JSON files
   */
  private static async extractJSONText(file: File): Promise<string> {
    const text = await file.text()
    try {
      const json = JSON.parse(text)
      return `JSON File: ${file.name}\n\nContent:\n${JSON.stringify(json, null, 2)}`
    } catch {
      return `JSON File: ${file.name}\n\nContent:\n${text}`
    }
  }

  /**
   * Extract text from XML files
   */
  private static async extractXMLText(file: File): Promise<string> {
    const text = await file.text()
    // Simple XML text extraction - remove tags and keep content
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return `XML File: ${file.name}\n\nContent:\n${cleanText}`
  }

  /**
   * Extract text from HTML files
   */
  private static async extractHTMLText(file: File): Promise<string> {
    const text = await file.text()
    // Simple HTML text extraction - remove tags and keep content
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return `HTML File: ${file.name}\n\nContent:\n${cleanText}`
  }

  /**
   * Extract text from TXT files
   */
  private static async extractTXTText(file: File): Promise<string> {
    return await file.text()
  }

  /**
   * Generate a summary of the document content
   */
  private static generateSummary(content: string, fileType: string, metadata: DocumentMetadata): string {
    const words = content.split(/\s+/)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
    
    let summary = `Document type: ${fileType.toUpperCase()}\n`
    summary += `Word count: ${words.length}\n`
    summary += `Sentences: ${sentences.length}\n`
    
    // Add metadata information
    if (metadata.pageCount) summary += `Pages: ${metadata.pageCount}\n`
    if (metadata.sheetCount) summary += `Sheets: ${metadata.sheetCount}\n`
    if (metadata.hasImages) summary += `Contains images\n`
    if (metadata.hasTables) summary += `Contains tables\n`
    if (metadata.hasCharts) summary += `Contains charts\n`
    
    // Extract key phrases (simple approach)
    const keyPhrases = this.extractKeyPhrases(content)
    if (keyPhrases.length > 0) {
      summary += `Key topics: ${keyPhrases.slice(0, 5).join(', ')}\n`
    }
    
    // Add content categorization
    const categories = this.categorizeContent(content)
    if (categories.length > 0) {
      summary += `Content categories: ${categories.slice(0, 3).join(', ')}\n`
    }
    
    return summary
  }

  /**
   * Categorize document content based on keywords and patterns
   */
  private static categorizeContent(content: string): string[] {
    const categories: string[] = []
    const lowerContent = content.toLowerCase()
    
    // Financial categories
    if (lowerContent.includes('revenue') || lowerContent.includes('profit') || lowerContent.includes('valuation')) {
      categories.push('Financial')
    }
    if (lowerContent.includes('market') || lowerContent.includes('competition') || lowerContent.includes('industry')) {
      categories.push('Market Analysis')
    }
    if (lowerContent.includes('team') || lowerContent.includes('founder') || lowerContent.includes('employee')) {
      categories.push('Team & People')
    }
    if (lowerContent.includes('product') || lowerContent.includes('technology') || lowerContent.includes('feature')) {
      categories.push('Product & Tech')
    }
    if (lowerContent.includes('customer') || lowerContent.includes('user') || lowerContent.includes('client')) {
      categories.push('Customer & Users')
    }
    if (lowerContent.includes('legal') || lowerContent.includes('regulatory') || lowerContent.includes('compliance')) {
      categories.push('Legal & Compliance')
    }
    
    return categories
  }

  /**
   * Extract key insights from combined content with enhanced analysis
   */
  private static extractKeyInsights(content: string): string[] {
    const insights: string[] = []
    
    // Look for financial metrics with enhanced patterns
    const financialPatterns = [
      /(\$[\d,]+(?:\.\d{2})?)/g,
      /(\d+(?:\.\d+)?%?)/g,
      /(revenue|profit|loss|growth|valuation|funding|investment|burn rate|runway)/gi,
      /(ARR|MRR|CAC|LTV|churn|retention|conversion)/gi
    ]
    
    financialPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        insights.push(`Financial data found: ${matches.slice(0, 3).join(', ')}`)
      }
    })
    
    // Look for company information
    const companyPatterns = [
      /(founded|established|incorporated|headquartered)/gi,
      /(employees|team|staff|headcount)/gi,
      /(customers|users|clients|partners)/gi,
      /(series [a-d]|seed|pre-seed|ipo|exit)/gi
    ]
    
    companyPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        insights.push(`Company info found: ${matches.slice(0, 3).join(', ')}`)
      }
    })
    
    // Look for market and industry insights
    const marketPatterns = [
      /(TAM|SAM|SOM|market size|addressable market)/gi,
      /(competitor|rival|alternative|substitute)/gi,
      /(industry|sector|vertical|niche)/gi
    ]
    
    marketPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        insights.push(`Market insights: ${matches.slice(0, 3).join(', ')}`)
      }
    })
    
    // Look for technology and product insights
    const techPatterns = [
      /(API|SDK|platform|infrastructure|scalability)/gi,
      /(AI|ML|machine learning|artificial intelligence)/gi,
      /(cloud|SaaS|subscription|freemium)/gi
    ]
    
    techPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        insights.push(`Tech insights: ${matches.slice(0, 3).join(', ')}`)
      }
    })
    
    return insights.slice(0, 8) // Increased limit for more insights
  }

  /**
   * Extract key phrases from content with improved algorithm
   */
  private static extractKeyPhrases(content: string): string[] {
    const words = content.toLowerCase().split(/\s+/)
    const wordFreq: Record<string, number> = {}
    
    // Enhanced common words exclusion
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      'it', 'its', 'they', 'them', 'their', 'we', 'us', 'our', 'you', 'your', 'he', 'she', 'his', 'her',
      'from', 'into', 'during', 'including', 'until', 'against', 'among', 'throughout', 'despite',
      'towards', 'upon', 'concerning', 'like', 'than', 'over', 'within', 'without', 'before', 'after',
      'above', 'below', 'up', 'down', 'out', 'off', 'away', 'back', 'forward', 'around', 'across',
      'through', 'along', 'beyond', 'behind', 'under', 'above', 'inside', 'outside', 'near', 'far'
    ])
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '')
      if (cleanWord.length > 3 && !commonWords.has(cleanWord)) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1
      }
    })
    
    // Return top words by frequency with minimum frequency threshold
    const minFrequency = 2
    return Object.entries(wordFreq)
      .filter(([, freq]) => freq >= minFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([word]) => word)
  }

  /**
   * Create a prompt-friendly summary of documents for LLM analysis with enhanced formatting
   */
  static createAnalysisPrompt(documents: ProcessedDocument[], companyName: string): string {
    let prompt = `\n\n=== UPLOADED DOCUMENTS FOR ANALYSIS ===\n`
    prompt += `Company: ${companyName}\n`
    prompt += `Total documents: ${documents.length}\n\n`
    
    // Group documents by processing status
    const successfulDocs = documents.filter(doc => doc.processingStatus === 'completed')
    const failedDocs = documents.filter(doc => doc.processingStatus === 'error')
    
    prompt += `Successfully processed: ${successfulDocs.length}\n`
    if (failedDocs.length > 0) {
      prompt += `Failed to process: ${failedDocs.length}\n`
    }
    prompt += `\n`
    
    // Document details
    documents.forEach((doc, index) => {
      prompt += `Document ${index + 1}: ${doc.fileName}\n`
      prompt += `Type: ${doc.fileType.toUpperCase()}\n`
      prompt += `Status: ${doc.processingStatus}\n`
      
      if (doc.processingStatus === 'completed') {
        prompt += `Word count: ${doc.wordCount}\n`
        prompt += `Processing time: ${doc.processingTime}ms\n`
        prompt += `Summary: ${doc.summary}\n`
        
        if (doc.keyMetrics && Object.keys(doc.keyMetrics).length > 0) {
          prompt += `Key metrics: ${JSON.stringify(doc.keyMetrics, null, 2)}\n`
        }
        
        // Add metadata insights
        if (doc.metadata) {
          const meta = doc.metadata
          if (meta.pageCount) prompt += `Pages: ${meta.pageCount}\n`
          if (meta.sheetCount) prompt += `Sheets: ${meta.sheetCount}\n`
          if (meta.hasImages) prompt += `Contains images\n`
          if (meta.hasTables) prompt += `Contains tables\n`
          if (meta.hasCharts) prompt += `Contains charts\n`
        }
        
        prompt += `\n--- Content Preview (first 800 chars) ---\n`
        prompt += `${doc.content.substring(0, 800)}${doc.content.length > 800 ? '...' : ''}\n\n`
      } else {
        prompt += `Error: ${doc.errorMessage || 'Unknown error'}\n\n`
      }
    })
    
    prompt += `\n=== ANALYSIS INSTRUCTIONS ===\n`
    prompt += `Please analyze the above documents thoroughly and incorporate specific information, data, and insights from these materials into your investment analysis. Reference specific facts, figures, and details from the documents to support your recommendations.\n\n`
    
    // Add specific analysis guidance based on document types
    const hasFinancialDocs = documents.some(doc => 
      doc.fileType === 'xlsx' || doc.fileType === 'csv' || 
      doc.content.toLowerCase().includes('financial') || 
      doc.content.toLowerCase().includes('revenue')
    )
    
    if (hasFinancialDocs) {
      prompt += `Note: Financial documents detected. Pay special attention to:\n`
      prompt += `- Revenue models and pricing strategies\n`
      prompt += `- Unit economics and key metrics\n`
      prompt += `- Growth trends and projections\n`
      prompt += `- Cash flow and runway analysis\n\n`
    }
    
    const hasMarketDocs = documents.some(doc => 
      doc.content.toLowerCase().includes('market') || 
      doc.content.toLowerCase().includes('competition') ||
      doc.content.toLowerCase().includes('industry')
    )
    
    if (hasMarketDocs) {
      prompt += `Note: Market analysis documents detected. Pay special attention to:\n`
      prompt += `- Market size and opportunity assessment\n`
      prompt += `- Competitive landscape analysis\n`
      prompt += `- Market positioning and differentiation\n`
      prompt += `- Go-to-market strategy\n\n`
    }
    
    return prompt
  }

  /**
   * Get document processing statistics and insights
   */
  static getProcessingStats(documents: ProcessedDocument[]): {
    totalFiles: number
    successfulFiles: number
    failedFiles: number
    fileTypeDistribution: Record<string, number>
    averageProcessingTime: number
    totalWordCount: number
    contentQuality: 'high' | 'medium' | 'low'
  } {
    const successful = documents.filter(doc => doc.processingStatus === 'completed')
    const failed = documents.filter(doc => doc.processingStatus === 'error')
    
    const fileTypeDistribution: Record<string, number> = {}
    documents.forEach(doc => {
      fileTypeDistribution[doc.fileType] = (fileTypeDistribution[doc.fileType] || 0) + 1
    })
    
    const totalProcessingTime = successful.reduce((sum, doc) => sum + (doc.processingTime || 0), 0)
    const averageProcessingTime = successful.length > 0 ? totalProcessingTime / successful.length : 0
    
    const totalWordCount = successful.reduce((sum, doc) => sum + doc.wordCount, 0)
    
    // Determine content quality based on word count and document count
    let contentQuality: 'high' | 'medium' | 'low' = 'medium'
    if (totalWordCount > 10000 && successful.length > 3) contentQuality = 'high'
    else if (totalWordCount < 1000 || successful.length < 2) contentQuality = 'low'
    
    return {
      totalFiles: documents.length,
      successfulFiles: successful.length,
      failedFiles: failed.length,
      fileTypeDistribution,
      averageProcessingTime,
      totalWordCount,
      contentQuality
    }
  }

  /**
   * Validate if documents are suitable for investment analysis
   */
  static validateForInvestmentAnalysis(documents: ProcessedDocument[]): {
    isValid: boolean
    issues: string[]
    recommendations: string[]
  } {
    const issues: string[] = []
    const recommendations: string[] = []
    
    if (documents.length === 0) {
      issues.push('No documents uploaded')
      recommendations.push('Upload at least one document for analysis')
      return { isValid: false, issues, recommendations }
    }
    
    const successfulDocs = documents.filter(doc => doc.processingStatus === 'completed')
    if (successfulDocs.length === 0) {
      issues.push('No documents could be processed successfully')
      recommendations.push('Check file formats and try uploading different files')
      return { isValid: false, issues, recommendations }
    }
    
    const totalWordCount = successfulDocs.reduce((sum, doc) => sum + doc.wordCount, 0)
    if (totalWordCount < 500) {
      issues.push('Very limited content available for analysis')
      recommendations.push('Upload more comprehensive documents or longer content')
    }
    
    const hasFinancialData = successfulDocs.some(doc => 
      doc.fileType === 'xlsx' || doc.fileType === 'csv' ||
      doc.content.toLowerCase().includes('revenue') ||
      doc.content.toLowerCase().includes('financial')
    )
    
    if (!hasFinancialData) {
      recommendations.push('Consider uploading financial documents (spreadsheets, financial reports) for better analysis')
    }
    
    const hasBusinessPlan = successfulDocs.some(doc => 
      doc.content.toLowerCase().includes('business plan') ||
      doc.content.toLowerCase().includes('pitch deck') ||
      doc.content.toLowerCase().includes('executive summary')
    )
    
    if (!hasBusinessPlan) {
      recommendations.push('Business plans, pitch decks, or executive summaries provide valuable context for investment analysis')
    }
    
    return {
      isValid: successfulDocs.length > 0 && totalWordCount >= 200,
      issues,
      recommendations
    }
  }
}

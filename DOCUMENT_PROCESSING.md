# Document Processing for LLM Analysis

## Overview

The Lens Navigator now includes advanced document processing capabilities that allow the LLM to actually read and analyze uploaded documents, rather than just seeing file names. This provides much more comprehensive and accurate investment analysis based on the actual content of your materials.

## Supported File Types

- **PDF** (.pdf) - Text extraction from PDF documents
- **Word Documents** (.docx) - Full text extraction from Microsoft Word files
- **PowerPoint Presentations** (.pptx) - Text extraction from presentation slides
- **Excel Spreadsheets** (.xlsx) - Data extraction with key metrics and sample data
- **Text Files** (.txt) - Direct text content

## How It Works

### 1. Document Upload
- Users upload documents through the familiar drag-and-drop interface
- Files are validated for size (max 25MB) and type
- Multiple files can be uploaded simultaneously (up to 20 files)

### 2. Content Extraction
- **PDFs**: Uses PDF.js to extract text from all pages (limited to 50 pages for performance)
- **DOCX**: Uses Mammoth.js to extract raw text content
- **PPTX**: Extracts text from all slides and presentation content
- **XLSX**: Extracts headers, sample data, and provides metrics (rows/columns count)
- **TXT**: Direct text extraction

### 3. Content Processing
- Text is cleaned and formatted for LLM consumption
- Content is truncated to 50,000 characters per document for optimal performance
- Key insights are automatically extracted (financial metrics, company info, etc.)
- Document summaries are generated with word counts and key topics

### 4. LLM Integration
- Processed document content is embedded directly into the analysis prompts
- Each analytical lens (Skeptical, Contrarian, Optimistic, CFO) receives the full document context
- The LLM can reference specific facts, figures, and details from your materials
- Analysis is based on actual document content, not just assumptions

## User Experience

### Document Processing Status
- Real-time processing indicators show when documents are being analyzed
- Error handling for unsupported file types or processing failures
- Success confirmation with document summaries

### Document Preview
- Users can review extracted content before analysis
- Collapsible document previews show summaries and key metrics
- Content previews (first 1000 characters) help verify extraction quality
- Document removal functionality for individual files

### Enhanced Analysis
- LLM receives comprehensive document context
- Analysis includes specific references to uploaded materials
- More accurate and data-driven investment recommendations
- Better understanding of company fundamentals and metrics

## Technical Implementation

### DocumentProcessor Class
- Static methods for processing individual and multiple documents
- Automatic file type detection with MIME type and extension fallback
- Content truncation and optimization for LLM consumption
- Error handling and validation throughout the process

### Integration Points
- **AnalysisForm**: Handles file uploads and triggers document processing
- **DocumentPreview**: Shows processed document summaries and content
- **Azure OpenAI**: Receives enhanced prompts with document content
- **Index Page**: Coordinates the entire analysis workflow

## Performance Considerations

- **File Size Limits**: 25MB per file to prevent browser memory issues
- **Content Truncation**: 50,000 character limit per document for optimal LLM performance
- **Page Limits**: PDF processing limited to 50 pages for performance
- **Batch Processing**: Multiple documents processed sequentially to manage memory

## Error Handling

- **Unsupported File Types**: Clear error messages for unsupported formats
- **Processing Failures**: Graceful fallback with detailed error information
- **File Size Exceeded**: Validation before processing begins
- **Content Extraction Issues**: Partial content extraction when possible

## Best Practices

### For Users
1. **File Quality**: Use high-quality, text-based documents for best results
2. **File Size**: Keep files under 25MB for optimal processing
3. **File Types**: Prefer PDF or DOCX for text-heavy documents
4. **Content**: Ensure documents contain relevant financial and business information

### For Developers
1. **Memory Management**: Process documents sequentially to avoid memory issues
2. **Error Handling**: Provide clear feedback for all failure scenarios
3. **Performance**: Implement content truncation for large documents
4. **User Experience**: Show processing status and allow content review

## Future Enhancements

- **OCR Support**: Text extraction from scanned documents and images
- **Table Extraction**: Better handling of structured data in spreadsheets
- **Document Chunking**: Intelligent content splitting for very long documents
- **Caching**: Document processing results caching for repeated analysis
- **Batch Optimization**: Parallel processing for multiple documents

## Troubleshooting

### Common Issues
1. **"Unsupported file type"**: Check file extension and ensure it's one of the supported types
2. **"File too large"**: Reduce file size or split into multiple documents
3. **"Processing failed"**: Check file integrity and try re-uploading
4. **"Content truncated"**: Normal behavior for very long documents

### Performance Tips
1. **Document Length**: Shorter, focused documents process faster
2. **File Count**: Process documents in smaller batches for better performance
3. **Browser Memory**: Close other tabs/applications during large document processing
4. **Network**: Ensure stable internet connection for large file uploads

## Security Considerations

- **Client-Side Processing**: All document processing happens in the user's browser
- **No Server Storage**: Documents are not stored on external servers
- **Privacy**: Document content remains private and is only sent to the LLM for analysis
- **Data Handling**: Processed content is only used for the current analysis session

This document processing feature significantly enhances the quality and accuracy of investment analysis by providing the LLM with actual document content rather than just file names. Users can now upload comprehensive materials and receive analysis based on the specific information contained in their documents.

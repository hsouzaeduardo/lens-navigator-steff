import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ExportData {
  companyName: string
  targetValuation?: string
  results: any[]
  consensusSensitivity: string
  actionItem: string
  date: string
}

export const exportToPDF = async (data: ExportData, elementRef: HTMLElement | null) => {
  if (!elementRef) {
    console.error('Elemento de referência não encontrado')
    return
  }

  try {
    // Criar PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const lineHeight = 8 // Much larger line height to prevent overlap
    const sectionSpacing = 15 // Spacing between major sections

    // Configurar fonte
    pdf.setFont('helvetica')
    pdf.setFontSize(16)

    // Título
    pdf.setFillColor(59, 130, 246) // Blue-500
    pdf.rect(0, 0, pageWidth, 35, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.text('AI Investment Committee Report', pageWidth / 2, 22, { align: 'center' })

    // Informações da empresa
    let yPosition = 55
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text(`Company: ${data.companyName}`, margin, yPosition)
    
    yPosition += lineHeight + 4
    if (data.targetValuation) {
      pdf.text(`Target Valuation: ${data.targetValuation}`, margin, yPosition)
      yPosition += lineHeight + 4
    }
    pdf.text(`Date: ${data.date}`, margin, yPosition)
    yPosition += lineHeight + sectionSpacing

    // Resumo das lentes
    pdf.setFontSize(12)
    pdf.setFillColor(243, 244, 246) // Gray-100
    const lensBoxHeight = (data.results.length * (lineHeight + 4)) + 20
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, lensBoxHeight, 'F')
    
    yPosition += 15
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    
    data.results.forEach((result, index) => {
      const x = margin + 5
      const recommendationColor = result.recommendation.includes('Yes') ? [34, 197, 94] : [239, 68, 68] // Green or Red
      
      pdf.setTextColor(recommendationColor[0], recommendationColor[1], recommendationColor[2])
      pdf.text(`${result.lens}: ${result.recommendation}`, x, yPosition)
      
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      pdf.text(`Entry Range: ${result.entryRange}`, x + 50, yPosition)
      pdf.text(`Conviction: ${result.conviction}`, x + 120, yPosition)
      
      yPosition += lineHeight + 4
      pdf.setFontSize(11)
    })

    // Cenários de valuation
    yPosition += sectionSpacing
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Valuation Scenarios:', margin, yPosition)
    
    yPosition += lineHeight + 8
    pdf.setFontSize(10)
    
    const scenarios = ['Write-Off', 'Bear', 'Base', 'Bull', 'Moonshot']
    const scenarioColors = [
      [239, 68, 68],   // Red
      [245, 158, 11],  // Orange
      [59, 130, 246],  // Blue
      [34, 197, 94],   // Green
      [168, 85, 247]   // Purple
    ]

    scenarios.forEach((scenario, index) => {
      const x = margin + (index * 35)
      const color = scenarioColors[index]
      
      pdf.setTextColor(color[0], color[1], color[2])
      pdf.text(scenario, x, yPosition)
      
      // Encontrar o resultado correspondente
      const result = data.results.find(r => r.scenarios && r.scenarios[scenario.toLowerCase().replace('-', '')])
      if (result) {
        const scenarioData = result.scenarios[scenario.toLowerCase().replace('-', '')]
        pdf.setFontSize(8)
        pdf.text(`${scenarioData.probability}%`, x, yPosition + 8)
        pdf.text(scenarioData.value, x, yPosition + 16)
        pdf.setFontSize(10)
      }
    })

    // Sensibilidade e ação
    yPosition += 35
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Key Sensitivity:', margin, yPosition)
    yPosition += lineHeight + 4
    pdf.setFontSize(10)
    
    // Wrap text for sensitivity with proper spacing
    const sensitivityLines = wrapText(pdf, data.consensusSensitivity, pageWidth - 2 * margin - 10, 9)
    sensitivityLines.forEach(line => {
      pdf.text(line, margin + 5, yPosition)
      yPosition += lineHeight + 2
    })
    
    yPosition += 8
    pdf.setFontSize(11)
    pdf.text('Action Item:', margin, yPosition)
    yPosition += lineHeight + 4
    pdf.setFontSize(10)
    
    // Wrap text for action item with proper spacing
    const actionLines = wrapText(pdf, data.actionItem, pageWidth - 2 * margin - 10, 9)
    actionLines.forEach(line => {
      pdf.text(line, margin + 5, yPosition)
      yPosition += lineHeight + 2
    })

    // Análises detalhadas com reasoning
    yPosition += sectionSpacing
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Detailed Analysis by Lens:', margin, yPosition)

    // Para cada lente, adicionar análise detalhada
    data.results.forEach((result, index) => {
      yPosition += 20
      
      // Verificar se há espaço suficiente na página
      if (yPosition > pageHeight - 120) {
        pdf.addPage()
        yPosition = 40
      }
      
      pdf.setFontSize(11)
      pdf.setFillColor(59, 130, 246)
      pdf.setTextColor(255, 255, 255)
      pdf.rect(margin, yPosition - 8, pageWidth - 2 * margin, 12, 'F')
      pdf.text(`${result.lens} Lens Analysis`, margin + 8, yPosition)
      
      yPosition += 18
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      
      // Adicionar cenários com reasoning
      pdf.setFontSize(10)
      pdf.text('Valuation Scenarios & Reasoning:', margin + 5, yPosition)
      yPosition += lineHeight + 2
      
      const scenarioNames = ['Write-Off', 'Bear', 'Base', 'Bull', 'Moonshot']
      scenarioNames.forEach((scenarioName, idx) => {
        const scenarioKey = scenarioName.toLowerCase().replace('-', '')
        const scenarioData = result.scenarios[scenarioKey]
        
        if (scenarioData) {
          // Verificar se precisa de nova página
          if (yPosition > pageHeight - 60) {
            pdf.addPage()
            yPosition = 40
          }
          
          pdf.setFontSize(9)
          pdf.setTextColor(59, 130, 246)
          pdf.text(`${scenarioName}: ${scenarioData.probability}% | ${scenarioData.value}`, margin + 5, yPosition)
          yPosition += lineHeight
          
          // Adicionar reasoning se disponível
          if (scenarioData.reasoning) {
            pdf.setFontSize(8)
            pdf.setTextColor(0, 0, 0)
            const reasoningLines = wrapText(pdf, scenarioData.reasoning, pageWidth - 2 * margin - 10, 8)
            reasoningLines.forEach(line => {
              pdf.text(line, margin + 10, yPosition)
              yPosition += lineHeight
            })
            yPosition += 2
          }
        }
      })
      
      // Adicionar WVT reasoning se disponível
      if (result.wvtReasoning) {
        yPosition += 8
        pdf.setFontSize(9)
        pdf.setTextColor(59, 130, 246)
        pdf.text('WVT Calculation Logic:', margin + 5, yPosition)
        yPosition += lineHeight
        
        pdf.setFontSize(8)
        pdf.setTextColor(0, 0, 0)
        const wvtLines = wrapText(pdf, result.wvtReasoning, pageWidth - 2 * margin - 10, 8)
        wvtLines.forEach(line => {
          // Verificar se precisa de nova página
          if (yPosition > pageHeight - 40) {
            pdf.addPage()
            yPosition = 40
          }
          
          pdf.text(line, margin + 10, yPosition)
          yPosition += lineHeight
        })
        yPosition += 8
      }
      
      // Dividir o texto da análise em linhas com muito melhor posicionamento
      if (result.fullAnalysis) {
        yPosition += 8
        pdf.setFontSize(9)
        pdf.setTextColor(59, 130, 246)
        pdf.text('Full Analysis:', margin + 5, yPosition)
        yPosition += lineHeight
        
        const maxWidth = pageWidth - 2 * margin - 10
        const analysisLines = wrapText(pdf, result.fullAnalysis, maxWidth, 9)
        
        analysisLines.forEach(line => {
          // Verificar se precisa de nova página
          if (yPosition > pageHeight - 40) {
            pdf.addPage()
            yPosition = 40
          }
          
          pdf.text(line, margin + 5, yPosition)
          yPosition += lineHeight + 1
        })
        
        yPosition += 12
      }
    })

    // Salvar o PDF
    const fileName = `IC_Report_${data.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

    console.log('✅ PDF exportado com sucesso:', fileName)
    return fileName

  } catch (error) {
    console.error('❌ Erro ao exportar PDF:', error)
    throw new Error('Falha ao gerar PDF')
  }
}

// Helper function to properly wrap text and prevent overlap
function wrapText(pdf: jsPDF, text: string, maxWidth: number, fontSize: number): string[] {
  pdf.setFontSize(fontSize)
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    const testWidth = pdf.getTextWidth(testLine)
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}

// Função alternativa usando html2canvas para capturar o elemento visual
export const exportToPDFFromElement = async (elementRef: HTMLElement | null, fileName: string = 'report.pdf') => {
  if (!elementRef) {
    console.error('Elemento de referência não encontrado')
    return
  }

  try {
    // Capturar o elemento como imagem
    const canvas = await html2canvas(elementRef, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    // Criar PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calcular dimensões da imagem
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Adicionar imagem ao PDF
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
    
    // Se a imagem for maior que uma página, adicionar páginas
    if (imgHeight > pageHeight - 20) {
      const pagesNeeded = Math.ceil(imgHeight / (pageHeight - 20))
      
      for (let i = 1; i < pagesNeeded; i++) {
        pdf.addPage()
        const yOffset = -(i * (pageHeight - 20))
        pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight)
      }
    }
    
    // Salvar o PDF
    pdf.save(fileName)
    
    console.log('✅ PDF exportado com sucesso:', fileName)
    return fileName

  } catch (error) {
    console.error('❌ Erro ao exportar PDF:', error)
    throw new Error('Falha ao gerar PDF')
  }
} 
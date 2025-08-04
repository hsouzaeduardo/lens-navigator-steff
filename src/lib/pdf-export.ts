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

    // Configurar fonte
    pdf.setFont('helvetica')
    pdf.setFontSize(16)

    // Título
    pdf.setFillColor(59, 130, 246) // Blue-500
    pdf.rect(0, 0, pageWidth, 30, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.text('AI Investment Committee Report', pageWidth / 2, 20, { align: 'center' })

    // Informações da empresa
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text(`Company: ${data.companyName}`, margin, 45)
    if (data.targetValuation) {
      pdf.text(`Target Valuation: ${data.targetValuation}`, margin, 55)
    }
    pdf.text(`Date: ${data.date}`, margin, 65)

    // Resumo das lentes
    pdf.setFontSize(12)
    pdf.setFillColor(243, 244, 246) // Gray-100
    pdf.rect(margin, 75, pageWidth - 2 * margin, 40, 'F')
    
    let yPosition = 85
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
      
      yPosition += 8
      pdf.setFontSize(11)
    })

    // Cenários de valuation
    yPosition += 10
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Valuation Scenarios:', margin, yPosition)
    
    yPosition += 8
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
        pdf.text(`${scenarioData.probability}%`, x, yPosition + 5)
        pdf.text(scenarioData.value, x, yPosition + 10)
        pdf.setFontSize(10)
      }
    })

    // Sensibilidade e ação
    yPosition += 25
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Key Sensitivity:', margin, yPosition)
    pdf.setFontSize(10)
    pdf.text(data.consensusSensitivity, margin + 5, yPosition + 8)
    
    yPosition += 20
    pdf.setFontSize(11)
    pdf.text('Action Item:', margin, yPosition)
    pdf.setFontSize(10)
    pdf.text(data.actionItem, margin + 5, yPosition + 8)

    // Análises detalhadas
    yPosition += 25
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Detailed Analysis by Lens:', margin, yPosition)

    // Para cada lente, adicionar análise detalhada
    data.results.forEach((result, index) => {
      yPosition += 15
      
      // Verificar se há espaço suficiente na página
      if (yPosition > pageHeight - 50) {
        pdf.addPage()
        yPosition = 30
      }
      
      pdf.setFontSize(11)
      pdf.setFillColor(59, 130, 246)
      pdf.setTextColor(255, 255, 255)
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
      pdf.text(`${result.lens} Lens Analysis`, margin + 5, yPosition)
      
      yPosition += 10
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      
      // Dividir o texto da análise em linhas
      if (result.fullAnalysis) {
        const words = result.fullAnalysis.split(' ')
        let line = ''
        const maxWidth = pageWidth - 2 * margin - 10
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' '
          const testWidth = pdf.getTextWidth(testLine)
          
          if (testWidth > maxWidth && i > 0) {
            pdf.text(line, margin + 5, yPosition)
            line = words[i] + ' '
            yPosition += 4
            
            // Verificar se precisa de nova página
            if (yPosition > pageHeight - 30) {
              pdf.addPage()
              yPosition = 30
            }
          } else {
            line = testLine
          }
        }
        
        if (line) {
          pdf.text(line, margin + 5, yPosition)
          yPosition += 8
        }
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
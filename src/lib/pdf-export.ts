import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import autoTable from 'jspdf-autotable'

// interface ExportData {
//   companyName: string
//   targetValuation?: string
//   results: any[]
//   consensusSensitivity: string
//   actionItem: string
//   date: string
// }

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
    // PDF base
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20

    // helpers de layout
    const lineFactor = 1.35
    pdf.setLineHeightFactor(lineFactor)
    const mmPerPt = 25.4 / 72
    const lineHeight = () => pdf.getFontSize() * lineFactor * mmPerPt
    const ensureSpace = (needed = lineHeight()) => {
      if (yPosition + needed > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
      }
    }

    const drawParagraphs = (raw: string, x = margin + 5, maxW = pageWidth - 2 * margin - 10) => {
      // limpeza leve de Markdown para evitar sobreposição visual
      const cleaned = raw
        .replace(/^#{1,6}\s+/gm, '')       // remove títulos MD
        .replace(/\*\*(.*?)\*\*/g, '$1')   // **negrito** -> texto
        .replace(/_(.*?)_/g, '$1')         // _itálico_ -> texto
        .replace(/`([^`]+)`/g, '$1')       // `code` -> texto
      const paragraphs = cleaned.split(/\r?\n/)

      for (const p of paragraphs) {
        const t = p.trim()
        if (!t) { // linha em branco = espaço de parágrafo
          yPosition += lineHeight() * 0.6
          continue
        }
        const wrapped = pdf.splitTextToSize(t, maxW)
        for (const line of wrapped) {
          ensureSpace()
          pdf.text(line, x, yPosition)
          yPosition += lineHeight()
        }
        yPosition += lineHeight() * 0.4 // espaçamento entre parágrafos
      }
    }

    const tryRenderMarkdownTable = (block: string) => {
      // detecta linhas com '|' e ignora separadores ---|--- 
      const lines = block.split(/\r?\n/).map(l => l.trim())
      const tableLines = lines.filter(l => /\|/.test(l) && !/^[-\s|]+$/.test(l))
      if (tableLines.length < 2) return false

      const rows = tableLines.map(l => l.split('|').map(c => c.trim()).filter(Boolean))
      if (!rows.length) return false

      // header opcional: se a primeira linha parece cabeçalho
      const head = rows[0]
      const body = rows.slice(1)

      ensureSpace(20)
      autoTable(pdf, {
        head: [head],
        body,
        startY: yPosition,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 2 },
        theme: 'grid'
      })
      // @ts-ignore - propriedade adicionada pelo autotable
      yPosition = (pdf as any).lastAutoTable.finalY + 6
      return true
    }

    // Cabeçalho
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(16)
    pdf.setFillColor(59, 130, 246) // Blue-500
    pdf.rect(0, 0, pageWidth, 30, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.text('AI Investment Committee Report', pageWidth / 2, 20, { align: 'center' })

    // Info da empresa
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text(`Company: ${data.companyName}`, margin, 45)
    if (data.targetValuation) pdf.text(`Target Valuation: ${data.targetValuation}`, margin, 55)
    pdf.text(`Date: ${data.date}`, margin, 65)

    // Resumo das lentes
    pdf.setFontSize(12)
    pdf.setFillColor(243, 244, 246) // Gray-100
    pdf.rect(margin, 75, pageWidth - 2 * margin, 40, 'F')

    let yPosition = 85
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)

    data.results.forEach((result) => {
      const x = margin + 5
      const isYes = (result.recommendation || '').toLowerCase().includes('yes')
      const color = isYes ? [34, 197, 94] : [239, 68, 68]
      pdf.setTextColor(color[0], color[1], color[2])
      pdf.text(`${result.lens}: ${result.recommendation}`, x, yPosition)

      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      if (result.entryRange) pdf.text(`Entry Range: ${result.entryRange}`, x + 50, yPosition)
      if (result.conviction) pdf.text(`Conviction: ${result.conviction}`, x + 120, yPosition)

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

    const scenarios = ['Write-Off', 'Bear', 'Base', 'Bull', 'Moonshot'] as const
    const scenarioColors: Array<[number, number, number]> = [
      [239, 68, 68],   // Red
      [245, 158, 11],  // Orange
      [59, 130, 246],  // Blue
      [34, 197, 94],   // Green
      [168, 85, 247]   // Purple
    ]

    scenarios.forEach((scenario, idx) => {
      const x = margin + (idx * 35)
      const color = scenarioColors[idx]
      pdf.setTextColor(color[0], color[1], color[2])
      pdf.text(scenario, x, yPosition)

      // busca qualquer resultado que tenha esse cenário
      const key = scenario.toLowerCase().replace('-', '') as
        'writeoff' | 'bear' | 'base' | 'bull' | 'moonshot'
      const withScenario = data.results.find(r => r.scenarios && r.scenarios[key])
      if (withScenario) {
        const s = withScenario.scenarios![key]
        pdf.setFontSize(8)
        pdf.text(`${s.probability}%`, x, yPosition + 5)
        pdf.text(s.value, x, yPosition + 10)
        pdf.setFontSize(10)
      }
    })

    // Sensibilidade e ação
    yPosition += 25
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Key Sensitivity:', margin, yPosition)
    pdf.setFontSize(10)
    ensureSpace()
    drawParagraphs(data.consensusSensitivity, margin + 5)

    yPosition += 10
    pdf.setFontSize(11)
    pdf.text('Action Item:', margin, yPosition)
    pdf.setFontSize(10)
    ensureSpace()
    drawParagraphs(data.actionItem, margin + 5)

    // Análises detalhadas
    yPosition += 10
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Detailed Analysis by Lens:', margin, yPosition)

    for (const result of data.results) {
      yPosition += 15
      ensureSpace(20)

      // faixa azul da seção
      pdf.setFontSize(11)
      pdf.setFillColor(59, 130, 246)
      pdf.setTextColor(255, 255, 255)
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
      pdf.text(`${result.lens} Lens Analysis`, margin + 5, yPosition)

      yPosition += 10
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)

      if (result.fullAnalysis) {
        // divide o texto em blocos por linhas em branco duplas (ou título/tabela)
        const blocks = result.fullAnalysis.split(/\n{2,}/)

        for (const block of blocks) {
          // tenta tabela Markdown primeiro
          const rendered = tryRenderMarkdownTable(block)
          if (rendered) continue

          // caso contrário, imprime como parágrafo(s) com quebra automática
          drawParagraphs(block)
        }
        yPosition += 2
      }
    }

    // Salvar
    const fileName = `IC_Report_${data.companyName.replace(/\s+/g, '_')}_${new Date()
      .toISOString().split('T')[0]}.pdf`
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

// Abre uma nova janela com o conteúdo do elemento para pré-visualização de impressão
export const openPrintPreviewFromElement = (elementRef: HTMLElement | null, options: { title?: string; css?: string; autoPrint?: boolean } = {}) => {
  if (!elementRef) {
    console.error('Elemento de referência não encontrado para preview')
    return
  }

  try {
    const htmlContent = elementRef.innerHTML
    const title = options.title || 'Print Preview'
    const extraCss = options.css || ''
    const autoPrint = !!options.autoPrint

    const w = window.open('', '_blank', 'noopener,noreferrer')
    if (!w) {
      console.error('Não foi possível abrir a janela de pré-visualização. Verifique o bloqueador de pop-ups.')
      return
    }

    w.document.open()
    w.document.write(`
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          /* básico para garantir leitura e boa impressão */
          body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin: 20px; color: #000; }
          img { max-width: 100%; height: auto; }
          ${extraCss}
          @media print { #preview-toolbar { display: none; } }
        </style>
      </head>
      <body>
        <div id="print-root">
          ${htmlContent}
        </div>

        <div id="preview-toolbar" style="position: fixed; top: 10px; right: 10px; z-index: 9999;">
          <button id="printBtn" style="margin-right:8px;">Imprimir</button>
          <button id="closeBtn">Fechar</button>
        </div>

        <script>
          document.getElementById('printBtn').addEventListener('click', function () { window.print(); });
          document.getElementById('closeBtn').addEventListener('click', function () { window.close(); });
          ${autoPrint ? "setTimeout(function(){ window.print(); }, 200);" : ''}
        </script>
      </body>
      </html>
    `)
    w.document.close()
    w.focus()

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
    styles.forEach(n => w.document.head.appendChild(n.cloneNode(true)));

  } catch (err) {
    console.error('Erro ao abrir preview de impressão:', err)
  }
}
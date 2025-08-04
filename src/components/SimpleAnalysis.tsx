import { useState } from 'react'
import { useAzureOpenAI } from '@/hooks/use-azure-openai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export const SimpleAnalysis = () => {
  const [companyName, setCompanyName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<string>('')
  
  const { analyzeCompany, isLoading, error } = useAzureOpenAI()

  const handleAnalyze = async () => {
    if (!companyName.trim() || !prompt.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome da empresa e o prompt",
        variant: "destructive"
      })
      return
    }

    const response = await analyzeCompany({
      companyName: companyName.trim(),
      lens: 'Custom',
      prompt: prompt.trim()
    })

    if (response.success) {
      setResult(response.analysis || '')
      toast({
        title: "Análise concluída",
        description: "Análise gerada com sucesso!"
      })
    } else {
      toast({
        title: "Erro na análise",
        description: response.error || "Erro desconhecido",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Análise Simples com Azure OpenAI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium">
            Nome da Empresa
          </label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Digite o nome da empresa..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium">
            Prompt de Análise
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Digite o prompt para análise..."
            rows={4}
          />
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Analisando...' : 'Analisar Empresa'}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Resultado da Análise:</label>
            <div className="p-4 bg-gray-50 border rounded-md">
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
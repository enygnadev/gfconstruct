
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Calculator,
  ArrowLeft,
  Save,
  Share,
  Download,
  TrendingUp,
  DollarSign,
  Home,
  Building,
  Hammer,
  PaintBucket,
  Zap,
  Droplets,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'

interface CostBreakdown {
  categoria: string
  valor: number
  porcentagem: number
  itens: { nome: string; valor: number; unidade: string }[]
}

interface ProjectCalculation {
  id?: string
  userId: string
  nomeCliente: string
  tipoObra: string
  area: number
  padrao: string
  localizacao: string
  custoTotal: number
  breakdown: CostBreakdown[]
  dataCalculo: Date
  observacoes: string
}

export default function CalculadoraPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [savedCalculations, setSavedCalculations] = useState<ProjectCalculation[]>([])
  
  const [projectData, setProjectData] = useState({
    nomeCliente: '',
    tipoObra: 'casa',
    area: '',
    padrao: 'medio',
    localizacao: '',
    observacoes: ''
  })

  const [calculation, setCalculation] = useState<ProjectCalculation | null>(null)

  // Tabela de custos por m² atualizada para SC
  const costTable = {
    casa: {
      popular: { min: 1200, max: 1500 },
      medio: { min: 1500, max: 2000 },
      alto: { min: 2000, max: 2800 },
      luxo: { min: 2800, max: 4000 }
    },
    sobrado: {
      popular: { min: 1300, max: 1600 },
      medio: { min: 1600, max: 2200 },
      alto: { min: 2200, max: 3000 },
      luxo: { min: 3000, max: 4500 }
    },
    apartamento: {
      popular: { min: 1100, max: 1400 },
      medio: { min: 1400, max: 1900 },
      alto: { min: 1900, max: 2600 },
      luxo: { min: 2600, max: 3800 }
    },
    comercial: {
      popular: { min: 1000, max: 1300 },
      medio: { min: 1300, max: 1800 },
      alto: { min: 1800, max: 2500 },
      luxo: { min: 2500, max: 3500 }
    }
  }

  useEffect(() => {
    if (user) {
      loadSavedCalculations()
    }
  }, [user])

  const loadSavedCalculations = async () => {
    if (!user) return
    
    try {
      const q = query(
        collection(db, 'calculations'),
        where('userId', '==', user.uid)
      )
      const querySnapshot = await getDocs(q)
      const calculations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectCalculation[]
      
      setSavedCalculations(calculations)
    } catch (error) {
      console.error('Erro ao carregar cálculos:', error)
    }
  }

  const calculateCost = () => {
    const area = parseFloat(projectData.area)
    if (!area || area <= 0) return

    const costs = costTable[projectData.tipoObra as keyof typeof costTable][projectData.padrao as keyof typeof costTable.casa]
    const baseCost = (costs.min + costs.max) / 2
    const totalCost = area * baseCost

    // Breakdown detalhado
    const breakdown: CostBreakdown[] = [
      {
        categoria: 'Fundação e Estrutura',
        valor: totalCost * 0.25,
        porcentagem: 25,
        itens: [
          { nome: 'Escavação e Fundação', valor: totalCost * 0.12, unidade: 'm³' },
          { nome: 'Estrutura de Concreto', valor: totalCost * 0.13, unidade: 'm³' }
        ]
      },
      {
        categoria: 'Alvenaria e Cobertura',
        valor: totalCost * 0.20,
        porcentagem: 20,
        itens: [
          { nome: 'Alvenaria', valor: totalCost * 0.12, unidade: 'm²' },
          { nome: 'Cobertura', valor: totalCost * 0.08, unidade: 'm²' }
        ]
      },
      {
        categoria: 'Instalações',
        valor: totalCost * 0.15,
        porcentagem: 15,
        itens: [
          { nome: 'Elétrica', valor: totalCost * 0.08, unidade: 'pontos' },
          { nome: 'Hidráulica', valor: totalCost * 0.07, unidade: 'pontos' }
        ]
      },
      {
        categoria: 'Esquadrias',
        valor: totalCost * 0.12,
        porcentagem: 12,
        itens: [
          { nome: 'Portas', valor: totalCost * 0.06, unidade: 'unid' },
          { nome: 'Janelas', valor: totalCost * 0.06, unidade: 'm²' }
        ]
      },
      {
        categoria: 'Acabamentos',
        valor: totalCost * 0.20,
        porcentagem: 20,
        itens: [
          { nome: 'Pisos e Revestimentos', valor: totalCost * 0.12, unidade: 'm²' },
          { nome: 'Pintura', valor: totalCost * 0.08, unidade: 'm²' }
        ]
      },
      {
        categoria: 'Diversos',
        valor: totalCost * 0.08,
        porcentagem: 8,
        itens: [
          { nome: 'Limpeza e Finalização', valor: totalCost * 0.03, unidade: 'm²' },
          { nome: 'Projetos e Taxas', valor: totalCost * 0.05, unidade: 'vb' }
        ]
      }
    ]

    const newCalculation: ProjectCalculation = {
      userId: user?.uid || '',
      nomeCliente: projectData.nomeCliente,
      tipoObra: projectData.tipoObra,
      area,
      padrao: projectData.padrao,
      localizacao: projectData.localizacao,
      custoTotal: totalCost,
      breakdown,
      dataCalculo: new Date(),
      observacoes: projectData.observacoes
    }

    setCalculation(newCalculation)
  }

  const saveCalculation = async () => {
    if (!calculation || !user) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'calculations'), calculation)
      await loadSavedCalculations()
      alert('Cálculo salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar cálculo')
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = () => {
    if (!calculation) return
    
    // Simular exportação para PDF
    const content = `
ORÇAMENTO DE CONSTRUÇÃO

Cliente: ${calculation.nomeCliente}
Tipo: ${calculation.tipoObra}
Área: ${calculation.area}m²
Padrão: ${calculation.padrao}
Localização: ${calculation.localizacao}

CUSTO TOTAL: R$ ${calculation.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

BREAKDOWN:
${calculation.breakdown.map(item => 
  `${item.categoria}: R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${item.porcentagem}%)`
).join('\n')}

Data: ${calculation.dataCalculo.toLocaleDateString('pt-BR')}
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orcamento-${calculation.nomeCliente.replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  💰 Calculadora de Custos Inteligente
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Estimativas precisas baseadas em dados regionais de SC
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <Calculator className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="calculadora" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="calculadora">🧮 Nova Calculação</TabsTrigger>
              <TabsTrigger value="resultados">📊 Resultados</TabsTrigger>
              <TabsTrigger value="historico">📋 Histórico</TabsTrigger>
            </TabsList>

            {/* Tab Calculadora */}
            <TabsContent value="calculadora">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-green-600" />
                      Dados do Projeto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cliente">Nome do Cliente</Label>
                      <Input
                        id="cliente"
                        placeholder="Ex: João Silva"
                        value={projectData.nomeCliente}
                        onChange={(e) => setProjectData(prev => ({ ...prev, nomeCliente: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tipo">Tipo de Obra</Label>
                      <select
                        id="tipo"
                        className="w-full p-2 border rounded-md"
                        value={projectData.tipoObra}
                        onChange={(e) => setProjectData(prev => ({ ...prev, tipoObra: e.target.value }))}
                      >
                        <option value="casa">Casa Térrea</option>
                        <option value="sobrado">Sobrado</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="comercial">Comercial</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="area">Área Total (m²)</Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="Ex: 150"
                        value={projectData.area}
                        onChange={(e) => setProjectData(prev => ({ ...prev, area: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="padrao">Padrão de Acabamento</Label>
                      <select
                        id="padrao"
                        className="w-full p-2 border rounded-md"
                        value={projectData.padrao}
                        onChange={(e) => setProjectData(prev => ({ ...prev, padrao: e.target.value }))}
                      >
                        <option value="popular">Popular (R$ 1.200-1.500/m²)</option>
                        <option value="medio">Médio (R$ 1.500-2.000/m²)</option>
                        <option value="alto">Alto (R$ 2.000-2.800/m²)</option>
                        <option value="luxo">Luxo (R$ 2.800+/m²)</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input
                        id="localizacao"
                        placeholder="Ex: Florianópolis, SC"
                        value={projectData.localizacao}
                        onChange={(e) => setProjectData(prev => ({ ...prev, localizacao: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Input
                        id="observacoes"
                        placeholder="Observações especiais..."
                        value={projectData.observacoes}
                        onChange={(e) => setProjectData(prev => ({ ...prev, observacoes: e.target.value }))}
                      />
                    </div>

                    <Button
                      onClick={calculateCost}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600"
                      disabled={!projectData.area || !projectData.nomeCliente}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calcular Orçamento
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      Tabela de Referência SC
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="font-medium">Tipo de Obra</div>
                        <div className="font-medium">Faixa de Preço/m²</div>
                      </div>

                      {Object.entries(costTable).map(([tipo, padroes]) => (
                        <div key={tipo} className="border-t pt-2">
                          <div className="font-medium text-slate-700 dark:text-slate-300 mb-2 capitalize">
                            {tipo}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(padroes).map(([padrao, valores]) => (
                              <div key={padrao} className="flex justify-between">
                                <span className="capitalize">{padrao}:</span>
                                <span>R$ {valores.min}-{valores.max}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        💡 Dicas para SC:
                      </h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Mão de obra qualificada disponível</li>
                        <li>• Materiais locais reduzem custos</li>
                        <li>• Considere clima subtropical</li>
                        <li>• Logística favorável em SC</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Resultados */}
            <TabsContent value="resultados">
              {calculation ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          Resumo do Orçamento
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={saveCalculation} disabled={loading}>
                            <Save className="h-4 w-4 mr-1" />
                            Salvar
                          </Button>
                          <Button variant="outline" size="sm" onClick={exportToPDF}>
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">
                            R$ {calculation.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Custo Total Estimado
                          </div>
                          <div className="text-sm text-green-600 mt-1">
                            R$ {(calculation.custoTotal / calculation.area).toFixed(0)}/m²
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Cliente: <span className="font-medium">{calculation.nomeCliente}</span></div>
                          <div>Tipo: <span className="font-medium">{calculation.tipoObra}</span></div>
                          <div>Área: <span className="font-medium">{calculation.area}m²</span></div>
                          <div>Padrão: <span className="font-medium">{calculation.padrao}</span></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Breakdown Detalhado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {calculation.breakdown.map((item, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{item.categoria}</h4>
                              <Badge>{item.porcentagem}%</Badge>
                            </div>
                            <div className="text-lg font-bold text-green-600 mb-2">
                              R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <div className="space-y-1">
                              {item.itens.map((subitem, i) => (
                                <div key={i} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                  <span>{subitem.nome}</span>
                                  <span>R$ {subitem.valor.toLocaleString('pt-BR')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Faça uma calculação para ver os resultados aqui
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab Histórico */}
            <TabsContent value="historico">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Cálculos Salvos ({savedCalculations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedCalculations.length > 0 ? (
                    <div className="space-y-4">
                      {savedCalculations.map((calc, index) => (
                        <div key={calc.id || index} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{calc.nomeCliente}</h4>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {calc.tipoObra} • {calc.area}m² • {calc.padrao}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {calc.localizacao}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                R$ {calc.custoTotal.toLocaleString('pt-BR')}
                              </div>
                              <div className="text-xs text-gray-500">
                                {calc.dataCalculo.toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum cálculo salvo ainda
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

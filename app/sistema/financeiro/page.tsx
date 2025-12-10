
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  DollarSign,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Building,
  PiggyBank,
  Calculator,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
  BarChart3
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

interface FluxoCaixa {
  mes: number
  entrada: number
  saida: number
  saldo: number
  saldoAcumulado: number
}

interface FinanciamentoSimulation {
  valorTotal: number
  entrada: number
  valorFinanciado: number
  prazoMeses: number
  taxaJuros: number
  prestacao: number
  totalJuros: number
  totalPago: number
}

export default function FinanceiroPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [fluxoData, setFluxoData] = useState({
    valorObra: '',
    prazoMeses: '',
    entradaPercent: '30',
    parcelamento: 'medicao'
  })

  const [fluxoCaixa, setFluxoCaixa] = useState<FluxoCaixa[]>([])
  const [financiamento, setFinanciamento] = useState<FinanciamentoSimulation | null>(null)

  const calcularFluxoCaixa = () => {
    const valorTotal = parseFloat(fluxoData.valorObra)
    const prazo = parseInt(fluxoData.prazoMeses)
    const entradaPerc = parseFloat(fluxoData.entradaPercent) / 100

    if (!valorTotal || !prazo) return

    const entrada = valorTotal * entradaPerc
    const valorRestante = valorTotal - entrada
    
    const fluxo: FluxoCaixa[] = []
    let saldoAcumulado = entrada

    // Cronograma de desembolso típico para construção
    const cronogramaPadrao = [
      { mes: 1, perc: 0.15 }, // Fundação
      { mes: 2, perc: 0.12 }, // Estrutura inicial
      { mes: 3, perc: 0.10 }, // Estrutura
      { mes: 4, perc: 0.08 },  // Alvenaria
      { mes: 5, perc: 0.08 },  // Cobertura
      { mes: 6, perc: 0.07 },  // Instalações
      { mes: 7, perc: 0.07 },  // Instalações
      { mes: 8, perc: 0.08 },  // Esquadrias
      { mes: 9, perc: 0.10 },  // Acabamentos
      { mes: 10, perc: 0.08 }, // Acabamentos
      { mes: 11, perc: 0.04 }, // Limpeza
      { mes: 12, perc: 0.03 }  // Entrega
    ]

    for (let i = 0; i < prazo; i++) {
      const cronograma = cronogramaPadrao[i] || { mes: i + 1, perc: 0.05 }
      const saida = valorTotal * cronograma.perc
      const entradaValue = i === 0 ? entrada : 0
      const saldo = entrada - saida
      saldoAcumulado += saldo

      fluxo.push({
        mes: i + 1,
        entrada: entradaValue,
        saida,
        saldo,
        saldoAcumulado
      })
    }

    setFluxoCaixa(fluxo)
  }

  const simularFinanciamento = () => {
    const valorTotal = parseFloat(fluxoData.valorObra)
    const entrada = valorTotal * 0.3 // 30% entrada padrão
    const valorFinanciado = valorTotal - entrada
    const prazoMeses = 360 // 30 anos
    const taxaJuros = 0.009 // 0.9% ao mês (aproximadamente 11.4% ao ano)

    const prestacao = (valorFinanciado * taxaJuros * Math.pow(1 + taxaJuros, prazoMeses)) / 
                     (Math.pow(1 + taxaJuros, prazoMeses) - 1)
    
    const totalPago = prestacao * prazoMeses + entrada
    const totalJuros = totalPago - valorTotal

    const simulacao: FinanciamentoSimulation = {
      valorTotal,
      entrada,
      valorFinanciado,
      prazoMeses,
      taxaJuros: taxaJuros * 12 * 100, // Taxa anual em %
      prestacao,
      totalJuros,
      totalPago
    }

    setFinanciamento(simulacao)
  }

  const salvarFluxoCaixa = async () => {
    if (!user || fluxoCaixa.length === 0) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'fluxo_caixa'), {
        userId: user.uid,
        valorObra: fluxoData.valorObra,
        prazoMeses: fluxoData.prazoMeses,
        fluxoCaixa,
        dataCalculo: new Date()
      })
      alert('Fluxo de caixa salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar fluxo de caixa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                  💰 Módulo Financeiro Inteligente
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Fluxo de Caixa, Financiamento e Simulações Avançadas
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <DollarSign className="h-3 w-3 mr-1" />
                Financeiro Ativo
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Valor Médio Obras</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">R$ 285k</p>
                  </div>
                  <Building className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12%</span>
                  <span className="text-green-500 ml-1">vs último ano</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Taxa Juros Média</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">11.4%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">-0.8%</span>
                  <span className="text-blue-500 ml-1">vs último mês</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Prazo Médio</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">8.5 meses</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">Dentro prazo</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">ROI Médio</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">18.5%</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+2.1%</span>
                  <span className="text-orange-500 ml-1">acima meta</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="fluxo" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="fluxo">💰 Fluxo de Caixa</TabsTrigger>
              <TabsTrigger value="financiamento">🏦 Financiamento</TabsTrigger>
              <TabsTrigger value="simulacao">📊 Simulações</TabsTrigger>
              <TabsTrigger value="relatorios">📋 Relatórios</TabsTrigger>
            </TabsList>

            {/* Tab Fluxo de Caixa */}
            <TabsContent value="fluxo">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-green-600" />
                      Configuração do Fluxo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="valorObra">Valor Total da Obra (R$)</Label>
                      <Input
                        id="valorObra"
                        type="number"
                        placeholder="Ex: 300000"
                        value={fluxoData.valorObra}
                        onChange={(e) => setFluxoData(prev => ({ ...prev, valorObra: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="prazoMeses">Prazo da Obra (meses)</Label>
                      <Input
                        id="prazoMeses"
                        type="number"
                        placeholder="Ex: 12"
                        value={fluxoData.prazoMeses}
                        onChange={(e) => setFluxoData(prev => ({ ...prev, prazoMeses: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="entrada">Entrada (%)</Label>
                      <select
                        id="entrada"
                        className="w-full p-2 border rounded-md"
                        value={fluxoData.entradaPercent}
                        onChange={(e) => setFluxoData(prev => ({ ...prev, entradaPercent: e.target.value }))}
                      >
                        <option value="20">20% - Entrada mínima</option>
                        <option value="30">30% - Recomendado</option>
                        <option value="40">40% - Entrada alta</option>
                        <option value="50">50% - Entrada máxima</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="parcelamento">Tipo de Parcelamento</Label>
                      <select
                        id="parcelamento"
                        className="w-full p-2 border rounded-md"
                        value={fluxoData.parcelamento}
                        onChange={(e) => setFluxoData(prev => ({ ...prev, parcelamento: e.target.value }))}
                      >
                        <option value="medicao">Por Medição de Obra</option>
                        <option value="mensal">Parcelas Mensais Fixas</option>
                        <option value="etapas">Por Etapas da Obra</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={calcularFluxoCaixa}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                        disabled={!fluxoData.valorObra || !fluxoData.prazoMeses}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Calcular Fluxo
                      </Button>
                      
                      {fluxoCaixa.length > 0 && (
                        <Button
                          onClick={salvarFluxoCaixa}
                          variant="outline"
                          disabled={loading}
                        >
                          Salvar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Fluxo de Caixa Projetado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fluxoCaixa.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              R$ {fluxoCaixa.reduce((acc, item) => acc + item.entrada, 0).toLocaleString('pt-BR')}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Total Entradas</div>
                          </div>
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="text-lg font-bold text-red-600">
                              R$ {fluxoCaixa.reduce((acc, item) => acc + item.saida, 0).toLocaleString('pt-BR')}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Total Saídas</div>
                          </div>
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">
                              R$ {fluxoCaixa[fluxoCaixa.length - 1]?.saldoAcumulado.toLocaleString('pt-BR')}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Saldo Final</div>
                          </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white dark:bg-slate-800">
                              <tr className="border-b">
                                <th className="text-left p-2">Mês</th>
                                <th className="text-right p-2">Entrada</th>
                                <th className="text-right p-2">Saída</th>
                                <th className="text-right p-2">Saldo</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fluxoCaixa.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <td className="p-2">{item.mes}º</td>
                                  <td className={`p-2 text-right ${item.entrada > 0 ? 'text-green-600' : ''}`}>
                                    R$ {item.entrada.toLocaleString('pt-BR')}
                                  </td>
                                  <td className="p-2 text-right text-red-600">
                                    R$ {item.saida.toLocaleString('pt-BR')}
                                  </td>
                                  <td className={`p-2 text-right font-medium ${item.saldoAcumulado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    R$ {item.saldoAcumulado.toLocaleString('pt-BR')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Configure e calcule o fluxo de caixa
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Financiamento */}
            <TabsContent value="financiamento">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      Simulação de Financiamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        🏦 Opções Disponíveis em SC:
                      </h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• <strong>Minha Casa Minha Vida</strong> - Até R$ 350k</li>
                        <li>• <strong>Financiamento SBPE</strong> - Acima R$ 350k</li>
                        <li>• <strong>Consórcio</strong> - Sem juros, com lance</li>
                        <li>• <strong>Poupança CEF</strong> - Taxa diferenciada</li>
                      </ul>
                    </div>

                    <Button
                      onClick={simularFinanciamento}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      disabled={!fluxoData.valorObra}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Simular Financiamento
                    </Button>

                    {financiamento && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>Valor Total: <span className="font-bold">R$ {financiamento.valorTotal.toLocaleString('pt-BR')}</span></div>
                          <div>Entrada (30%): <span className="font-bold">R$ {financiamento.entrada.toLocaleString('pt-BR')}</span></div>
                          <div>Financiado: <span className="font-bold">R$ {financiamento.valorFinanciado.toLocaleString('pt-BR')}</span></div>
                          <div>Taxa/ano: <span className="font-bold">{financiamento.taxaJuros.toFixed(1)}%</span></div>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            R$ {financiamento.prestacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Prestação em 30 anos
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="h-5 w-5 text-purple-600" />
                      Alternativas de Pagamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">💰 Pagamento à Vista</h4>
                        <div className="text-lg font-bold text-green-600 mb-1">
                          Desconto: 8-12%
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Economia significativa sem juros de financiamento
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">📅 Parcelamento Direto</h4>
                        <div className="text-lg font-bold text-blue-600 mb-1">
                          Entrada: 30% + 12x
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Parcelamento durante a construção
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">🏗️ Por Etapas de Obra</h4>
                        <div className="text-lg font-bold text-purple-600 mb-1">
                          8 medições
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pagamento conforme evolução da obra
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">🤝 Consórcio</h4>
                        <div className="text-lg font-bold text-orange-600 mb-1">
                          Sem juros
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Taxa administrativa + possibilidade de lance
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Simulações */}
            <TabsContent value="simulacao">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Simulação de Impacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                          Mudança de Escopo
                        </h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Ampliação +20m²:</span>
                            <span className="font-bold text-red-600">+R$ 36.000</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Impacto cronograma:</span>
                            <span className="font-bold text-orange-600">+1.5 meses</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200">
                          Upgrade de Acabamento
                        </h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Médio → Alto padrão:</span>
                            <span className="font-bold text-blue-600">+R$ 75.000</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>ROI adicional:</span>
                            <span className="font-bold text-green-600">+22%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium text-green-800 dark:text-green-200">
                          Sustentabilidade
                        </h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Sistema solar:</span>
                            <span className="font-bold text-green-600">+R$ 25.000</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Economia/ano:</span>
                            <span className="font-bold text-green-600">R$ 3.600</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Payback:</span>
                            <span className="font-bold text-blue-600">6.9 anos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-emerald-600" />
                      Cenários de ROI
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="text-lg font-bold text-red-600">Pessimista</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">12.5%</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">Realista</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">18.5%</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-lg font-bold text-green-600">Otimista</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">24.2%</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Fatores de Impacto:</h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span>Localização privilegiada</span>
                            <Badge className="bg-green-500">+15%</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span>Mercado aquecido SC</span>
                            <Badge className="bg-green-500">+8%</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span>Acabamento diferenciado</span>
                            <Badge className="bg-blue-500">+12%</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span>Tecnologia incorporada</span>
                            <Badge className="bg-purple-500">+6%</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                            <span>Sustentabilidade</span>
                            <Badge className="bg-emerald-500">+4%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Relatórios */}
            <TabsContent value="relatorios">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                      Relatórios Financeiros
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full justify-start" variant="outline">
                        📊 Demonstrativo de Fluxo de Caixa
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        💰 Comparativo de Financiamentos
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        📈 Análise de Viabilidade
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        🎯 Projeção de ROI
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        💼 Relatório Executivo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-cyan-600" />
                      Indicadores do Mercado SC
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="font-medium">Taxa SELIC</div>
                          <div className="text-lg font-bold text-blue-600">11.75%</div>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="font-medium">IPCA (12m)</div>
                          <div className="text-lg font-bold text-green-600">4.62%</div>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="font-medium">CUB/SC</div>
                          <div className="text-lg font-bold text-purple-600">R$ 1.847</div>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="font-medium">Variação m²</div>
                          <div className="text-lg font-bold text-orange-600">+2.1%</div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg">
                        <h4 className="font-medium text-cyan-800 dark:text-cyan-200 mb-2">
                          💡 Insight IA:
                        </h4>
                        <p className="text-sm text-cyan-700 dark:text-cyan-300">
                          Momento favorável para investir em SC. Taxa de juros estável, 
                          mercado imobiliário aquecido e incentivos fiscais ativos.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

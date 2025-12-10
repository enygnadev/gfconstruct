
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  Cloud,
  Truck,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Brain,
  Target,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'

interface CronogramaEtapa {
  id: string
  nome: string
  duracao: number
  inicio: Date
  fim: Date
  dependencias: string[]
  recursos: string[]
  probabilidade: number
  riscos: string[]
  status: 'planejado' | 'em-andamento' | 'concluido' | 'atrasado'
}

interface PredicaoIA {
  etapa: string
  probabilidadeAtraso: number
  diasVariacao: number
  fatoresRisco: string[]
  sugestoes: string[]
}

export default function CronogramaAdaptativoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [etapas, setEtapas] = useState<CronogramaEtapa[]>([])
  const [predicoes, setPredicoes] = useState<PredicaoIA[]>([])
  const [metricsAI, setMetricsAI] = useState({
    eficiencia: 0,
    riscoProjeto: 0,
    otimizacao: 0,
    sustentabilidade: 0
  })

  // Dados de exemplo do cronograma
  const etapasBase: CronogramaEtapa[] = [
    {
      id: '1',
      nome: 'Fundação e Estrutura',
      duracao: 30,
      inicio: new Date(),
      fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      dependencias: [],
      recursos: ['Escavadeira', 'Betoneira', 'Pedreiros'],
      probabilidade: 0.85,
      riscos: ['Chuva', 'Solo instável'],
      status: 'em-andamento'
    },
    {
      id: '2',
      nome: 'Alvenaria e Estrutura',
      duracao: 25,
      inicio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      fim: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      dependencias: ['1'],
      recursos: ['Pedreiros', 'Ajudantes', 'Guincho'],
      probabilidade: 0.92,
      riscos: ['Disponibilidade de materiais'],
      status: 'planejado'
    },
    {
      id: '3',
      nome: 'Cobertura e Telhado',
      duracao: 15,
      inicio: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      fim: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
      dependencias: ['2'],
      recursos: ['Carpinteiros', 'Telhadistas'],
      probabilidade: 0.88,
      riscos: ['Vento forte', 'Chuva'],
      status: 'planejado'
    },
    {
      id: '4',
      nome: 'Instalações Elétricas',
      duracao: 20,
      inicio: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      fim: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      dependencias: ['1'],
      recursos: ['Eletricistas', 'Materiais elétricos'],
      probabilidade: 0.94,
      riscos: ['Aprovação concessionária'],
      status: 'planejado'
    },
    {
      id: '5',
      nome: 'Instalações Hidráulicas',
      duracao: 18,
      inicio: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      fim: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      dependencias: ['1'],
      recursos: ['Encanadores', 'Tubulações'],
      probabilidade: 0.90,
      riscos: ['Vazamentos', 'Pressão da rede'],
      status: 'planejado'
    },
    {
      id: '6',
      nome: 'Acabamentos Internos',
      duracao: 35,
      inicio: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
      fim: new Date(Date.now() + 105 * 24 * 60 * 60 * 1000),
      dependencias: ['3', '4', '5'],
      recursos: ['Pintores', 'Azulejistas', 'Marceneiros'],
      probabilidade: 0.82,
      riscos: ['Complexidade acabamentos', 'Mudanças de escopo'],
      status: 'planejado'
    }
  ]

  useEffect(() => {
    setEtapas(etapasBase)
  }, [])

  const executarAnaliseIA = async () => {
    setIsAnalyzing(true)
    
    // Simular análise IA
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const novasPredicoes: PredicaoIA[] = etapas.map(etapa => ({
      etapa: etapa.nome,
      probabilidadeAtraso: Math.random() * 0.3 + 0.1, // 10-40%
      diasVariacao: Math.floor(Math.random() * 8) - 2, // -2 a +5 dias
      fatoresRisco: etapa.riscos,
      sugestoes: [
        'Paralelizar com outras atividades',
        'Aumentar equipe em 20%',
        'Ordem antecipada de materiais',
        'Contingência climática'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    }))
    
    setPredicoes(novasPredicoes)
    
    setMetricsAI({
      eficiencia: Math.random() * 20 + 75, // 75-95%
      riscoProjeto: Math.random() * 30 + 10, // 10-40%
      otimizacao: Math.random() * 25 + 70, // 70-95%
      sustentabilidade: Math.random() * 15 + 80 // 80-95%
    })
    
    setIsAnalyzing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-500 text-white'
      case 'em-andamento':
        return 'bg-blue-500 text-white'
      case 'atrasado':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                  📅 Cronograma Adaptativo Neural
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  IA Preditiva + Heurística Avançada para Gestão Inteligente
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <Calendar className="h-3 w-3 mr-1" />
                Adaptativo
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <Brain className="h-3 w-3 mr-1" />
                IA Ativa
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Eficiência IA</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {metricsAI.eficiencia.toFixed(1)}%
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 dark:text-red-400">Risco Projeto</p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                        {metricsAI.riscoProjeto.toFixed(1)}%
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Otimização</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {metricsAI.otimizacao.toFixed(1)}%
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">Sustentabilidade</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {metricsAI.sustentabilidade.toFixed(1)}%
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs defaultValue="cronograma" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="cronograma">📊 Timeline</TabsTrigger>
              <TabsTrigger value="predicoes">🧠 Predições IA</TabsTrigger>
              <TabsTrigger value="otimizacao">⚡ Otimização</TabsTrigger>
              <TabsTrigger value="riscos">⚠️ Gestão Riscos</TabsTrigger>
            </TabsList>

            {/* Tab Cronograma */}
            <TabsContent value="cronograma">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Timeline do Projeto</span>
                    <Button
                      onClick={executarAnaliseIA}
                      disabled={isAnalyzing}
                      className="bg-gradient-to-r from-purple-500 to-pink-600"
                    >
                      {isAnalyzing ? (
                        <>
                          <Brain className="h-4 w-4 mr-2 animate-spin" />
                          Analisando IA...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Executar Análise IA
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {etapas.map((etapa, index) => (
                      <motion.div
                        key={etapa.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(etapa.status)}>
                              {etapa.status}
                            </Badge>
                            <h3 className="font-semibold">{etapa.nome}</h3>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {etapa.duracao} dias
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Início:</span> {etapa.inicio.toLocaleDateString('pt-BR')}
                          </div>
                          <div>
                            <span className="font-medium">Fim:</span> {etapa.fim.toLocaleDateString('pt-BR')}
                          </div>
                          <div>
                            <span className="font-medium">Probabilidade:</span> {(etapa.probabilidade * 100).toFixed(0)}%
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {etapa.recursos.map((recurso, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {recurso}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Predições IA */}
            <TabsContent value="predicoes">
              {predicoes.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {predicoes.map((predicao, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-2 border-purple-200 dark:border-purple-700">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-600" />
                            {predicao.etapa}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div className="text-xl font-bold text-red-600">
                                  {(predicao.probabilidadeAtraso * 100).toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Risco Atraso
                                </div>
                              </div>
                              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-xl font-bold text-blue-600">
                                  {predicao.diasVariacao > 0 ? '+' : ''}{predicao.diasVariacao}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Variação Dias
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Fatores de Risco:</h4>
                              <div className="space-y-1">
                                {predicao.fatoresRisco.map((fator, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                                    {fator}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Sugestões IA:</h4>
                              <div className="space-y-1">
                                {predicao.sugestoes.map((sugestao, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {sugestao}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Execute a análise IA para ver as predições avançadas
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab Otimização */}
            <TabsContent value="otimizacao">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-green-200 dark:border-green-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      Oportunidades de Otimização
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-semibold text-green-800 dark:text-green-200">
                          Paralelização Inteligente
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Elétrica e hidráulica podem ser executadas simultaneamente, reduzindo 12 dias.
                        </p>
                        <div className="mt-2">
                          <Badge className="bg-green-500 text-white">Economia: 12 dias</Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                          Antecipação de Materiais
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Pedidos antecipados podem evitar 5-8 dias de espera por materiais.
                        </p>
                        <div className="mt-2">
                          <Badge className="bg-blue-500 text-white">Redução: 8 dias</Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                          Equipe Adaptável
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                          Realocar 2 pedreiros para acabamentos acelera entrega em 6 dias.
                        </p>
                        <div className="mt-2">
                          <Badge className="bg-purple-500 text-white">Melhoria: 6 dias</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200 dark:border-orange-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      Impacto das Otimizações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-orange-600">-26 dias</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Redução Total Estimada
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-lg font-bold text-green-600">R$ 45.000</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Economia Custos</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">+23%</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Eficiência</div>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600">
                        Aplicar Otimizações Sugeridas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Riscos */}
            <TabsContent value="riscos">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-red-200 dark:border-red-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Matriz de Riscos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { nome: 'Chuvas Intensas', probabilidade: 'Alta', impacto: 'Médio', dias: '+5-12' },
                        { nome: 'Falta de Materiais', probabilidade: 'Média', impacto: 'Alto', dias: '+8-15' },
                        { nome: 'Equipe Indisponível', probabilidade: 'Baixa', impacto: 'Alto', dias: '+10-20' },
                        { nome: 'Aprovações Pendentes', probabilidade: 'Média', impacto: 'Baixo', dias: '+2-5' }
                      ].map((risco, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{risco.nome}</h4>
                            <Badge
                              className={
                                risco.probabilidade === 'Alta' ? 'bg-red-500' :
                                risco.probabilidade === 'Média' ? 'bg-yellow-500' : 'bg-green-500'
                              }
                            >
                              {risco.probabilidade}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Impacto: <span className="font-medium">{risco.impacto}</span></div>
                            <div>Atraso: <span className="font-medium">{risco.dias} dias</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-emerald-200 dark:border-emerald-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      Planos de Contingência
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">
                          🌧️ Proteção Climática
                        </h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                          Tendas e lonas disponíveis para continuidade em chuvas leves.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                          📦 Estoque de Segurança
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          20% extra de materiais críticos em estoque local.
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                          👥 Equipe Reserva
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                          Profissionais qualificados em standby para substituições.
                        </p>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600">
                        Ativar Protocolos de Contingência
                      </Button>
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

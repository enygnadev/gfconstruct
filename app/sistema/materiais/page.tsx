
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Package,
  ArrowLeft,
  Search,
  Filter,
  ShoppingCart,
  Star,
  TrendingUp,
  MapPin,
  Truck,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Globe,
  Target,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'

interface Material {
  id: string
  nome: string
  categoria: string
  preco: number
  unidade: string
  fornecedor: string
  avaliacao: number
  disponibilidade: string
  prazoEntrega: number
  localizacao: string
  descricao: string
  especificacoes: string[]
  imagem: string
  promocao?: boolean
  desconto?: number
}

interface Fornecedor {
  id: string
  nome: string
  avaliacao: number
  entregas: number
  localizacao: string
  especialidades: string[]
  verificado: boolean
  telefone: string
  email: string
}

export default function MateriaisPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [carrinho, setCarrinho] = useState<Material[]>([])

  // Base de dados de materiais para SC
  const materiais: Material[] = [
    {
      id: '1',
      nome: 'Tijolo Cerâmico 6 Furos',
      categoria: 'alvenaria',
      preco: 0.89,
      unidade: 'unid',
      fornecedor: 'Cerâmica Tijucas',
      avaliacao: 4.8,
      disponibilidade: 'Em estoque',
      prazoEntrega: 2,
      localizacao: 'Tijucas, SC',
      descricao: 'Tijolo cerâmico de alta qualidade para alvenaria de vedação',
      especificacoes: ['9x14x19cm', 'Resistência 2,5 MPa', 'Absorção 20%'],
      imagem: '/placeholder.svg',
      promocao: true,
      desconto: 15
    },
    {
      id: '2',
      nome: 'Cimento Portland CP II-Z-32',
      categoria: 'cimento',
      preco: 28.90,
      unidade: 'saco 50kg',
      fornecedor: 'Votorantim Cimentos',
      avaliacao: 4.9,
      disponibilidade: 'Em estoque',
      prazoEntrega: 1,
      localizacao: 'Imbituba, SC',
      descricao: 'Cimento de alta qualidade para estruturas e acabamentos',
      especificacoes: ['Resistência 32 MPa', 'Pega normal', 'Baixo calor'],
      imagem: '/placeholder.svg'
    },
    {
      id: '3',
      nome: 'Areia Média Lavada',
      categoria: 'areia',
      preco: 95.00,
      unidade: 'm³',
      fornecedor: 'Mineração Palhoça',
      avaliacao: 4.6,
      disponibilidade: 'Em estoque',
      prazoEntrega: 1,
      localizacao: 'Palhoça, SC',
      descricao: 'Areia média lavada para argamassa e concreto',
      especificacoes: ['Módulo finura 2,4', 'Isenta impurezas', 'Granulometria uniforme'],
      imagem: '/placeholder.svg'
    },
    {
      id: '4',
      nome: 'Telha Cerâmica Colonial',
      categoria: 'cobertura',
      preco: 2.45,
      unidade: 'unid',
      fornecedor: 'Cerâmica Angeloni',
      avaliacao: 4.7,
      disponibilidade: 'Estoque limitado',
      prazoEntrega: 3,
      localizacao: 'São José, SC',
      descricao: 'Telha colonial tradicional para cobertura residencial',
      especificacoes: ['40x24cm', 'Absorção 12%', 'Cor natural'],
      imagem: '/placeholder.svg'
    },
    {
      id: '5',
      nome: 'Tinta Acrílica Premium',
      categoria: 'tintas',
      preco: 89.90,
      unidade: 'lata 18L',
      fornecedor: 'Tintas Renner',
      avaliacao: 4.8,
      disponibilidade: 'Em estoque',
      prazoEntrega: 2,
      localizacao: 'Gravataí, RS',
      descricao: 'Tinta acrílica premium para áreas internas e externas',
      especificacoes: ['Lavável', 'Antibacteriana', 'Múltiplas cores'],
      imagem: '/placeholder.svg',
      promocao: true,
      desconto: 20
    },
    {
      id: '6',
      nome: 'Ferro CA-50 12mm',
      categoria: 'ferro',
      preco: 4.80,
      unidade: 'kg',
      fornecedor: 'Gerdau',
      avaliacao: 4.9,
      disponibilidade: 'Em estoque',
      prazoEntrega: 1,
      localizacao: 'Capivari de Baixo, SC',
      descricao: 'Vergalhão de aço CA-50 para estruturas de concreto armado',
      especificacoes: ['Diâmetro 12mm', 'Barra 12m', 'Nervurado'],
      imagem: '/placeholder.svg'
    }
  ]

  const fornecedores: Fornecedor[] = [
    {
      id: '1',
      nome: 'Cerâmica Tijucas',
      avaliacao: 4.8,
      entregas: 1250,
      localizacao: 'Tijucas, SC',
      especialidades: ['Cerâmica', 'Tijolos', 'Telhas'],
      verificado: true,
      telefone: '(48) 3263-0000',
      email: 'vendas@ceramicatijucas.com.br'
    },
    {
      id: '2',
      nome: 'Votorantim Cimentos',
      avaliacao: 4.9,
      entregas: 2890,
      localizacao: 'Imbituba, SC',
      especialidades: ['Cimento', 'Argamassa', 'Concreto'],
      verificado: true,
      telefone: '(48) 3255-8000',
      email: 'vendas.sc@votorantim.com'
    },
    {
      id: '3',
      nome: 'Mineração Palhoça',
      avaliacao: 4.6,
      entregas: 890,
      localizacao: 'Palhoça, SC',
      especialidades: ['Areia', 'Brita', 'Agregados'],
      verificado: true,
      telefone: '(48) 3242-1500',
      email: 'comercial@minpalhoca.com.br'
    }
  ]

  const categorias = [
    { id: 'todos', nome: 'Todos Materiais', icon: Package },
    { id: 'alvenaria', nome: 'Alvenaria', icon: Package },
    { id: 'cimento', nome: 'Cimento', icon: Package },
    { id: 'areia', nome: 'Areia e Brita', icon: Package },
    { id: 'cobertura', nome: 'Cobertura', icon: Package },
    { id: 'tintas', nome: 'Tintas', icon: Package },
    { id: 'ferro', nome: 'Ferro e Aço', icon: Package }
  ]

  const materiaisFiltrados = materiais.filter(material => {
    const matchCategory = selectedCategory === 'todos' || material.categoria === selectedCategory
    const matchSearch = material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       material.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  const adicionarAoCarrinho = (material: Material) => {
    setCarrinho(prev => [...prev, material])
    alert(`${material.nome} adicionado ao carrinho!`)
  }

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.preco, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                  📦 Central de Materiais Inteligente
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Marketplace integrado com fornecedores de SC
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                <Package className="h-3 w-3 mr-1" />
                {materiais.length} Produtos
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <ShoppingCart className="h-3 w-3 mr-1" />
                {carrinho.length} no Carrinho
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="marketplace" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="marketplace">🛒 Marketplace</TabsTrigger>
              <TabsTrigger value="comparador">⚖️ Comparador</TabsTrigger>
              <TabsTrigger value="lista">📋 Lista Inteligente</TabsTrigger>
              <TabsTrigger value="fornecedores">🏢 Fornecedores</TabsTrigger>
            </TabsList>

            {/* Tab Marketplace */}
            <TabsContent value="marketplace">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Filtros */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Search className="h-5 w-5" />
                        Buscar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="Pesquisar materiais..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Filter className="h-5 w-5" />
                        Categorias
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categorias.map((categoria) => (
                          <Button
                            key={categoria.id}
                            variant={selectedCategory === categoria.id ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setSelectedCategory(categoria.id)}
                          >
                            <categoria.icon className="h-4 w-4 mr-2" />
                            {categoria.nome}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Carrinho */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ShoppingCart className="h-5 w-5" />
                        Carrinho ({carrinho.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {carrinho.length > 0 ? (
                        <div className="space-y-2">
                          {carrinho.slice(0, 3).map((item, index) => (
                            <div key={index} className="text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                              <div className="font-medium">{item.nome}</div>
                              <div className="text-green-600">R$ {item.preco.toFixed(2)}</div>
                            </div>
                          ))}
                          {carrinho.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{carrinho.length - 3} itens...
                            </div>
                          )}
                          <div className="border-t pt-2 font-bold">
                            Total: R$ {calcularTotal().toFixed(2)}
                          </div>
                          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600">
                            Finalizar Pedido
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-4">
                          Carrinho vazio
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Grid de Produtos */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {materiaisFiltrados.map((material, index) => (
                      <motion.div
                        key={material.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow h-full">
                          <CardHeader className="relative">
                            {material.promocao && (
                              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                                -{material.desconto}%
                              </Badge>
                            )}
                            <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                              <Package className="h-12 w-12 text-slate-400" />
                            </div>
                            <CardTitle className="text-lg leading-tight">{material.nome}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-green-600">
                                  R$ {material.preco.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  por {material.unidade}
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3 text-gray-400" />
                                  <span>{material.fornecedor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span>{material.avaliacao}/5.0</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Truck className="h-3 w-3 text-blue-500" />
                                  <span>Entrega em {material.prazoEntrega} dias</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {material.disponibilidade === 'Em estoque' ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                                  )}
                                  <span>{material.disponibilidade}</span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  Especificações:
                                </div>
                                {material.especificacoes.slice(0, 2).map((spec, i) => (
                                  <div key={i} className="text-xs text-gray-500">• {spec}</div>
                                ))}
                              </div>

                              <Button
                                onClick={() => adicionarAoCarrinho(material)}
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-600"
                                disabled={material.disponibilidade !== 'Em estoque'}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Adicionar ao Carrinho
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab Comparador */}
            <TabsContent value="comparador">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Comparador Inteligente de Materiais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {materiais.slice(0, 3).map((material, index) => (
                        <div key={material.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-3">{material.nome}</h4>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Preço:</span>
                              <span className="font-bold text-green-600">R$ {material.preco.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fornecedor:</span>
                              <span>{material.fornecedor}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Avaliação:</span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {material.avaliacao}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Entrega:</span>
                              <span>{material.prazoEntrega} dias</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Localização:</span>
                              <span className="text-xs">{material.localizacao}</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="text-xs font-medium mb-2">Especificações:</div>
                            {material.especificacoes.map((spec, i) => (
                              <div key={i} className="text-xs text-gray-500">• {spec}</div>
                            ))}
                          </div>

                          {index === 0 && (
                            <Badge className="w-full mt-3 bg-green-500 text-white justify-center">
                              Melhor Custo-Benefício
                            </Badge>
                          )}
                          {index === 1 && (
                            <Badge className="w-full mt-3 bg-blue-500 text-white justify-center">
                              Melhor Qualidade
                            </Badge>
                          )}
                          {index === 2 && (
                            <Badge className="w-full mt-3 bg-purple-500 text-white justify-center">
                              Entrega Mais Rápida
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Análise IA - Recomendação:
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Com base no seu projeto e localização, recomendamos o <strong>Tijolo Cerâmico 6 Furos</strong> 
                        da Cerâmica Tijucas. Oferece o melhor custo-benefício, está próximo da obra (reduzindo 
                        custos de frete) e tem excelente avaliação de qualidade.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Lista Inteligente */}
            <TabsContent value="lista">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Lista Automatizada por Etapa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Etapa 1: Fundação (Mês 1)
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>• Cimento CP II-Z-32</span>
                            <span>120 sacos</span>
                          </div>
                          <div className="flex justify-between">
                            <span>• Areia média</span>
                            <span>15 m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span>• Brita 1</span>
                            <span>20 m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span>• Ferro CA-50 12mm</span>
                            <span>2.500 kg</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between font-bold">
                            <span>Total Estimado:</span>
                            <span className="text-green-600">R$ 18.450,00</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 opacity-75">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          Etapa 2: Estrutura (Mês 2-3)
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div>• Cimento, ferro, madeira para formas</div>
                          <div>• Lista será detalhada conforme cronograma</div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 opacity-50">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          Etapa 3: Alvenaria (Mês 4-5)
                        </h4>
                        <div className="text-sm text-gray-500">
                          Lista será gerada automaticamente
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Otimizações Inteligentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium text-green-800 dark:text-green-200">
                          💰 Economia Identificada
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Comprando cimento em lotes de 100 sacos, você economiza R$ 2,50 por saco. 
                          Economia total: <strong>R$ 300,00</strong>
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200">
                          🚚 Otimização de Frete
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Agrupando entregas da Cerâmica Tijucas, você economiza 2 fretes. 
                          Economia: <strong>R$ 180,00</strong>
                        </p>
                      </div>

                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                        <h4 className="font-medium text-orange-800 dark:text-orange-200">
                          ⏱️ Programação Inteligente
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                          Pedindo tijolos 1 semana antes do uso, você garante estoque e evita 
                          atrasos na obra.
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-medium text-purple-800 dark:text-purple-200">
                          🎯 Substituição Sugerida
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                          Ferro CA-60 pode substituir CA-50 em algumas aplicações, 
                          economizando <strong>R$ 450,00</strong>
                        </p>
                      </div>

                      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          R$ 930,00
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Economia Total Identificada
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Fornecedores */}
            <TabsContent value="fornecedores">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {fornecedores.map((fornecedor, index) => (
                  <motion.div
                    key={fornecedor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                          {fornecedor.verificado && (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verificado
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{fornecedor.avaliacao}/5.0</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {fornecedor.entregas} entregas
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{fornecedor.localizacao}</span>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-2">Especialidades:</div>
                            <div className="flex flex-wrap gap-1">
                              {fornecedor.especialidades.map((esp, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {esp}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div>📞 {fornecedor.telefone}</div>
                            <div>📧 {fornecedor.email}</div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              Ver Produtos
                            </Button>
                            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600">
                              Contatar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

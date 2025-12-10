export interface Money {
  value: number // em centavos
  currency: 'BRL'
}

export interface BOMItem {
  sku: string
  codigo: string
  nome: string
  descricao: string
  unidade: string
  quantidade: number
  categoria: string
  especificacao: string
  prioridade: number
}

export interface OnlineOffer {
  produto: string
  preco: number
  link: string
  loja: string
  disponibilidade: string
}

export interface FornecedorItem {
  sku: string
  nome: string
  fornecedor: string
  preco: Money
  frete: Money
  prazo: number // dias
  url?: string
  rating?: number
  disponibilidade: boolean
  origem: 'local' | 'online'
}

export interface LojaInfo {
  id: string
  nome: string
  endereco?: string
  distancia?: number // metros
  rating?: number
  telefone?: string
  website?: string
}

export interface Proposta {
  tipo: 'local' | 'online'
  itens: FornecedorItem[]
  loja: LojaInfo
  custoTotal: Money
  prazoTotal: number
  frete: Money
}

export interface CestaOtima {
  itens: FornecedorItem[]
  custoTotal: Money
  prazoMaximo: number
  lojasUsadas: LojaInfo[]
  economia: Money // vs média de mercado
  freteTotal: Money
  itensNaoEncontrados: BOMItem[]
}

export interface OptimizationResult {
  cestaOtima: CestaOtima
  alternativas: CestaOtima[]
  itensNaoEncontrados: BOMItem[]
}

export interface CotacaoRequest {
  area: number
  tipo: string
  padrao: string
  cep: string
}

export interface CotacaoResponse {
  bom: BOMItem[]
  listaLocal: Proposta[]
  listaOnline: Proposta[]
  cestaOtima: CestaOtima
  metricas: {
    custoTotal: Money
    prazoMedio: number
    lojasEncontradas: number
    itensEncontrados: number
    tempoProcessamento: number
  }
  debug?: any
}

export interface GeoLocation {
  lat: number
  lng: number
}

export interface FreteRequest {
  cepOrigem: string
  cepDestino: string
  peso: number // kg
  dimensoes: {
    altura: number // cm
    largura: number
    comprimento: number
  }
  servico?: string
}

export interface FreteResponse {
  valorFrete: Money
  prazoDias: number
  servico: string
}

export interface NearbyRequest {
  lat: number
  lng: number
  radiusMeters: number
  keyword: string
}

export interface MeliSearchRequest {
  query: string
  zip: string
}

export interface SinapiComposicao {
  codigo: string
  descricao: string
  unidade: string
  coeficiente: number // por m²
  categoria: string
  fatorPadrao: {
    popular: number
    medio: number
    alto: number
    luxo: number
  }
}
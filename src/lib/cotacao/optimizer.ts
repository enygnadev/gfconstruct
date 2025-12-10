import { BOMItem, FornecedorItem, CestaOtima, LojaInfo, Money } from './types'

interface OfertasPorSku {
  [sku: string]: FornecedorItem[]
}

interface CestaCandidata {
  itens: FornecedorItem[]
  custoTotal: number
  prazoMaximo: number
  lojasUsadas: Set<string>
  freteTotal: number
}

export function pickCheapestBasket(
  bom: BOMItem[], 
  ofertas: OfertasPorSku,
  constraints: {
    maxPrazo?: number
    minRating?: number
    preferirLocal?: boolean
  } = {}
): CestaOtima {

  // Filtrar ofertas válidas
  const ofertasFiltradas = filterValidOffers(ofertas, constraints)

  // Gerar cestas candidatas
  const cestas = generateBasketCandidates(bom, ofertasFiltradas, constraints)

  // Encontrar a melhor cesta
  const melhorCesta = findBestBasket(cestas)

  // Calcular métricas
  const economia = calculateSavings(melhorCesta, ofertas)
  const lojasUsadas = Array.from(melhorCesta.lojasUsadas).map(loja => ({
    id: loja,
    nome: loja,
    rating: 4.5
  }))

  // Identificar itens não encontrados na melhor cesta
  const skusNaMelhorCesta = new Set(melhorCesta.itens.map(item => item.sku));
  const itensNaoEncontrados = bom.filter(bomItem => !skusNaMelhorCesta.has(bomItem.sku));

  return {
    itens: melhorCesta.itens,
    custoTotal: { value: melhorCesta.custoTotal, currency: 'BRL' },
    prazoMaximo: melhorCesta.prazoMaximo,
    lojasUsadas,
    economia: { value: economia, currency: 'BRL' },
    freteTotal: { value: melhorCesta.freteTotal, currency: 'BRL' },
    itensNaoEncontrados
  }
}

function filterValidOffers(
  ofertas: OfertasPorSku, 
  constraints: any
): OfertasPorSku {
  const filtered: OfertasPorSku = {}

  Object.entries(ofertas).forEach(([sku, items]) => {
    filtered[sku] = items.filter(item => {
      if (!item.disponibilidade) return false
      if (constraints.minRating && item.rating && item.rating < constraints.minRating) return false
      if (constraints.maxPrazo && item.prazo > constraints.maxPrazo) return false
      return true
    })
  })

  return filtered
}

function generateBasketCandidates(
  bom: BOMItem[], 
  ofertas: OfertasPorSku,
  constraints: any
): CestaCandidata[] {
  const cestas: CestaCandidata[] = []

  // Estratégia 1: Menor preço total por item
  const cestaBarata = buildCheapestBasket(bom, ofertas)
  if (cestaBarata) cestas.push(cestaBarata)

  // Estratégia 2: Menor número de fornecedores
  const cestaConsolidada = buildConsolidatedBasket(bom, ofertas)
  if (cestaConsolidada) cestas.push(cestaConsolidada)

  // Estratégia 3: Melhor prazo
  const cestaRapida = buildFastestBasket(bom, ofertas)
  if (cestaRapida) cestas.push(cestaRapida)

  // Estratégia 4: Preferência local (se habilitada)
  if (constraints.preferirLocal) {
    const cestaLocal = buildLocalBasket(bom, ofertas)
    if (cestaLocal) cestas.push(cestaLocal)
  }

  return cestas
}

function buildCheapestBasket(bom: BOMItem[], ofertas: OfertasPorSku): CestaCandidata | null {
  const itens: FornecedorItem[] = []
  let custoTotal = 0
  let prazoMaximo = 0
  let freteTotal = 0
  const lojasUsadas = new Set<string>()

  for (const bomItem of bom) {
    const ofertas_item = ofertas[bomItem.sku]
    if (!ofertas_item || ofertas_item.length === 0) continue

    // Ordenar por custo total (preço + frete)
    const melhorOferta = ofertas_item
      .sort((a, b) => (a.preco.value + a.frete.value) - (b.preco.value + b.frete.value))[0]

    itens.push(melhorOferta)
    custoTotal += (melhorOferta.preco.value + melhorOferta.frete.value) * bomItem.quantidade
    freteTotal += melhorOferta.frete.value * bomItem.quantidade
    prazoMaximo = Math.max(prazoMaximo, melhorOferta.prazo)
    lojasUsadas.add(melhorOferta.fornecedor)
  }

  return itens.length > 0 ? { itens, custoTotal, prazoMaximo, lojasUsadas, freteTotal } : null
}

function buildConsolidatedBasket(bom: BOMItem[], ofertas: OfertasPorSku): CestaCandidata | null {
  // Agrupar ofertas por loja
  const lojas: Record<string, FornecedorItem[]> = {}

  Object.values(ofertas).flat().forEach(oferta => {
    if (!lojas[oferta.fornecedor]) {
      lojas[oferta.fornecedor] = []
    }
    lojas[oferta.fornecedor].push(oferta)
  })

  // Encontrar a loja com mais itens disponíveis e melhor custo-benefício
  let melhorLoja = ''
  let melhorScore = 0

  Object.entries(lojas).forEach(([loja, ofertas_loja]) => {
    const itensDisponiveis = new Set(ofertas_loja.map(o => o.sku)).size
    const precoMedio = ofertas_loja.reduce((sum, o) => sum + o.preco.value, 0) / ofertas_loja.length
    const score = itensDisponiveis * 1000 - precoMedio * 0.1

    if (score > melhorScore) {
      melhorScore = score
      melhorLoja = loja
    }
  })

  if (!melhorLoja) return null

  // Montar cesta com itens da melhor loja e complementar com outras
  const itens: FornecedorItem[] = []
  let custoTotal = 0
  let prazoMaximo = 0
  let freteTotal = 0
  const lojasUsadas = new Set<string>()

  for (const bomItem of bom) {
    const ofertaDaLoja = lojas[melhorLoja]?.find(o => o.sku === bomItem.sku)
    const oferta = ofertaDaLoja || ofertas[bomItem.sku]?.[0]

    if (oferta) {
      itens.push(oferta)
      custoTotal += (oferta.preco.value + oferta.frete.value) * bomItem.quantidade
      freteTotal += oferta.frete.value * bomItem.quantidade
      prazoMaximo = Math.max(prazoMaximo, oferta.prazo)
      lojasUsadas.add(oferta.fornecedor)
    }
  }

  return itens.length > 0 ? { itens, custoTotal, prazoMaximo, lojasUsadas, freteTotal } : null
}

function buildFastestBasket(bom: BOMItem[], ofertas: OfertasPorSku): CestaCandidata | null {
  const itens: FornecedorItem[] = []
  let custoTotal = 0
  let prazoMaximo = 0
  let freteTotal = 0
  const lojasUsadas = new Set<string>()

  for (const bomItem of bom) {
    const ofertas_item = ofertas[bomItem.sku]
    if (!ofertas_item || ofertas_item.length === 0) continue

    // Ordenar por prazo e depois por preço
    const melhorOferta = ofertas_item
      .sort((a, b) => a.prazo - b.prazo || a.preco.value - b.preco.value)[0]

    itens.push(melhorOferta)
    custoTotal += (melhorOferta.preco.value + melhorOferta.frete.value) * bomItem.quantidade
    freteTotal += melhorOferta.frete.value * bomItem.quantidade
    prazoMaximo = Math.max(prazoMaximo, melhorOferta.prazo)
    lojasUsadas.add(melhorOferta.fornecedor)
  }

  return itens.length > 0 ? { itens, custoTotal, prazoMaximo, lojasUsadas, freteTotal } : null
}

function buildLocalBasket(bom: BOMItem[], ofertas: OfertasPorSku): CestaCandidata | null {
  const itens: FornecedorItem[] = []
  let custoTotal = 0
  let prazoMaximo = 0
  let freteTotal = 0
  const lojasUsadas = new Set<string>()

  for (const bomItem of bom) {
    const ofertas_item = ofertas[bomItem.sku]
    if (!ofertas_item || ofertas_item.length === 0) continue

    // Preferir ofertas locais
    const ofertasLocais = ofertas_item.filter(o => o.origem === 'local')
    const ofertasParaUsar = ofertasLocais.length > 0 ? ofertasLocais : ofertas_item

    const melhorOferta = ofertasParaUsar
      .sort((a, b) => (a.preco.value + a.frete.value) - (b.preco.value + b.frete.value))[0]

    itens.push(melhorOferta)
    custoTotal += (melhorOferta.preco.value + melhorOferta.frete.value) * bomItem.quantidade
    freteTotal += melhorOferta.frete.value * bomItem.quantidade
    prazoMaximo = Math.max(prazoMaximo, melhorOferta.prazo)
    lojasUsadas.add(melhorOferta.fornecedor)
  }

  return itens.length > 0 ? { itens, custoTotal, prazoMaximo, lojasUsadas, freteTotal } : null
}

function findBestBasket(cestas: CestaCandidata[]): CestaCandidata {
  if (cestas.length === 0) {
    throw new Error('Nenhuma cesta válida encontrada')
  }

  // Scorer baseado em custo, prazo e número de fornecedores
  return cestas.reduce((melhor, atual) => {
    const scoreMelhor = calculateBasketScore(melhor)
    const scoreAtual = calculateBasketScore(atual)

    return scoreAtual < scoreMelhor ? atual : melhor
  })
}

function calculateBasketScore(cesta: CestaCandidata): number {
  // Score menor é melhor
  // Peso: 70% custo, 20% prazo, 10% número de fornecedores
  const custoPeso = 0.7
  const prazoPeso = 0.2
  const fornecedoresPeso = 0.1

  const custoNormalizado = cesta.custoTotal / 100000 // normalizar para centenas de milhares
  const prazoNormalizado = cesta.prazoMaximo / 30 // normalizar para 30 dias
  const fornecedoresNormalizado = cesta.lojasUsadas.size / 10 // normalizar para 10 fornecedores

  return (custoNormalizado * custoPeso) + 
         (prazoNormalizado * prazoPeso) + 
         (fornecedoresNormalizado * fornecedoresPeso)
}

function calculateSavings(melhorCesta: CestaCandidata, todasOfertas: OfertasPorSku): number {
  // Calcular economia vs preço médio de mercado
  let precoMedio = 0
  let itensComparados = 0

  melhorCesta.itens.forEach(item => {
    const ofertas_item = todasOfertas[item.sku]
    if (ofertas_item && ofertas_item.length > 0) {
      const mediaItem = ofertas_item.reduce((sum, o) => sum + o.preco.value, 0) / ofertas_item.length
      precoMedio += mediaItem
      itensComparados++
    }
  })

  if (itensComparados === 0) return 0

  const custoMedio = precoMedio
  const custoOtimo = melhorCesta.itens.reduce((sum, item) => sum + item.preco.value, 0)

  return Math.max(0, custoMedio - custoOtimo)
}
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRateLimitResponse } from '@/src/lib/cotacao/rateLimit'
import { buildBOM } from '@/src/lib/cotacao/bom'
import { fetchNearbyStores, fetchLocalPrices, fetchOnlinePrices } from '@/src/lib/cotacao/providers'
import { pickCheapestBasket } from '@/src/lib/cotacao/optimizer'
import { CotacaoRequest, CotacaoResponse, BOMItem, FornecedorItem, Proposta, OnlineOffer } from '@/src/lib/cotacao/types'

export async function POST(request: NextRequest) {
  if (!checkRateLimit()) {
    return createRateLimitResponse()
  }

  const startTime = Date.now()

  try {
    const { area, tipo, padrao, cep }: CotacaoRequest = await request.json()

    // Validação
    if (!area || !tipo || !padrao || !cep) {
      return NextResponse.json(
        { error: 'Área, tipo, padrão e CEP são obrigatórios' },
        { status: 400 }
      )
    }

    if (area <= 0 || area > 10000) {
      return NextResponse.json(
        { error: 'Área deve estar entre 1 e 10.000 m²' },
        { status: 400 }
      )
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

    try {
      // Passo 1: Gerar BOM
      console.log('[COTACAO] Gerando BOM...')
      const bom = buildBOM({ area, tipo, padrao: padrao as any })

      if (bom.length === 0) {
        return NextResponse.json(
          { error: 'Não foi possível gerar lista de materiais' },
          { status: 400 }
        )
      }

      // Passo 2: Geocodificar CEP
      console.log('[COTACAO] Geocodificando CEP...')
      const geoLocation = await geocodeCEP(cep, controller.signal)

      // Passo 3: Buscar lojas locais
      console.log('[COTACAO] Buscando lojas locais...')
      const lojasLocais = await fetchNearbyStores(
        geoLocation.lat, 
        geoLocation.lng, 
        controller.signal
      )

      // Passo 4: Coletar preços locais e online em paralelo
      console.log('[COTACAO] Coletando preços...')
      const [ofertasLocais, ofertasOnline] = await Promise.all([
        collectLocalPrices(bom, lojasLocais, controller.signal),
        collectOnlinePrices(bom, cep, controller.signal)
      ])

      // Passo 5: Otimizar cesta
      console.log('[COTACAO] Otimizando cesta...')
      const todasOfertas = combineOffers(ofertasLocais, ofertasOnline)
      const cestaOtima = pickCheapestBasket(bom, todasOfertas, {
        maxPrazo: 30,
        minRating: 3.0,
        preferirLocal: true
      })

      // Passo 6: Montar resposta
      const processingTime = Date.now() - startTime

      const response: CotacaoResponse = {
        bom,
        listaLocal: formatLocalProposals(ofertasLocais, lojasLocais),
        listaOnline: formatOnlineProposals(ofertasOnline),
        cestaOtima,
        metricas: {
          custoTotal: cestaOtima.custoTotal,
          prazoMedio: Math.round(
            (cestaOtima.prazoMaximo + calculateAveragePrazo(todasOfertas)) / 2
          ),
          lojasEncontradas: lojasLocais.length + getUniqueOnlineStores(ofertasOnline).length,
          itensEncontrados: Object.keys(todasOfertas).length,
          tempoProcessamento: processingTime
        }
      }

      clearTimeout(timeoutId)

      console.log(`[COTACAO] Concluído em ${processingTime}ms`)
      return NextResponse.json(response)

    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }

  } catch (error) {
    console.error('[COTACAO] Erro:', error)

    const errorMessage = error instanceof Error ? error.message : 'Erro interno'

    return NextResponse.json(
      { 
        error: 'Erro ao processar cotação',
        details: errorMessage,
        processingTime: Date.now() - startTime
      },
      { status: 500 }
    )
  }
}

async function geocodeCEP(cep: string, signal: AbortSignal) {
  const cleanCEP = cep.replace(/\D/g, '')

  try {
    // Tentar com ViaCEP primeiro
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`, { signal })

    if (response.ok) {
      const data = await response.json()

      if (!data.erro) {
        // Usar Google Geocoding se disponível
        if (process.env.GOOGLE_MAPS_KEY) {
          const address = `${data.logradouro}, ${data.localidade}, ${data.uf}, Brazil`
          const geoResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_KEY}`,
            { signal }
          )

          if (geoResponse.ok) {
            const geoData = await geoResponse.json()
            if (geoData.results?.[0]?.geometry?.location) {
              return {
                lat: geoData.results[0].geometry.location.lat,
                lng: geoData.results[0].geometry.location.lng
              }
            }
          }
        }

        // Fallback: coordenadas aproximadas baseadas na cidade
        return estimateCoordinates(data.localidade, data.uf)
      }
    }
  } catch (error) {
    console.error('Geocoding error:', error)
  }

  // Fallback final: Florianópolis
  return { lat: -27.5954, lng: -48.5480 }
}

function estimateCoordinates(cidade: string, uf: string) {
  // Coordenadas aproximadas de cidades principais de SC
  const coordenadas: Record<string, { lat: number; lng: number }> = {
    'Florianópolis': { lat: -27.5954, lng: -48.5480 },
    'Joinville': { lat: -26.3045, lng: -48.8487 },
    'Blumenau': { lat: -26.9194, lng: -49.0661 },
    'São José': { lat: -27.5969, lng: -48.6394 },
    'Chapecó': { lat: -27.1004, lng: -52.6158 },
    'Itajaí': { lat: -26.9077, lng: -48.6618 },
    'Palhoça': { lat: -27.6386, lng: -48.6732 },
    'Criciúma': { lat: -28.6773,lng: -49.3772 },
    'Lages': { lat: -27.8167, lng: -50.3267 }
  }

  return coordenadas[cidade] || coordenadas['Florianópolis']
}

async function collectLocalPrices(
  bom: BOMItem[], 
  lojas: any[], 
  signal: AbortSignal
): Promise<Record<string, FornecedorItem[]>> {
  const ofertas: Record<string, FornecedorItem[]> = {}

  for (const item of bom) {
    try {
      const precos = await fetchLocalPrices(item.sku, lojas, signal)
      if (precos.length > 0) {
        ofertas[item.sku] = precos
      }
    } catch (error) {
      console.error(`Erro ao buscar preços locais para ${item.sku}:`, error)
    }
  }

  return ofertas
}

async function collectOnlinePrices(
  bom: BOMItem[], 
  cep: string, 
  signal: AbortSignal
): Promise<Record<string, FornecedorItem[]>> {
  const ofertas: Record<string, FornecedorItem[]> = {}

  for (const item of bom) {
    try {
      const query = `${item.nome} ${item.categoria}`.toLowerCase()
      const precos = await fetchOnlinePrices(query, cep, signal)
      if (precos.length > 0) {
        ofertas[item.sku] = precos
      }
    } catch (error) {
      console.error(`Erro ao buscar preços online para ${item.sku}:`, error)
    }
  }

  return ofertas
}

function combineOffers(
  locais: Record<string, FornecedorItem[]>,
  online: Record<string, FornecedorItem[]>
): Record<string, FornecedorItem[]> {
  const combined: Record<string, FornecedorItem[]> = {}

  // Adicionar ofertas locais
  Object.entries(locais).forEach(([sku, ofertas]) => {
    combined[sku] = [...ofertas]
  })

  // Adicionar ofertas online
  Object.entries(online).forEach(([sku, ofertas]) => {
    if (combined[sku]) {
      combined[sku].push(...ofertas)
    } else {
      combined[sku] = ofertas
    }
  })

  return combined
}

function formatLocalProposals(ofertas: any, lojas: any[]): Proposta[] {
  // Agrupar ofertas por loja
  const propostas: Proposta[] = []
  
  for (const loja of lojas) {
    const itensLoja = (Object.values(ofertas)
      .flat() as FornecedorItem[])
      .filter((item: FornecedorItem) => item.fornecedor === loja.nome)

    if (itensLoja.length === 0) continue

    const custoTotal = itensLoja.reduce((sum: number, item: FornecedorItem) => 
      sum + item.preco.value + item.frete.value, 0
    )

    const prazoMaximo = Math.max(...itensLoja.map((item: FornecedorItem) => item.prazo))

    propostas.push({
      tipo: 'local',
      itens: itensLoja,
      loja,
      custoTotal: { value: custoTotal, currency: 'BRL' },
      prazoTotal: prazoMaximo,
      frete: { value: 0, currency: 'BRL' }
    })
  }

  return propostas
}

function formatOnlineProposals(ofertas: Record<string, FornecedorItem[]>): Proposta[] {
  if (!ofertas || typeof ofertas !== 'object') {
    return []
  }

  return Object.entries(ofertas).map(([loja, itens]) => ({
    tipo: 'online' as const,
    itens: itens || [],
    loja: { id: loja, nome: loja },
    custoTotal: {
      value: (itens || []).reduce((sum, item) => sum + (item.preco?.value || 0) + (item.frete?.value || 0), 0),
      currency: 'BRL' as const
    },
    prazoTotal: Math.max(...(itens || []).map(i => i.prazo || 7), 7),
    frete: { value: 0, currency: 'BRL' as const }
  }))
}

function getUniqueOnlineStores(ofertas: any): string[] {
  const stores = new Set<string>()

  Object.values(ofertas).flat().forEach((item: any) => {
    if (item.origem === 'online') {
      stores.add(item.fornecedor)
    }
  })

  return Array.from(stores)
}

function calculateAveragePrazo(ofertas: any): number {
  const prazos = Object.values(ofertas)
    .flat()
    .map((item: any) => item.prazo)

  return prazos.length > 0 
    ? prazos.reduce((sum: number, prazo: number) => sum + prazo, 0) / prazos.length
    : 7
}

function validateOnlineProposalItems(items: any[]): any[] {
  // Implementar validação específica para itens de propostas online
  // Por enquanto, retorna os itens como estão
  return items.map(item => ({
    ...item,
    preco: {
      value: parseFloat(item.preco.value) || 0,
      currency: item.preco.currency || 'BRL'
    },
    frete: {
      value: parseFloat(item.frete.value) || 0,
      currency: item.frete.currency || 'BRL'
    },
    prazo: parseInt(item.prazo) || 7
  }));
}
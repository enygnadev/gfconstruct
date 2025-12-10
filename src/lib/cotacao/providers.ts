
import { FornecedorItem, LojaInfo, NearbyRequest, MeliSearchRequest, FreteRequest, FreteResponse, Money } from './types'
import { cache } from './cache'

const DEBUG = process.env.DEBUG_COTACAO === 'true'

function log(...args: any[]) {
  if (DEBUG) {
    console.log('[COTACAO]', ...args)
  }
}

export async function fetchNearbyStores(
  lat: number, 
  lng: number, 
  signal?: AbortSignal
): Promise<LojaInfo[]> {
  const cacheKey = `nearby:${lat}:${lng}`
  const cached = cache.get<LojaInfo[]>(cacheKey)
  if (cached) {
    log('Cache hit for nearby stores')
    return cached
  }

  const start = Date.now()
  
  try {
    const endpoint = process.env.USE_PLACES === 'true' 
      ? '/api/geo/nearby' 
      : '/api/open/local/overpass'

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat,
        lng,
        radiusMeters: 20000,
        keyword: 'building materials hardware'
      }),
      signal
    })

    if (!response.ok) {
      throw new Error(`Provider error: ${response.status}`)
    }

    const stores = await response.json()
    log(`Nearby stores fetched in ${Date.now() - start}ms`)
    
    cache.set(cacheKey, stores, 15 * 60 * 1000) // 15 min
    return stores

  } catch (error) {
    log('Error fetching nearby stores:', error)
    return []
  }
}

export async function fetchLocalPrices(
  sku: string, 
  stores: LojaInfo[], 
  signal?: AbortSignal
): Promise<FornecedorItem[]> {
  const cacheKey = `local_prices:${sku}`
  const cached = cache.get<FornecedorItem[]>(cacheKey)
  if (cached) return cached

  // Para demo, retornar preços mock baseados no SKU
  const mockPrices = generateMockLocalPrices(sku, stores)
  
  cache.set(cacheKey, mockPrices, 30 * 60 * 1000) // 30 min
  return mockPrices
}

export async function fetchOnlinePrices(
  query: string, 
  cep: string, 
  signal?: AbortSignal
): Promise<FornecedorItem[]> {
  const cacheKey = `online:${query}:${cep}`
  const cached = cache.get<FornecedorItem[]>(cacheKey)
  if (cached) return cached

  const start = Date.now()

  try {
    const response = await fetch('/api/online/meli', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, zip: cep }),
      signal
    })

    if (!response.ok) {
      log(`MercadoLivre API error: ${response.status}`)
      return generateMockOnlinePrices(query, cep)
    }

    const items = await response.json()
    log(`Online prices fetched in ${Date.now() - start}ms`)
    
    cache.set(cacheKey, items, 20 * 60 * 1000) // 20 min
    return items

  } catch (error) {
    log('Error fetching online prices:', error)
    return generateMockOnlinePrices(query, cep)
  }
}

export async function fetchShippingCost(
  request: FreteRequest, 
  signal?: AbortSignal
): Promise<FreteResponse> {
  const cacheKey = `frete:${request.cepOrigem}:${request.cepDestino}:${request.peso}`
  const cached = cache.get<FreteResponse>(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch('/api/preco/frete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal
    })

    if (!response.ok) {
      throw new Error(`Shipping API error: ${response.status}`)
    }

    const result = await response.json()
    cache.set(cacheKey, result, 60 * 60 * 1000) // 1 hora
    return result

  } catch (error) {
    log('Error fetching shipping cost:', error)
    // Fallback para cálculo mock
    return generateMockShipping(request)
  }
}

// Mock generators para desenvolvimento
function generateMockLocalPrices(sku: string, stores: LojaInfo[]): FornecedorItem[] {
  const basePrice = getBasePriceBySku(sku)
  
  return stores.slice(0, 3).map((store, index) => {
    const variation = 0.8 + (index * 0.15) + Math.random() * 0.3
    const price = Math.round(basePrice * variation)
    
    return {
      sku,
      nome: getProductNameBySku(sku),
      fornecedor: store.nome,
      preco: { value: price, currency: 'BRL' },
      frete: { value: Math.round(500 + Math.random() * 1000), currency: 'BRL' },
      prazo: Math.ceil(1 + Math.random() * 3),
      rating: 4 + Math.random(),
      disponibilidade: Math.random() > 0.1,
      origem: 'local'
    }
  })
}

function generateMockOnlinePrices(query: string, cep: string): FornecedorItem[] {
  const basePrice = getBasePriceByQuery(query)
  
  return Array.from({ length: 5 }, (_, index) => {
    const variation = 0.7 + (index * 0.1) + Math.random() * 0.4
    const price = Math.round(basePrice * variation)
    
    return {
      sku: `ONLINE_${index}`,
      nome: query,
      fornecedor: `Loja Online ${index + 1}`,
      preco: { value: price, currency: 'BRL' },
      frete: { value: Math.round(800 + Math.random() * 1500), currency: 'BRL' },
      prazo: Math.ceil(3 + Math.random() * 7),
      rating: 3.5 + Math.random() * 1.5,
      disponibilidade: Math.random() > 0.05,
      origem: 'online',
      url: `https://exemplo.com/produto/${index}`
    }
  })
}

function generateMockShipping(request: FreteRequest): FreteResponse {
  const baseCost = Math.max(500, request.peso * 150) // R$ 1.50 por kg mínimo R$ 5
  const distance = Math.random() * 500 + 100 // 100-600 km
  const distanceFactor = 1 + (distance / 1000)
  
  return {
    valorFrete: { 
      value: Math.round(baseCost * distanceFactor), 
      currency: 'BRL' 
    },
    prazoDias: Math.ceil(2 + (distance / 200)),
    servico: 'PAC'
  }
}

function getBasePriceBySku(sku: string): number {
  const prices: Record<string, number> = {
    'CIM001': 2500, // R$ 25,00
    'ARE001': 8000, // R$ 80,00
    'BRI001': 9500, // R$ 95,00
    'TIJ001': 85000, // R$ 850,00
    'CER001': 4500, // R$ 45,00
    'TIN001': 12000, // R$ 120,00
    'FER001': 850, // R$ 8,50
    'HID001': 2500, // R$ 25,00
    'ELE001': 350, // R$ 3,50
    'COB001': 3500 // R$ 35,00
  }
  
  return prices[sku] || 5000
}

function getProductNameBySku(sku: string): string {
  const names: Record<string, string> = {
    'CIM001': 'Cimento Portland CP II-E-32',
    'ARE001': 'Areia média lavada',
    'BRI001': 'Brita 1',
    'TIJ001': 'Tijolo cerâmico 6 furos',
    'CER001': 'Cerâmica para piso 45x45cm',
    'TIN001': 'Tinta acrílica premium',
    'FER001': 'Vergalhão CA-50 12mm',
    'HID001': 'Tubo PVC esgoto 100mm',
    'ELE001': 'Cabo flexível 2,5mm²',
    'COB001': 'Telha cerâmica portuguesa'
  }
  
  return names[sku] || 'Produto de construção'
}

function getBasePriceByQuery(query: string): number {
  return 3000 + Math.random() * 10000 // R$ 30-130
}

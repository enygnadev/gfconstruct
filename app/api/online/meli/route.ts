
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRateLimitResponse } from '@/src/lib/cotacao/rateLimit'

export async function POST(request: NextRequest) {
  if (!checkRateLimit()) {
    return createRateLimitResponse()
  }

  try {
    const { query, zip } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const meliToken = process.env.MELI_TOKEN
    
    if (meliToken) {
      try {
        return await searchMercadoLivre(query, zip, meliToken)
      } catch (error) {
        console.error('MercadoLivre API error:', error)
        // Fallback para dados mock
      }
    }

    // Retornar dados mock se não tiver token ou der erro
    const mockResults = generateMockMeliResults(query, zip)
    return NextResponse.json(mockResults)

  } catch (error) {
    console.error('Meli route error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function searchMercadoLivre(query: string, zip: string, token: string) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    // Buscar itens no MercadoLivre
    const searchUrl = `https://api.mercadolibre.com/sites/MLB/search`
    const params = new URLSearchParams({
      q: query,
      limit: '20',
      shipping_cost: 'free,not_free',
      sort: 'price_asc'
    })

    const response = await fetch(`${searchUrl}?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`MercadoLivre API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Buscar informações de frete para cada item
    const itemsWithShipping = await Promise.all(
      (data.results || []).slice(0, 10).map(async (item: any) => {
        try {
          const shipping = await getShippingInfo(item.id, zip, token)
          return formatMeliItem(item, shipping)
        } catch (error) {
          console.error(`Error getting shipping for item ${item.id}:`, error)
          return formatMeliItem(item, null)
        }
      })
    )

    return NextResponse.json(itemsWithShipping.filter(Boolean))

  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

async function getShippingInfo(itemId: string, zip: string, token: string) {
  if (!zip) return null

  const cleanZip = zip.replace(/\D/g, '')
  if (cleanZip.length !== 8) return null

  try {
    const response = await fetch(
      `https://api.mercadolibre.com/items/${itemId}/shipping_options?zip_code=${cleanZip}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) return null

    const shipping = await response.json()
    const cheapestOption = shipping.options?.sort((a: any, b: any) => 
      (a.cost || 0) - (b.cost || 0)
    )[0]

    return cheapestOption

  } catch (error) {
    return null
  }
}

function formatMeliItem(item: any, shipping: any) {
  return {
    sku: item.id,
    nome: item.title,
    fornecedor: item.seller?.nickname || 'MercadoLivre',
    preco: {
      value: Math.round(item.price * 100),
      currency: 'BRL' as const
    },
    frete: {
      value: shipping?.cost ? Math.round(shipping.cost * 100) : Math.round(Math.random() * 2000 + 500),
      currency: 'BRL' as const
    },
    prazo: shipping?.estimated_delivery_time_days || Math.ceil(Math.random() * 7 + 3),
    rating: item.seller?.seller_reputation?.transactions?.ratings?.positive || 0.95,
    disponibilidade: item.available_quantity > 0,
    origem: 'online' as const,
    url: item.permalink
  }
}

function generateMockMeliResults(query: string, zip: string) {
  const basePrice = 2000 + Math.random() * 8000 // R$ 20-100
  
  return Array.from({ length: 8 }, (_, index) => {
    const variation = 0.7 + (index * 0.1) + Math.random() * 0.4
    const price = Math.round(basePrice * variation)
    
    return {
      sku: `MELI_${query.substring(0, 3).toUpperCase()}_${index}`,
      nome: `${query} - Produto ${index + 1}`,
      fornecedor: `Vendedor MercadoLivre ${index + 1}`,
      preco: {
        value: price,
        currency: 'BRL' as const
      },
      frete: {
        value: Math.round(800 + Math.random() * 1200),
        currency: 'BRL' as const
      },
      prazo: Math.ceil(3 + Math.random() * 7),
      rating: 0.85 + Math.random() * 0.15,
      disponibilidade: Math.random() > 0.05,
      origem: 'online' as const,
      url: `https://mercadolivre.com.br/produto-exemplo-${index}`
    }
  })
}

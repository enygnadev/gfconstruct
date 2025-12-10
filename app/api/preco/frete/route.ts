
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRateLimitResponse } from '@/src/lib/cotacao/rateLimit'

export async function POST(request: NextRequest) {
  if (!checkRateLimit()) {
    return createRateLimitResponse()
  }

  try {
    const { cepOrigem, cepDestino, peso, dimensoes, servico } = await request.json()

    if (!cepOrigem || !cepDestino || !peso) {
      return NextResponse.json(
        { error: 'CEP origem, destino e peso são obrigatórios' },
        { status: 400 }
      )
    }

    const correiosToken = process.env.CORREIOS_TOKEN
    
    if (correiosToken) {
      try {
        return await calculateCorreiosShipping({
          cepOrigem,
          cepDestino,
          peso,
          dimensoes,
          servico: servico || 'PAC'
        })
      } catch (error) {
        console.error('Correios API error:', error)
        // Fallback para cálculo mock
      }
    }

    // Cálculo mock baseado em distância e peso
    const shipping = calculateMockShipping(cepOrigem, cepDestino, peso, dimensoes)
    
    return NextResponse.json(shipping)

  } catch (error) {
    console.error('Shipping route error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function calculateCorreiosShipping(params: any) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    // Exemplo de integração com Correios (API oficial)
    const response = await fetch('https://api.correios.com.br/v1/precos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CORREIOS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cepOrigem: params.cepOrigem.replace(/\D/g, ''),
        cepDestino: params.cepDestino.replace(/\D/g, ''),
        peso: params.peso,
        altura: params.dimensoes?.altura || 10,
        largura: params.dimensoes?.largura || 20,
        comprimento: params.dimensoes?.comprimento || 30,
        servico: params.servico
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Correios API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      valorFrete: {
        value: Math.round(parseFloat(data.valor) * 100),
        currency: 'BRL'
      },
      prazoDias: parseInt(data.prazo),
      servico: data.servico || params.servico
    })

  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

function calculateMockShipping(cepOrigem: string, cepDestino: string, peso: number, dimensoes: any) {
  // Estimativa baseada na diferença de CEP e peso
  const origem = parseInt(cepOrigem.replace(/\D/g, '').substring(0, 5))
  const destino = parseInt(cepDestino.replace(/\D/g, '').substring(0, 5))
  const distanciaEstimada = Math.abs(origem - destino)
  
  // Fator de distância (0-100000 CEP = 0-3000km aproximadamente)
  const distanciaKm = (distanciaEstimada / 100000) * 3000
  const fatorDistancia = Math.max(1, distanciaKm / 100)
  
  // Custo base + peso + distância
  const custoBase = 500 // R$ 5,00
  const custoPorKg = 150 // R$ 1,50 por kg
  const custoDistancia = distanciaKm * 0.5 // R$ 0,005 por km
  
  const valorTotal = custoBase + (peso * custoPorKg) + custoDistancia
  
  // Prazo baseado na distância
  const prazoBase = 2
  const prazoDistancia = Math.ceil(distanciaKm / 500) // 1 dia a cada 500km
  
  return {
    valorFrete: {
      value: Math.round(valorTotal),
      currency: 'BRL' as const
    },
    prazoDias: prazoBase + prazoDistancia,
    servico: 'PAC Estimado'
  }
}

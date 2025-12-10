
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRateLimitResponse } from '@/src/lib/cotacao/rateLimit'

export async function POST(request: NextRequest) {
  if (!checkRateLimit()) {
    return createRateLimitResponse()
  }

  try {
    const { lat, lng, radiusMeters, keyword } = await request.json()

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_MAPS_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      )
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      // Google Places API New (v1) Text Search
      const searchUrl = `https://places.googleapis.com/v1/places:searchText`
      
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.websiteUri,places.nationalPhoneNumber'
        },
        body: JSON.stringify({
          textQuery: `${keyword} store near me`,
          locationBias: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radiusMeters
            }
          },
          maxResultCount: 10
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`)
      }

      const data = await response.json()
      
      const stores = (data.places || []).map((place: any) => ({
        id: place.id,
        nome: place.displayName?.text || 'Loja',
        endereco: place.formattedAddress,
        distancia: calculateDistance(lat, lng, place.location?.latitude, place.location?.longitude),
        rating: place.rating,
        telefone: place.nationalPhoneNumber,
        website: place.websiteUri
      }))

      return NextResponse.json(stores)

    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('Google Places API error:', fetchError)
      
      // Fallback para Overpass
      return await fallbackToOverpass(lat, lng, radiusMeters)
    }

  } catch (error) {
    console.error('Nearby stores API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function fallbackToOverpass(lat: number, lng: number, radius: number) {
  try {
    const response = await fetch('/api/open/local/overpass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng, radius })
    })

    if (response.ok) {
      return response
    }
  } catch (error) {
    console.error('Overpass fallback error:', error)
  }

  // Retornar stores mock se tudo falhar
  return NextResponse.json([
    {
      id: 'mock_1',
      nome: 'Loja de Materiais Central',
      endereco: 'Centro da cidade',
      distancia: 2500,
      rating: 4.2,
      telefone: '(48) 3333-4444'
    },
    {
      id: 'mock_2',
      nome: 'Casa do Construtor',
      endereco: 'Bairro Industrial',
      distancia: 5800,
      rating: 4.5,
      telefone: '(48) 3555-6666'
    }
  ])
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

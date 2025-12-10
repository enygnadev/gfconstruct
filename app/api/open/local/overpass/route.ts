
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRateLimitResponse } from '@/src/lib/cotacao/rateLimit'

export async function POST(request: NextRequest) {
  if (!checkRateLimit()) {
    return createRateLimitResponse()
  }

  try {
    const { lat, lng, radius } = await request.json()

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    const overpassUrl = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter'
    
    // Query Overpass para lojas de materiais de construção
    const query = `
      [out:json][timeout:10];
      (
        node["shop"="hardware"](around:${radius},${lat},${lng});
        node["shop"="building_materials"](around:${radius},${lat},${lng});
        node["shop"="doityourself"](around:${radius},${lat},${lng});
        way["shop"="hardware"](around:${radius},${lat},${lng});
        way["shop"="building_materials"](around:${radius},${lat},${lng});
        way["shop"="doityourself"](around:${radius},${lat},${lng});
      );
      out center;
    `

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`)
      }

      const data = await response.json()
      
      const stores = (data.elements || [])
        .filter((element: any) => element.tags?.name)
        .map((element: any) => {
          const elementLat = element.lat || element.center?.lat
          const elementLng = element.lon || element.center?.lon
          
          return {
            id: `osm_${element.id}`,
            nome: element.tags.name,
            endereco: formatAddress(element.tags),
            distancia: calculateDistance(lat, lng, elementLat, elementLng),
            rating: undefined,
            telefone: element.tags.phone,
            website: element.tags.website
          }
        })
        .sort((a: any, b: any) => a.distancia - b.distancia)
        .slice(0, 10)

      return NextResponse.json(stores)

    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('Overpass API error:', fetchError)
      throw fetchError
    }

  } catch (error) {
    console.error('Overpass route error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nearby stores' },
      { status: 500 }
    )
  }
}

function formatAddress(tags: any): string {
  const parts = []
  if (tags['addr:street']) parts.push(tags['addr:street'])
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber'])
  if (tags['addr:city']) parts.push(tags['addr:city'])
  return parts.join(', ') || 'Endereço não disponível'
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  if (!lat2 || !lng2) return Infinity
  
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

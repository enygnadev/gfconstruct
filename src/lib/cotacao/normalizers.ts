
export interface UnitConversion {
  from: string
  to: string
  factor: number
}

const conversions: UnitConversion[] = [
  // Cimento
  { from: 'saco_50kg', to: 'kg', factor: 50 },
  { from: 'saco_25kg', to: 'kg', factor: 25 },
  { from: 'saco_40kg', to: 'kg', factor: 40 },
  
  // Volume
  { from: 'm³', to: 'litro', factor: 1000 },
  { from: 'litro', to: 'm³', factor: 0.001 },
  
  // Área
  { from: 'm²', to: 'cm²', factor: 10000 },
  { from: 'cm²', to: 'm²', factor: 0.0001 },
  
  // Comprimento
  { from: 'm', to: 'cm', factor: 100 },
  { from: 'cm', to: 'm', factor: 0.01 },
  { from: 'mm', to: 'm', factor: 0.001 },
  
  // Quantidade
  { from: 'milheiro', to: 'unid', factor: 1000 },
  { from: 'centena', to: 'unid', factor: 100 },
  { from: 'duzia', to: 'unid', factor: 12 }
]

export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value

  const conversion = conversions.find(c => c.from === fromUnit && c.to === toUnit)
  if (conversion) {
    return value * conversion.factor
  }

  // Tentar conversão inversa
  const inverseConversion = conversions.find(c => c.to === fromUnit && c.from === toUnit)
  if (inverseConversion) {
    return value / inverseConversion.factor
  }

  console.warn(`Conversão não encontrada: ${fromUnit} para ${toUnit}`)
  return value
}

export function normalizeUnitName(unit: string): string {
  const unitMap: Record<string, string> = {
    'kg': 'kg',
    'kilo': 'kg',
    'quilograma': 'kg',
    'saco': 'saco_50kg',
    'sc': 'saco_50kg',
    'm³': 'm³',
    'm3': 'm³',
    'metro_cubico': 'm³',
    'm²': 'm²',
    'm2': 'm²',
    'metro_quadrado': 'm²',
    'm': 'm',
    'metro': 'm',
    'unid': 'unid',
    'unidade': 'unid',
    'pc': 'unid',
    'peca': 'unid',
    'litro': 'litro',
    'l': 'litro',
    'milheiro': 'milheiro',
    'mil': 'milheiro'
  }

  return unitMap[unit.toLowerCase()] || unit
}

export function calculateWeight(item: { unidade: string; quantidade: number }): number {
  // Estimativa de peso baseada na unidade (em kg)
  const weightMap: Record<string, number> = {
    'kg': 1,
    'saco_50kg': 50,
    'saco_25kg': 25,
    'm³_areia': 1600, // densidade areia
    'm³_brita': 1800, // densidade brita
    'm³_concreto': 2400,
    'm²_ceramica': 15, // kg por m²
    'milheiro_tijolo': 2500, // kg por milheiro
    'litro': 1, // assumindo densidade da água
    'unid': 0.5 // peso médio por unidade
  }

  const unitKey = item.unidade.toLowerCase()
  const baseWeight = weightMap[unitKey] || weightMap['unid'] || 1
  
  return item.quantidade * baseWeight
}

export function estimateDimensions(item: { unidade: string; quantidade: number }) {
  // Estimativa de dimensões em cm
  const dimensionMap: Record<string, { altura: number; largura: number; comprimento: number }> = {
    'saco_50kg': { altura: 70, largura: 50, comprimento: 15 },
    'saco_25kg': { altura: 60, largura: 40, comprimento: 12 },
    'm²_ceramica': { altura: 1, largura: 45, comprimento: 45 },
    'litro': { altura: 25, largura: 15, comprimento: 15 },
    'default': { altura: 30, largura: 30, comprimento: 30 }
  }

  const baseDim = dimensionMap[item.unidade] || dimensionMap['default']
  
  // Ajustar dimensões baseado na quantidade
  const volumeFactor = Math.cbrt(item.quantidade)
  
  return {
    altura: Math.ceil(baseDim.altura * volumeFactor),
    largura: Math.ceil(baseDim.largura * volumeFactor),
    comprimento: Math.ceil(baseDim.comprimento * volumeFactor)
  }
}

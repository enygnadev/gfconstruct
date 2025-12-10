import { BOMItem, SinapiComposicao } from './types'
import sinapiData from '../../../data/sinapi/sinapi_basico.json'

const composicoes = sinapiData as SinapiComposicao[]

export function buildBOM(params: {
  area: number
  tipo: string
  padrao: 'popular' | 'medio' | 'alto' | 'luxo'
}): BOMItem[] {
  const { area, tipo, padrao } = params

  if (area <= 0) {
    throw new Error('Área deve ser maior que zero')
  }

  // Fator de ajuste por tipo de obra
  const tipoFactor = getTipoFactor(tipo)

  const bom: BOMItem[] = composicoes.map((composicao, index) => {
    const fatorPadrao = composicao.fatorPadrao[padrao] || 1.0
    const quantidade = composicao.coeficiente * area * tipoFactor * fatorPadrao

    return {
      sku: composicao.codigo,
      codigo: composicao.codigo,
      nome: composicao.descricao,
      descricao: composicao.descricao,
      unidade: composicao.unidade,
      quantidade: Math.ceil(quantidade * 100) / 100, // arredondar para 2 casas
      categoria: composicao.categoria,
      especificacao: `Padrão ${padrao} - ${tipo}`,
      prioridade: index + 1
    }
  })

  // Filtrar itens com quantidade muito baixa
  return bom.filter(item => item.quantidade > 0.01)
}

function getTipoFactor(tipo: string): number {
  const factors: Record<string, number> = {
    casa: 1.0,
    sobrado: 1.15,
    apartamento: 0.85,
    comercial: 0.9,
    galpao: 0.7,
    reforma: 0.6
  }

  return factors[tipo] || 1.0
}

export function validateBOM(bom: BOMItem[]): boolean {
  return bom.every(item =>
    item.sku &&
    item.nome &&
    item.unidade &&
    item.quantidade > 0 &&
    item.categoria
  )
}
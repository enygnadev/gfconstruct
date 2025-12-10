import { Award, Users, Clock } from "lucide-react"

export const featuredServices = [
  {
    title: "Construção Residencial",
    subtitle: "Casas e Apartamentos de Alto Padrão",
    description:
      "Construção completa de residências com excelência técnica, desde a fundação até os acabamentos finais. Projetos personalizados que aliam conforto, funcionalidade e design.",
    image: "/placeholder.svg?height=400&width=600&text=Residential+Construction",
    features: [
      "Projetos arquitetônicos exclusivos",
      "Materiais de primeira linha certificados",
      "Acabamentos premium e modernos",
      "Gestão completa da obra",
    ],
  },
  {
    title: "Construção Comercial",
    subtitle: "Escritórios, Lojas e Indústrias",
    description:
      "Desenvolvimento de espaços comerciais e industriais completos, otimizados para produtividade. Infraestrutura robusta com soluções técnicas avançadas.",
    image: "/placeholder.svg?height=400&width=600&text=Commercial+Construction",
    features: [
      "Layouts funcionais e otimizados",
      "Instalações elétricas e hidráulicas completas",
      "Revestimentos e acabamentos profissionais",
      "Cumprimento rigoroso de cronogramas",
    ],
  },
  {
    title: "Reformas e Renovações",
    subtitle: "Transformação de Ambientes",
    description:
      "Renovação completa de imóveis residenciais e comerciais. Modernização de estruturas, instalações e acabamentos com mínima interrupção.",
    image: "/placeholder.svg?height=400&width=600&text=Renovation+Projects",
    features: [
      "Diagnóstico estrutural completo",
      "Atualização de sistemas prediais",
      "Execução planejada e eficiente",
      "Valorização garantida do imóvel",
    ],
  },
]

export const portfolioHighlights = [
  {
    title: "Residência Alto Padrão",
    description: "Casa de luxo com 350m² e acabamentos premium em Tubarão",
    image: "/placeholder.svg?height=400&width=600&text=Modern+House+Tubarao",
    category: "Residencial",
    year: "2024",
  },
  {
    title: "Edifício Comercial Centro",
    description: "Complexo comercial de 4 andares com salas corporativas",
    image: "/placeholder.svg?height=400&width=600&text=Commercial+Building+SC",
    category: "Comercial",
    year: "2023",
  },
  {
    title: "Reforma Corporate Tower",
    description: "Modernização completa de edifício empresarial de 8 andares",
    image: "/placeholder.svg?height=400&width=600&text=Office+Renovation+SC",
    category: "Renovação",
    year: "2024",
  },
]

export const testimonials = [
  {
    quote:
      "A GF Construtora transformou nossa casa dos sonhos em realidade. A qualidade da construção, atenção aos detalhes e pontualidade superaram todas as expectativas. Recomendo sem hesitar!",
    author: "Maria Santos",
    position: "Proprietária",
    company: "Residência em Tubarão - SC",
    rating: 5,
  },
  {
    quote:
      "Profissionalismo excepcional do início ao fim. Construíram nosso prédio comercial no prazo, com qualidade impecável e transparência total nos custos. Parceria de confiança!",
    author: "João Silva",
    position: "Diretor",
    company: "Centro Empresarial SC",
    rating: 5,
  },
  {
    quote:
      "A reforma do nosso escritório foi perfeita. Equipe técnica altamente qualificada, gestão impecável da obra e resultado final excepcional. Melhor construtora da região!",
    author: "Ana Costa",
    position: "Gerente Geral",
    company: "TechSul Tecnologia",
    rating: 5,
  },
]

export const whyChooseUs = [
  {
    icon: Award,
    title: "Experiência Comprovada",
    description:
      "Mais de 8 anos de excelência em construção civil, com centenas de obras residenciais, comerciais e industriais concluídas com sucesso em Santa Catarina.",
    color: "text-blue-600",
  },
  {
    icon: Users,
    title: "Equipe Técnica Especializada",
    description:
      "Engenheiros civis, arquitetos, mestres de obras e equipes técnicas certificadas. Profissionais experientes garantindo qualidade em cada detalhe.",
    color: "text-green-600",
  },
  {
    icon: Clock,
    title: "Pontualidade e Transparência",
    description:
      "Gestão profissional de projetos com cronogramas realistas e comunicação transparente. Entregas no prazo com acompanhamento detalhado de cada etapa.",
    color: "text-orange-600",
  },
]


import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { MessageSquareText, Award, Shield, Clock, Star, CheckCircle } from "lucide-react"

const services = [
  {
    id: "1",
    name: "Janelas de Alumínio",
    description:
      "Janelas de alumínio de alta qualidade, duráveis e eficientes energeticamente para casas e escritórios modernos com isolamento térmico avançado.",
    image: "/images/aluminum-windows-modern.webp",
    features: [
      "Isolamento térmico",
      "Isolamento acústico",
      "Designs personalizáveis",
      "Baixa manutenção",
      "Fechaduras de segurança",
      "Vedação contra intempéries",
    ],
    category: "Janelas",
    popular: true,
    rating: 4.9,
    projects: 150,
    warranty: "10 anos",
  },
  {
    id: "2",
    name: "Portas Francesas",
    description:
      "Portas francesas elegantes e seguras que adicionam sofisticação a qualquer espaço com vidro duplo e sistemas de travamento multiponto.",
    image: "/images/aluminum-french-doors-interior.webp",
    features: [
      "Vidro duplo",
      "Travamento multiponto",
      "Vários acabamentos",
      "Resistente às intempéries",
      "Dimensionamento personalizado",
      "Ferragens elegantes",
    ],
    category: "Portas",
    rating: 4.8,
    projects: 89,
    warranty: "8 anos",
  },
  {
    id: "3",
    name: "Sacadas de Vidro",
    description:
      "Sacadas de vidro elegantes e modernas oferecendo vistas desobstruídas e estética contemporânea com vidro temperado de segurança.",
    image: "/images/luxury-villa-pool.jpg",
    features: [
      "Vidro temperado",
      "Conexões de aço inoxidável",
      "Alturas personalizadas",
      "Fácil de limpar",
      "Resistência ao vento",
      "Certificação de segurança",
    ],
    category: "Sacadas",
    popular: true,
    rating: 4.9,
    projects: 67,
    warranty: "12 anos",
  },
  {
    id: "4",
    name: "Fachadas Cortina",
    description:
      "Sistemas avançados de fachada cortina para edifícios comerciais, proporcionando integridade estrutural e apelo estético excepcional.",
    image: "/images/curtain-wall-system.jpg",
    features: [
      "Eficiência energética",
      "Proteção contra intempéries",
      "Flexibilidade de design",
      "Maximização de luz natural",
      "Envidraçamento estrutural",
      "Performance térmica",
    ],
    category: "Comercial",
    rating: 4.7,
    projects: 23,
    warranty: "15 anos",
  },
  {
    id: "5",
    name: "Portas de Alumínio",
    description:
      "Portas de alumínio robustas e elegantes para propriedades residenciais e comerciais com sistemas de travamento de alta segurança.",
    image: "/images/Glass-Aluminum-Doors-Pomona.jpg",
    features: [
      "Fechaduras de alta segurança",
      "Resistente à corrosão",
      "Variedade de estilos",
      "Excelente durabilidade",
      "Cores personalizadas",
      "Quebra térmica",
    ],
    category: "Portas",
    popular: true,
    rating: 4.8,
    projects: 134,
    warranty: "10 anos",
  },
  {
    id: "6",
    name: "Janelas Francesas",
    description:
      "Janelas francesas clássicas combinando charme tradicional com performance moderna e propriedades de economia de energia.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Opções de ventilação",
      "Travamento seguro",
      "Design elegante",
      "Economia de energia",
      "Dimensionamento personalizado",
      "Estilo tradicional",
    ],
    category: "Janelas",
    rating: 4.6,
    projects: 78,
    warranty: "8 anos",
  },
  {
    id: "7",
    name: "Portas de Correr",
    description:
      "Portas de correr elegantes e que economizam espaço para uma vida perfeita entre interior e exterior com operação suave e painéis de vidro grandes.",
    image: "/images/aluminum-sliding-doors-residential.png",
    features: [
      "Operação suave",
      "Painéis de vidro grandes",
      "Travamento seguro",
      "Estética moderna",
      "Economia de espaço",
      "Vedação contra intempéries",
    ],
    category: "Portas",
    rating: 4.9,
    projects: 112,
    warranty: "10 anos",
  },
  {
    id: "8",
    name: "Boxes para Chuveiro",
    description:
      "Boxes de chuveiro projetados sob medida para banheiros luxuosos e funcionais usando vidro temperado premium.",
    image: "/images/frameless-shower.jpeg",
    features: [
      "Vidro temperado",
      "Tamanhos personalizados",
      "Fácil de limpar",
      "Designs modernos",
      "Opções sem moldura",
      "Vedação estanque",
    ],
    category: "Banheiros",
    rating: 4.8,
    projects: 95,
    warranty: "5 anos",
  },
  {
    id: "9",
    name: "Divisórias de Vidro",
    description:
      "Divisórias de vidro elegantes para escritórios e casas, criando espaços abertos e brilhantes com propriedades de amortecimento de som.",
    image: "/images/frosted-glass-door.jpeg",
    features: [
      "Amortecimento de som",
      "Opções de privacidade",
      "Designs personalizáveis",
      "Instalação fácil",
      "Configurações flexíveis",
      "Estética moderna",
    ],
    category: "Comercial",
    rating: 4.7,
    projects: 56,
    warranty: "7 anos",
  },
]

const categories = ["Todos os Serviços", "Janelas", "Portas", "Sacadas", "Comercial", "Banheiros"]

const getWhatsAppLink = (serviceName: string) => {
  const phoneNumber = "5548999999999"
  const message = encodeURIComponent(
    `Olá, tenho interesse em um orçamento para o serviço de ${serviceName}. Poderiam fornecer mais detalhes?`,
  )
  return `https://wa.me/${phoneNumber}?text=${message}`
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          title="Nossos Serviços Premium"
          highlightedText="Premium"
          description="Transforme seus espaços com nossas soluções especializadas em vidro e alumínio"
          backgroundImage="/images/modern-building-facade.jpeg"
          badge="Serviços Profissionais"
        />

        {/* Services Navigation */}
        <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="border-slate-300 hover:border-orange-500 hover:text-orange-600 bg-transparent"
                  asChild
                >
                  <a href={`#${category.toLowerCase().replace(" ", "-")}`}>{category}</a>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Stats */}
        <section className="py-12 bg-slate-50 dark:bg-slate-800/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Award className="h-8 w-8 text-orange-500 mr-2" />
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">15+</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Anos de Experiência</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-orange-500 mr-2" />
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">800+</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Projetos Concluídos</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Shield className="h-8 w-8 text-orange-500 mr-2" />
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">100%</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Qualidade Garantida</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Clock className="h-8 w-8 text-orange-500 mr-2" />
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">24/7</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Suporte ao Cliente</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Tabs */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="Todos os Serviços" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-12 bg-slate-100 dark:bg-slate-800">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs md:text-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} id={category.toLowerCase().replace(" ", "-")}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services
                      .filter((service) => category === "Todos os Serviços" || service.category === category)
                      .map((service) => (
                        <div
                          key={service.id}
                          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={service.image || "/placeholder.svg"}
                              alt={service.name}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                              {service.popular && (
                                <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Popular</Badge>
                              )}
                              <Badge className="bg-white/90 text-slate-800">
                                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                {service.rating}
                              </Badge>
                            </div>

                            {/* Service Title */}
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-xl font-bold text-white mb-1">{service.name}</h3>
                              <p className="text-blue-100 text-sm">
                                {service.projects}+ Projetos • Garantia de {service.warranty}
                              </p>
                            </div>
                          </div>

                          <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                              {service.description}
                            </p>

                            <div className="mb-6">
                              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Características Principais:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {service.features.slice(0, 4).map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Link href={getWhatsAppLink(service.name)} target="_blank" rel="noopener noreferrer">
                              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                <MessageSquareText className="h-4 w-4 mr-2" />
                                Orçamento Gratuito
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-slate-50 dark:bg-slate-800/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Por que Escolher a GF Construtora?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Entregamos excelência em cada projeto com qualidade, serviço e expertise incomparáveis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Artesanato Especializado</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Mais de 15 anos de experiência entregando soluções premium
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Garantia de Qualidade</h3>
                <p className="text-slate-600 dark:text-slate-400">Materiais premium com garantias abrangentes</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Entrega Pontual</h3>
                <p className="text-slate-600 dark:text-slate-400">Instalação profissional com mínima interrupção</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <MessageSquareText className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Suporte 24/7</h3>
                <p className="text-slate-600 dark:text-slate-400">Atendimento ao cliente dedicado e suporte de manutenção</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Pronto para Transformar Seu Espaço?</h2>
              <p className="text-lg text-slate-300 mb-8">
                Entre em contato conosco hoje para uma consulta gratuita e orçamento personalizado para seu projeto
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white text-base px-8 py-6">
                  <Link href="/contact">Consulta Gratuita</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-base px-8 py-6 bg-transparent"
                >
                  <Link href="/projects">Ver Nossos Trabalhos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}


import Image from "next/image"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProcessTimeline } from "@/components/process-timeline"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          title="Nossa História e Visão"
          highlightedText="Visão"
          description="Conheça a jornada da GF CONSTRUTORA para se tornar a principal provedora de soluções em alumínio e vidro de Santa Catarina"
          backgroundImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5553.jpg-j12YKDWtlJPmxyPR4GnSqfqxlKo5NC.jpeg"
          badge="Sobre Nós"
        />

        <section className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                    Construindo Excelência <br />
                    <span className="text-orange-500">Desde 2015</span>
                  </h2>

                  <div className="space-y-4 text-slate-700 dark:text-slate-300">
                    <p className="text-lg">
                      Sediada em Florianópolis, Santa Catarina, a GF CONSTRUTORA se estabeleceu como a principal
                      provedora de soluções em alumínio e vidro da região Sul. Nossa jornada começou com uma visão simples: trazer
                      artesanato de classe mundial e designs inovadores para Santa Catarina.
                    </p>

                    <p className="text-lg">
                      O que nos diferencia é nosso compromisso inabalável com a qualidade e precisão. Cada peça que criamos é
                      um testemunho de nossa dedicação à excelência, desde espelhos personalizados até sofisticadas divisórias de vidro
                      e estruturas de alumínio.
                    </p>

                    <p className="text-lg">
                      Nossa equipe de artesãos especializados combina artesanato tradicional com tecnologia de ponta para
                      entregar soluções que não são apenas funcionais, mas também obras de arte que transformam espaços.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <h3 className="text-3xl md:text-4xl font-bold text-orange-500">8+</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Anos de Excelência</p>
                    </div>

                    <div className="text-center">
                      <h3 className="text-3xl md:text-4xl font-bold text-orange-500">500+</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Projetos Concluídos</p>
                    </div>

                    <div className="text-center">
                      <h3 className="text-3xl md:text-4xl font-bold text-orange-500">98%</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Satisfação do Cliente</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative h-[600px] w-full">
                  <div className="absolute top-0 right-0 w-[80%] h-[350px] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5553.jpg-j12YKDWtlJPmxyPR4GnSqfqxlKo5NC.jpeg"
                      alt="Profissional da GF CONSTRUTORA no trabalho"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Instalação Profissional</p>
                      <p className="text-xs opacity-80">Nossa equipe especializada garante resultados perfeitos</p>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-[70%] h-[300px] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5541.jpg-ABfI6Lf24BgXSkznFZGdMHNEMHq5jO.jpeg"
                      alt="Instalação elegante de espelho"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Designs Elegantes</p>
                      <p className="text-xs opacity-80">Transformando espaços com beleza</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-slate-100 dark:bg-slate-900/50 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 dark:to-slate-800/30" />

          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-6 bg-orange-500/20 text-orange-500 border-orange-500/30 px-4 py-1.5">Nossos Valores</Badge>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Os Princípios Que <span className="text-orange-500">Nos Guiam</span>
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-400">
                Nossos valores fundamentais moldam tudo o que fazemos, desde como projetamos e construímos nossos produtos até como interagimos
                com nossos clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 h-full">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Excelência</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Estamos comprometidos em entregar a mais alta qualidade em todos os aspectos do nosso trabalho, desde materiais até
                    artesanato e atendimento ao cliente.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 h-full">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500"
                    >
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                      <path d="M12 2v2" />
                      <path d="M12 22v-2" />
                      <path d="m17 20.66-1-1.73" />
                      <path d="M11 10.27 7 3.34" />
                      <path d="m20.66 17-1.73-1" />
                      <path d="m3.34 7 1.73 1" />
                      <path d="M22 12h-2" />
                      <path d="M2 12h2" />
                      <path d="m20.66 7-1.73 1" />
                      <path d="m3.34 17 1.73-1" />
                      <path d="m17 3.34-1 1.73" />
                      <path d="m7 20.66 1-1.73" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Inovação</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Exploramos continuamente novas técnicas, materiais e designs para trazer soluções inovadoras e atualizadas
                    para nossos clientes.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 h-full">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Integridade</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Operamos com honestidade, transparência e práticas éticas em todos os nossos negócios e
                    relacionamentos com clientes.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 h-full">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Artesanato</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Honramos a tradição do artesanato especializado, combinando técnicas testadas pelo tempo com tecnologia
                    moderna para criar produtos excepcionais.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-6 bg-orange-500/20 text-orange-500 border-orange-500/30 px-4 py-1.5">Nossa Abordagem</Badge>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                O Processo da <span className="text-orange-500">GF CONSTRUTORA</span>
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-400">
                Nosso processo meticuloso garante resultados excepcionais desde a consulta inicial até a instalação final e
                além.
              </p>
            </div>

            <ProcessTimeline />
          </div>
        </section>

        <section className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-6 bg-orange-500/20 text-orange-500 border-orange-500/30 px-4 py-1.5">Nossa Missão</Badge>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                  Transformando Espaços com <span className="text-orange-500">Elegância e Precisão</span>
                </h2>

                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  <p className="text-lg">
                    Na GF CONSTRUTORA, nossa missão é elevar espaços através de soluções excepcionais em vidro e alumínio
                    que misturam funcionalidade com expressão artística.
                  </p>

                  <p className="text-lg">
                    Somos dedicados a trazer qualidade e artesanato de primeira linha para Santa Catarina, tornando materiais premium
                    e designs acessíveis para clientes exigentes em toda a região.
                  </p>

                  <p className="text-lg">
                    Através do nosso compromisso com excelência, inovação e atendimento personalizado, pretendemos ser o parceiro
                    de confiança para arquitetos, designers e proprietários que buscam transformar seus espaços com elegância
                    e precisão.
                  </p>
                </div>

                <div className="mt-8">
                  <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Link href="/contact">Entre em Contato</Link>
                  </Button>
                </div>
              </div>

              <div className="relative h-[500px] w-full">
                <Image
                  src="/placeholder.svg?height=1000&width=1000"
                  alt="Instalação GF CONSTRUTORA"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-slate-900 text-white relative">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?key=dz9dy')] opacity-10 bg-cover bg-center" />

          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-6 bg-orange-500/20 text-orange-500 border-orange-500/30 px-4 py-1.5">
                Junte-se à Nossa Jornada
              </Badge>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Pronto para Transformar Seu <span className="text-orange-500">Espaço?</span>
              </h2>

              <p className="text-lg text-slate-300 mb-10">
                Se você está procurando melhorar sua casa, escritório ou propriedade comercial, nossa equipe está pronta para dar
                vida à sua visão com soluções premium em vidro e alumínio.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white text-base px-8 py-6">
                  <Link href="/contact">Solicitar Orçamento</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-base px-8 py-6"
                >
                  <Link href="/projects">Ver Nossos Projetos</Link>
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


import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"
import { ContactForm } from "@/components/contact-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingForm } from "@/components/booking-form"
import { FAQ } from "@/components/faq"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          title="Entre em Contato"
          highlightedText="Contato"
          description="Entre em contato com nossa equipe de especialistas para consultas, orçamentos ou qualquer dúvida sobre nossas soluções premium em vidro e alumínio"
          backgroundImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5552.jpg-e9OZPdzTjrlEnzvlPjwrJuPBcC68eo.jpeg"
          badge="Fale Conosco"
        />

        <section className="py-20 md:py-24 bg-slate-900 text-white relative">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?key=dz9dy')] opacity-10 bg-cover bg-center" />

          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                  Adoraríamos <span className="text-orange-500">Ouvir de Você</span>
                </h2>

                <p className="text-lg text-slate-300 mb-8">
                  Se você está pronto para iniciar um projeto, tem dúvidas sobre nossos serviços, ou apenas quer saber mais
                  sobre nossas soluções premium em vidro e alumínio, nossa equipe está aqui para ajudar.
                </p>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-lg">Telefone</h3>
                      <p className="text-slate-300">+55 (48) 99999-9999</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-slate-300">contato@gfconstrutora.com.br</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-lg">Localização</h3>
                      <p className="text-slate-300">Florianópolis, Santa Catarina, Brasil</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">Horário de Funcionamento</h3>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>Segunda - Sexta</div>
                    <div>08:00 - 18:00</div>
                    <div>Sábado</div>
                    <div>09:00 - 16:00</div>
                    <div>Domingo</div>
                    <div>Fechado</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Siga-nos</h3>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500/20 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-500"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                      <span className="sr-only">Facebook</span>
                    </a>

                    <a
                      href="#"
                      className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500/20 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-500"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                      <span className="sr-only">Instagram</span>
                    </a>

                    <a
                      href="#"
                      className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500/20 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-500"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 bg-white dark:bg-slate-900 relative">
          <div className="container mx-auto px-4 md:px-6 relative">
            <Tabs defaultValue="contact" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-12">
                <TabsTrigger
                  value="contact"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-base py-3"
                >
                  Entre em Contato
                </TabsTrigger>
                <TabsTrigger
                  value="consultation"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-base py-3"
                >
                  Agende uma Consulta
                </TabsTrigger>
              </TabsList>
              <TabsContent value="contact">
                <div className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                    Como Podemos Ajudá-lo?
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="backdrop-blur-sm border border-white/10">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Consultas Gerais</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          Para dúvidas gerais sobre nossos serviços, produtos ou informações da empresa.
                        </p>
                        <div className="mt-4">
                          <p className="text-sm text-orange-500">contato@gfconstrutora.com.br</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="backdrop-blur-sm border border-white/10">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Vendas e Orçamentos</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          Para informações de preços, orçamentos de projetos personalizados ou para fazer um pedido.
                        </p>
                        <div className="mt-4">
                          <p className="text-sm text-orange-500">vendas@gfconstrutora.com.br</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="backdrop-blur-sm border border-white/10">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Suporte ao Cliente</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          Para atendimento pós-venda, consultas sobre garantia ou suporte técnico.
                        </p>
                        <div className="mt-4">
                          <p className="text-sm text-orange-500">suporte@gfconstrutora.com.br</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center text-slate-600 dark:text-slate-400 text-sm">
                    <p>Nosso objetivo é responder a todas as consultas dentro de 24 horas úteis.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="consultation">
                <div className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                  <BookingForm />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-20 md:py-24 bg-slate-100 dark:bg-slate-900/50 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 dark:to-slate-800/30" />

          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900 dark:text-white">
                Perguntas <span className="text-orange-500">Frequentes</span>
              </h2>

              <FAQ />
            </div>
          </div>
        </section>

        <section className="relative h-[400px] md:h-[600px]">
          <div className="absolute inset-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.7751834629424!2d-48.5482400851746!3d-27.59426828280421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9527394eb2c632db%3A0x81bc550b73f6f6e5!2sFlorianópolis%2C%20SC!5e0!3m2!1spt!2sbr!4v1683117860124!5m2!1spt!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="absolute top-8 left-8 md:top-12 md:left-12 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg max-w-xs">
            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Nosso Showroom</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Visite nosso showroom para explorar nossas soluções premium em vidro e alumínio pessoalmente.
            </p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Florianópolis, Santa Catarina, Brasil</span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

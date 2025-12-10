
import Image from "next/image"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BlogPreview } from "@/components/blog-preview"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { getAllBlogPosts } from "@/lib/blog-data"

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          title="Conhecimento e Inspiração"
          highlightedText="Inspiração"
          description="Explore nossa coleção de artigos, guias e recursos sobre design em vidro, manutenção e tendências do setor"
          backgroundImage="/placeholder.svg?key=n2ems"
          badge="Nosso Blog"
        />

        <section className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 md:mb-0">
                Últimos <span className="text-orange-500">Artigos</span>
              </h2>

              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Buscar artigos..."
                    className="min-w-[250px] pl-10 bg-white dark:bg-slate-800"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {getAllBlogPosts()
                .slice(0, 6)
                .map((post, index) => (
                  <div key={post.slug} className={index === 0 ? "lg:col-span-2" : ""}>
                    <BlogPreview
                      slug={post.slug}
                      image={post.image}
                      title={post.title}
                      excerpt={post.excerpt}
                      date={post.date}
                      author={post.author}
                      category={post.category}
                    />
                  </div>
                ))}

              <div className="lg:row-span-2 flex flex-col">
                <Card className="overflow-hidden border-0 bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 h-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Categorias Populares</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">Tendências de Design</Badge>
                      <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">Dicas de Manutenção</Badge>
                      <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">Guias de Instalação</Badge>
                      <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">Educação sobre Materiais</Badge>
                      <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">Vitrine de Projetos</Badge>
                      <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">Notícias do Setor</Badge>
                    </div>
                  </div>

                  <div className="border-t border-white/10 p-6">
                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Newsletter</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      Inscreva-se em nossa newsletter para receber as últimas atualizações, inspiração de design e ofertas
                      exclusivas.
                    </p>
                    <div className="space-y-3">
                      <Input type="email" placeholder="Seu endereço de email" className="bg-white/10 border-white/20" />
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Inscrever-se</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {getAllBlogPosts()
                .slice(6)
                .map((post) => (
                  <BlogPreview
                    key={post.slug}
                    slug={post.slug}
                    image={post.image}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    author={post.author}
                    category={post.category}
                  />
                ))}
            </div>

            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" className="bg-orange-500 text-white border-orange-500">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-slate-100 dark:bg-slate-900/50 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 dark:to-slate-800/30" />

          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                  Tem uma Pergunta ou <span className="text-orange-500">Ideia de Projeto?</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Nossa equipe de especialistas está pronta para ajudá-lo com qualquer dúvida ou para discutir seu próximo projeto.
                  Desde o conceito inicial até a instalação final, estamos aqui para dar vida à sua visão.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Link href="/contact">Entre em Contato</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10">
                    <Link href="/projects">Ver Nossos Projetos</Link>
                  </Button>
                </div>
              </div>

              <div className="relative h-[300px] md:h-[400px]">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Consulta de Design"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

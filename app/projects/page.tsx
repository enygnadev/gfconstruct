import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, User, Star, Eye } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Modern Curtain Wall Complex",
    description:
      "State-of-the-art curtain wall system featuring blue-tinted glass and precision aluminum framing for a prestigious commercial development.",
    image: "/images/curtain-wall-blue.webp",
    category: "Commercial",
    date: "December 2023",
    location: "Commercial District, Dar es Salaam",
    client: "Business Center Ltd",
    rating: 5.0,
    featured: true,
  },
  {
    id: 2,
    title: "Elegant Wooden Frame Mirror",
    description:
      "Stylish full-length wooden frame mirror that adds warmth and elegance to this contemporary bedroom space.",
    image: "/images/wooden-frame-mirror.jpeg",
    category: "Residential",
    date: "November 2023",
    location: "Modern Apartment, Dar es Salaam",
    client: "Private Residence",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Modern Minimalist Shower",
    description:
      "Sleek frameless glass shower enclosure with black fixtures, creating a modern and spacious bathroom environment.",
    image: "/images/frameless-shower.jpeg",
    category: "Bathroom",
    date: "October 2023",
    location: "Contemporary Apartment, Dar es Salaam",
    client: "Luxury Apartments",
    rating: 4.8,
  },
  {
    id: 4,
    title: "Frosted Glass Bathroom Door",
    description:
      "Elegant frosted glass door with premium chrome hardware, providing privacy while maintaining a light, open feel.",
    image: "/images/frosted-glass-door.jpeg",
    category: "Doors",
    date: "September 2023",
    location: "Luxury Villa, Dar es Salaam",
    client: "Private Villa",
    rating: 4.9,
  },
  {
    id: 5,
    title: "Tropical Glass Enclosure",
    description:
      "Custom glass shower enclosure designed to complement the tropical aesthetic of this luxury beach villa.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5549.jpg-8fCDDY84kB6sdgcjm8e0Tvfsm2YUOB.jpeg",
    category: "Residential",
    date: "August 2023",
    location: "Beach Villa, Zanzibar",
    client: "Resort Development",
    rating: 5.0,
  },
  {
    id: 6,
    title: "Freeform LED Mirror",
    description:
      "Custom-designed freeform mirror with integrated LED lighting, creating a stunning focal point in this contemporary apartment.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5552.jpg-e9OZPdzTjrlEnzvlPjwrJuPBcC68eo.jpeg",
    category: "Residential",
    date: "July 2023",
    location: "Modern Apartment, Dar es Salaam",
    client: "Executive Residence",
    rating: 4.9,
  },
  {
    id: 7,
    title: "Commercial Curtain Wall",
    description:
      "Modern curtain wall system installation for a prestigious office building, featuring energy-efficient glazing and sleek aluminum frames.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Curtain-wall-system.jpg-WHJFkiSNRjn78EIi6arWqAHfmukyV4.jpeg",
    category: "Commercial",
    date: "June 2023",
    location: "Business District, Dar es Salaam",
    client: "Corporate Tower",
    rating: 4.8,
  },
  {
    id: 8,
    title: "Luxury Garden Pergola",
    description:
      "Elegant glass pergola creating a stunning outdoor living space with weather protection and modern aesthetics.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pergola-Glass-b5T7wc4LxMeQPyPu9yEX61KxrMdsIY.webp",
    category: "Residential",
    date: "May 2023",
    location: "Private Estate, Oyster Bay",
    client: "Luxury Estate",
    rating: 5.0,
  },
  {
    id: 9,
    title: "Designer Glass Staircase",
    description:
      "Breathtaking glass staircase with premium hardware, serving as the centerpiece of this contemporary home.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Glass-Stairs-GFS_Web_02.jpg-Nt2Hu0UJY9dELbibqFcnpciBv1IDgS.jpeg",
    category: "Residential",
    date: "April 2023",
    location: "Modern Villa, Msasani",
    client: "Architect Residence",
    rating: 5.0,
  },
  {
    id: 10,
    title: "Contemporary Glass Balcony",
    description: "Modern glass balcony extension with black aluminum frames, maximizing views while ensuring safety.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Moss-Close4-Cropped.jpg-2G67GYOGEF0z4yLSfbacwlw0y1EYce.jpeg",
    category: "Residential",
    date: "March 2023",
    location: "Luxury Apartment, Dar es Salaam",
    client: "High-rise Development",
    rating: 4.9,
  },
  {
    id: 11,
    title: "Premium French Door Installation",
    description:
      "Sophisticated black aluminum French doors with large glass panels, creating seamless indoor-outdoor living.",
    image: "/images/aluminum-french-doors-interior.webp",
    category: "Doors",
    date: "February 2023",
    location: "Luxury Residence, Oyster Bay",
    client: "Private Home",
    rating: 4.8,
  },
  {
    id: 12,
    title: "Advanced Curtain Wall Engineering",
    description:
      "Technical excellence in curtain wall design featuring precision aluminum framing and energy-efficient glazing.",
    image: "/images/curtain-wall-detail.jpeg",
    category: "Commercial",
    date: "January 2023",
    location: "Corporate Complex, Dar es Salaam",
    client: "International Bank",
    rating: 4.9,
  },
]

const categories = ["Todos os Projetos", "Residencial", "Comercial", "Banheiros", "Portas"]

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          title="Nossos Projetos em Destaque"
          highlightedText="Projetos"
          description="Explore nosso portfólio de instalações premium em vidro e alumínio"
          backgroundImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5549.jpg-8fCDDY84kB6sdgcjm8e0Tvfsm2YUOB.jpeg"
          badge="Nosso Portfólio"
        />

        {/* Projects Navigation */}
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

        {/* Portfolio Stats */}
        <section className="py-12 bg-slate-50 dark:bg-slate-800/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Eye className="h-8 w-8 text-gold-500 mr-2" />
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">800+</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Projects Completed</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Star className="h-8 w-8 text-gold-500 mr-2" />
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">4.9</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Average Rating</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <User className="h-8 w-8 text-gold-500 mr-2" />
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">500+</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Happy Clients</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gold-500 mr-2" />
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">15+</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Cities Served</p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Tabs */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="All Projects" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-12 bg-slate-100 dark:bg-slate-800">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-gold-500 data-[state=active]:text-slate-900 text-xs md:text-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} id={category.toLowerCase().replace(" ", "-")}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects
                      .filter((project) => category === "All Projects" || project.category === category)
                      .map((project) => (
                        <Card
                          key={project.id}
                          className="overflow-hidden border-0 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                              <Badge className="bg-gold-500 hover:bg-gold-600 text-slate-900">{project.category}</Badge>
                              {project.featured && (
                                <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Featured</Badge>
                              )}
                            </div>

                            <div className="absolute top-4 right-4">
                              <Badge className="bg-white/90 text-slate-800">
                                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                {project.rating}
                              </Badge>
                            </div>

                            {/* Project Title */}
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                            </div>
                          </div>

                          <CardContent className="p-6">
                            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                              {project.description}
                            </p>

                            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{project.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{project.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{project.client}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-lg text-slate-300">
                Contact us today to discuss your vision and receive a personalized quote
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gold-500 hover:bg-gold-600 text-slate-900 text-base px-8 py-6">
                <Link href="/contact">Request a Quote</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-base px-8 py-6 bg-transparent"
              >
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

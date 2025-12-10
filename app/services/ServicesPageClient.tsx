"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Phone, MessageCircle, CheckCircle, Award, Clock, Shield } from "lucide-react"
import Image from "next/image"
import { PageHeader } from "@/components/page-header"

const services = [
  {
    id: 1,
    name: "Aluminium Windows",
    category: "Windows & Doors",
    description: "High-quality aluminum windows designed for durability and energy efficiency.",
    longDescription:
      "Our premium aluminum windows combine modern aesthetics with superior functionality. Engineered for the Tanzanian climate, these windows offer excellent thermal performance, weather resistance, and long-lasting durability.",
    image: "/images/Glass-Aluminum-Doors-Pomona.jpg",
    features: ["Energy Efficient", "Weather Resistant", "Custom Sizes", "Modern Design"],
    rating: 4.9,
    completedProjects: 150,
    warranty: "10 Years",
    installationTime: "2-3 Days",
    popular: true,
  },
  {
    id: 2,
    name: "French Doors",
    category: "Windows & Doors",
    description: "Elegant French doors that bring natural light and sophistication to your space.",
    longDescription:
      "Transform your living spaces with our exquisite French doors. Perfect for connecting indoor and outdoor areas, these doors feature premium glass panels and robust aluminum frames.",
    image: "/images/aluminum-french-doors-interior.webp",
    features: ["Premium Glass", "Aluminum Frame", "Indoor/Outdoor", "Custom Design"],
    rating: 4.8,
    completedProjects: 89,
    warranty: "8 Years",
    installationTime: "1-2 Days",
    popular: false,
  },
  {
    id: 3,
    name: "Glass Balconies",
    category: "Balconies & Railings",
    description: "Modern glass balcony solutions for residential and commercial properties.",
    longDescription:
      "Create stunning outdoor spaces with our contemporary glass balcony systems. Featuring tempered safety glass and premium aluminum railings for maximum safety and visual appeal.",
    image: "/images/modern-villa-corner-glass.jpg",
    features: ["Safety Glass", "Aluminum Railing", "Weather Proof", "Modern Style"],
    rating: 4.9,
    completedProjects: 67,
    warranty: "12 Years",
    installationTime: "3-4 Days",
    popular: true,
  },
  {
    id: 4,
    name: "French Windows",
    category: "Windows & Doors",
    description: "Classic French windows that add elegance and natural light to any room.",
    longDescription:
      "Our French windows combine traditional charm with modern engineering. Perfect for both residential and commercial applications, offering excellent ventilation and natural lighting.",
    image: "/placeholder.svg?height=300&width=400&text=French+Windows",
    features: ["Traditional Design", "Natural Light", "Ventilation", "Custom Fit"],
    rating: 4.7,
    completedProjects: 78,
    warranty: "8 Years",
    installationTime: "2-3 Days",
    popular: false,
  },
  {
    id: 5,
    name: "Glass Partitions",
    category: "Interior Solutions",
    description: "Modern glass partitions for offices and residential spaces.",
    longDescription:
      "Divide spaces elegantly with our premium glass partition systems. Ideal for creating private areas while maintaining an open, airy feel in offices and homes.",
    image: "/images/frosted-glass-door.jpeg",
    features: ["Space Division", "Natural Light", "Modern Look", "Easy Installation"],
    rating: 4.8,
    completedProjects: 134,
    warranty: "5 Years",
    installationTime: "1 Day",
    popular: true,
  },
  {
    id: 6,
    name: "Custom Mirrors",
    category: "Mirrors & Glass",
    description: "Bespoke mirror solutions for residential and commercial applications.",
    longDescription:
      "Enhance your spaces with our custom-made mirrors. From decorative wall mirrors to functional bathroom mirrors, we create pieces that perfectly fit your vision and space.",
    image: "/images/wooden-frame-mirror.jpeg",
    features: ["Custom Sizes", "Various Shapes", "Quality Glass", "Professional Installation"],
    rating: 4.9,
    completedProjects: 203,
    warranty: "7 Years",
    installationTime: "1 Day",
    popular: false,
  },
  {
    id: 7,
    name: "Shower Enclosures",
    category: "Bathroom Solutions",
    description: "Premium glass shower enclosures for modern bathrooms.",
    longDescription:
      "Transform your bathroom with our elegant glass shower enclosures. Featuring tempered safety glass and premium hardware for a luxurious bathing experience.",
    image: "/images/frameless-shower.jpeg",
    features: ["Tempered Glass", "Premium Hardware", "Water Tight", "Easy Cleaning"],
    rating: 4.8,
    completedProjects: 156,
    warranty: "6 Years",
    installationTime: "1-2 Days",
    popular: true,
  },
  {
    id: 8,
    name: "Curtain Wall Systems",
    category: "Commercial Solutions",
    description: "Professional curtain wall systems for commercial buildings.",
    longDescription:
      "Our curtain wall systems provide superior weather protection and energy efficiency for commercial buildings. Engineered for high-rise applications with premium materials.",
    image: "/images/curtain-wall-system.jpg",
    features: ["Weather Protection", "Energy Efficient", "High-Rise Ready", "Professional Grade"],
    rating: 4.9,
    completedProjects: 23,
    warranty: "15 Years",
    installationTime: "1-2 Weeks",
    popular: false,
  },
  {
    id: 9,
    name: "Glass Canopies",
    category: "Exterior Solutions",
    description: "Stylish glass canopies for entrances and outdoor areas.",
    longDescription:
      "Protect and enhance your building entrances with our modern glass canopies. Combining functionality with aesthetic appeal for both residential and commercial properties.",
    image: "/images/pergola-glass-modern.webp",
    features: ["Weather Protection", "Modern Design", "Durable Frame", "Custom Sizes"],
    rating: 4.7,
    completedProjects: 45,
    warranty: "10 Years",
    installationTime: "2-3 Days",
    popular: false,
  },
]

const categories = [
  "All Services",
  "Windows & Doors",
  "Balconies & Railings",
  "Interior Solutions",
  "Mirrors & Glass",
  "Bathroom Solutions",
  "Commercial Solutions",
  "Exterior Solutions",
]

const whatsappNumber = "255758594048"

const generateWhatsAppLink = (serviceName: string) => {
  const message = `Hello! I'm interested in getting a quotation for ${serviceName}. Could you please provide me with more details and pricing information?`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

export default function ServicesPageClient() {
  const popularServices = services.filter((service) => service.popular)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <PageHeader
        title="Our Services"
        description="Professional glass and aluminum solutions tailored to your needs"
        backgroundImage="/images/modern-building-facade.jpeg"
      />

      {/* Popular Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most requested services, trusted by hundreds of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <Card
                key={service.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-orange-500 text-white">Popular</Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{service.rating}</span>
                      <span className="text-sm opacity-75">({service.completedProjects} projects)</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.open(generateWhatsAppLink(service.name), "_blank")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Get Free Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Services Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Service Portfolio</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our full range of professional glass and aluminum solutions
            </p>
          </div>

          <Tabs defaultValue="All Services" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs lg:text-sm">
                  {category.replace(" & ", " & ")}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services
                    .filter((service) => category === "All Services" || service.category === category)
                    .map((service) => (
                      <Card
                        key={service.id}
                        className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {service.popular && (
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-orange-500 text-white">Popular</Badge>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="font-bold text-xl mb-2">{service.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{service.rating}</span>
                              </div>
                              <span className="text-sm opacity-75">•</span>
                              <span className="text-sm opacity-75">{service.completedProjects} completed</span>
                            </div>
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                              {service.category}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <p className="text-gray-600 mb-4 leading-relaxed">{service.longDescription}</p>

                          <div className="space-y-4 mb-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                              <div className="flex flex-wrap gap-2">
                                {service.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="flex flex-col items-center">
                                <Shield className="h-5 w-5 text-blue-600 mb-1" />
                                <span className="text-xs text-gray-600">Warranty</span>
                                <span className="text-sm font-semibold">{service.warranty}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <Clock className="h-5 w-5 text-green-600 mb-1" />
                                <span className="text-xs text-gray-600">Installation</span>
                                <span className="text-sm font-semibold">{service.installationTime}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <Award className="h-5 w-5 text-orange-600 mb-1" />
                                <span className="text-xs text-gray-600">Projects</span>
                                <span className="text-sm font-semibold">{service.completedProjects}+</span>
                              </div>
                            </div>
                          </div>

                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                            onClick={() => window.open(generateWhatsAppLink(service.name), "_blank")}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Get Free Quotation
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Cheval Mirrors?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Over 15 years of excellence in glass and aluminum solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">15+ Years Experience</h3>
              <p className="opacity-90">Trusted expertise in glass and aluminum installations</p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="opacity-90">Premium materials with comprehensive warranties</p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Installation</h3>
              <p className="opacity-90">Efficient service with minimal disruption</p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="opacity-90">Always available for consultation and support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get a free consultation and quotation for your glass and aluminum project today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4"
              onClick={() => window.open(generateWhatsAppLink("General Consultation"), "_blank")}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Get Free Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-4 bg-transparent"
              onClick={() => window.open(`tel:+${whatsappNumber}`, "_self")}
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

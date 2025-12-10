
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Phone,
  Star,
  Award,
  Users,
  CheckCircle,
  Calculator,
  ArrowDown,
  X,
  Play,
  Volume2,
  VolumeX,
  Pause,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CostEstimator } from "@/components/cost-estimator"

// Enhanced video hook for better mobile support
function useVideoAutoplay() {
  const [userInteracted, setUserInteracted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768,
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Track user interaction for autoplay policy compliance
    const handleUserInteraction = () => {
      setUserInteracted(true)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("click", handleUserInteraction)
    }

    document.addEventListener("touchstart", handleUserInteraction, { passive: true })
    document.addEventListener("click", handleUserInteraction)

    return () => {
      window.removeEventListener("resize", checkMobile)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("click", handleUserInteraction)
    }
  }, [])

  return { userInteracted, isMobile }
}

// Enhanced video component with better mobile support
function VideoPlayer({
  src,
  poster,
  className = "",
  autoPlay = true,
  onVideoClick,
  showControls = false,
}: {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  onVideoClick?: () => void
  showControls?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const { userInteracted, isMobile } = useVideoAutoplay()

  const playVideo = useCallback(async () => {
    if (!videoRef.current) return

    try {
      // Ensure video properties are set correctly
      videoRef.current.muted = true
      videoRef.current.playsInline = true

      await videoRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.warn("Video autoplay failed:", error)
      setIsPlaying(false)
    }
  }, [])

  const pauseVideo = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseVideo()
    } else {
      playVideo()
    }
  }, [isPlaying, playVideo, pauseVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoaded(true)
      // Try to play immediately when loaded if autoplay is enabled
      if (autoPlay && (userInteracted || !isMobile)) {
        playVideo()
      }
    }

    const handleError = () => {
      setHasError(true)
      console.error("Video failed to load:", src)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    // Set initial video properties
    video.muted = true
    video.playsInline = true
    video.preload = "metadata"

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [src, autoPlay, userInteracted, isMobile, playVideo])

  // Intersection Observer for play/pause on scroll
  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoPlay) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Only autoplay if user has interacted or it's not mobile
            if (userInteracted || !isMobile) {
              playVideo()
            }
          } else {
            pauseVideo()
          }
        })
      },
      {
        threshold: [0.5],
        rootMargin: "50px",
      },
    )

    observer.observe(video)

    return () => observer.disconnect()
  }, [autoPlay, userInteracted, isMobile, playVideo, pauseVideo])

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <Play className="w-12 h-12 mx-auto mb-2" />
          <p>Vídeo indisponível</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} onClick={onVideoClick}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        Seu navegador não suporta a tag de vídeo.
      </video>

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Play/Pause overlay for mobile or when controls are shown */}
      {(showControls || (isMobile && !isPlaying)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button
            onClick={(e) => {
              e.stopPropagation()
              togglePlayPause()
            }}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
          </button>
        </div>
      )}
    </div>
  )
}

// Custom hook to detect when an element is visible in the viewport
function useInView(threshold = 0.3) {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold })

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [threshold])

  const callbackRef = (node: HTMLDivElement | null) => {
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current)
    }

    if (node && observerRef.current) {
      observerRef.current.observe(node)
    }

    elementRef.current = node
  }

  return { ref: callbackRef, isInView }
}

export default function ClassicHomePage() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedShowcase, setSelectedShowcase] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const showcaseRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const heroSlides = [
    {
      type: "image",
      image: "/images/curtain-wall-blue.webp",
      title: "Excelência Arquitetônica",
      subtitle: "Onde Visão Encontra Precisão",
      description: "Soluções premium em alumínio e vidro. Qualidade catarinense com padrão internacional.",
      cta: "Descubra Nossa Arte",
      accent: "Premium",
    },
    {
      type: "image",
      image: "/images/aluminum-french-doors-interior.webp",
      title: "Vida Integrada",
      subtitle: "Harmonia Interior e Exterior",
      description: "Sistemas de portas sofisticados onde funcionalidade encontra perfeição estética.",
      cta: "Explorar Soluções",
      accent: "Luxo",
    },
    {
      type: "video",
      video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snapins-ai_3604849042971352178-RDIWUAg2KsqtcSQBFvsJStUlMqSL3u.MP4",
      poster: "/placeholder.svg?height=600&width=800&text=Video+Preview+1",
      title: "Artesanato Revelado",
      subtitle: "Por Trás de Cada Obra-Prima",
      description:
        "Testemunhe a arte e precisão que define nosso trabalho. Cada detalhe aperfeiçoado através da expertise.",
      cta: "Veja Nosso Processo",
      accent: "Arte",
    },
    {
      type: "image",
      image: "/images/modern-building-facade.jpeg",
      title: "Sofisticação Urbana",
      subtitle: "Definindo Horizontes da Cidade",
      description: "De espaços íntimos a fachadas imponentes. Soluções inovadoras em vidro e alumínio.",
      cta: "Ver Portfólio",
      accent: "Inovação",
    },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const showcaseGallery = [
    {
      id: "curtain-wall-systems",
      title: "Sistemas Modernos de Fachada Cortina",
      category: "Comercial",
      type: "image",
      image: "/images/curtain-wall-blue.webp",
      description:
        "Sistemas avançados de fachada cortina que definem a arquitetura comercial moderna com engenharia de precisão e estética deslumbrante.",
    },
    {
      id: "process-video",
      title: "Fabricação de Esquadrias",
      category: "Bastidores",
      type: "video",
      video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snapins-ai_3604849042971352178-RDIWUAg2KsqtcSQBFvsJStUlMqSL3u.MP4",
      poster: "/placeholder.svg?height=400&width=600&text=Manufacturing+Process",
      description:
        "Veja nossos artesãos especializados criarem esquadrias de alumínio premium com precisão e qualidade superior.",
    },
    {
      id: "aluminum-french-doors",
      title: "Sistemas Premium de Portas Francesas",
      category: "Portas Residenciais",
      type: "image",
      image: "/images/aluminum-french-doors-interior.webp",
      description:
        "Elegantes portas francesas de alumínio que conectam perfeitamente espaços internos e externos com sofisticação moderna.",
    },
    {
      id: "installation-video",
      title: "Instalação Profissional",
      category: "Instalação",
      type: "video",
      video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snapins-ai_3583088495040956202-dGAB8XPSYdKH6JstF4cYjhBoOTSRMb.MP4",
      poster: "/placeholder.svg?height=400&width=600&text=Installation+Process",
      description:
        "Veja nossa equipe especializada em instalação entregar instalações impecáveis de esquadrias com precisão.",
    },
    {
      id: "commercial-facades",
      title: "Sistemas de Vidro para Residência de Luxo",
      category: "Residencial",
      type: "image",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3052.jpg-2pQJ2vRxuPj1XkozGIiEFRUURxqsjC.jpeg",
      description:
        "Deslumbrante residência de luxo com portas deslizantes de alumínio premium e janelas do chão ao teto com vista privilegiada.",
    },
    {
      id: "curtain-wall-detail",
      title: "Engenharia de Fachada Cortina",
      category: "Técnico",
      type: "image",
      image: "/images/curtain-wall-detail.jpeg",
      description:
        "Vista detalhada de nossos sistemas de fachada cortina com engenharia de precisão e tecnologia avançada de estruturas de alumínio.",
    },
  ]

  const featuredServices = [
    {
      title: "Fachadas de Vidro",
      subtitle: "Elegância Arquitetônica Premium",
      description:
        "Sistemas de fachadas em vidro de alta performance com tecnologia avançada. Soluções personalizadas que combinam estética moderna com eficiência energética e durabilidade excepcional.",
      image: "/images/curtain-wall-blue.webp",
      features: ["Vidro Temperado Premium", "Isolamento Térmico", "Design Personalizado", "Certificação de Qualidade"],
    },
    {
      title: "Esquadrias de Alumínio",
      subtitle: "Precisão e Sofisticação",
      description:
        "Janelas e portas em alumínio de qualidade superior, projetadas com perfis de alta resistência. Acabamentos premium e sistemas de vedação avançados para máximo conforto.",
      image: "/images/aluminum-doors-commercial.webp",
      features: ["Perfis de Alta Qualidade", "Vedação Avançada", "Acabamentos Premium", "Resistência Superior"],
    },
    {
      title: "Coberturas de Vidro",
      subtitle: "Luz Natural Maximizada",
      description:
        "Estruturas de cobertura em vidro laminado e temperado, criando ambientes únicos com abundante luz natural. Soluções técnicas para pérgolas, átrios e espaços comerciais sofisticados.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3051.jpg-fCDIb9EQnD8J7WK294cEZcSefaLmLn.jpeg",
      features: ["Vidro Laminado", "Estrutura Robusta", "Luz Natural", "Design Inovador"],
    },
    {
      title: "Divisórias Corporativas",
      subtitle: "Ambientes Profissionais Modernos",
      description:
        "Sistemas de divisórias em vidro e alumínio para escritórios e espaços corporativos. Soluções modulares que proporcionam privacidade acústica mantendo a integração visual dos ambientes.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pergola-Glass-b5T7wc4LxMeQPyPu9yEX61KxrMdsIY.webp",
      features: ["Isolamento Acústico", "Sistemas Modulares", "Integração Visual", "Flexibilidade Total"],
    },
  ]

  const testimonials = [
    {
      quote:
        "A GF Construtora transformou nossa residência com esquadrias de alumínio de qualidade excepcional. A atenção aos detalhes e qualidade do trabalho é simplesmente incomparável em Santa Catarina.",
      author: "Maria Silva",
      position: "Cliente Residencial",
      company: "Tubarão - SC",
      rating: 5,
    },
    {
      quote:
        "As portas de alumínio que eles instalaram transformaram completamente a entrada do nosso escritório. A qualidade e instalação foram impecáveis.",
      author: "Dr. João Santos",
      position: "Cliente Particular",
      company: "Centro de Tubarão",
      rating: 5,
    },
    {
      quote:
        "Serviço profissional desde a consulta até a instalação. Seus sistemas de esquadrias de alumínio elevaram nosso edifício à qualidade superior.",
      author: "Ana Oliveira",
      position: "Arquiteta",
      company: "Elite Projetos SC",
      rating: 5,
    },
  ]

  const portfolioHighlights = [
    {
      title: "Sistemas de Vidro para Residência de Luxo",
      category: "Residencial",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3052.jpg-2pQJ2vRxuPj1XkozGIiEFRUURxqsjC.jpeg",
      description:
        "Sistemas premium de portas deslizantes de alumínio com vidro do chão ao teto para residência de luxo com vista privilegiada",
      year: "2024",
    },
    {
      title: "Instalação de Portas Francesas de Luxo",
      category: "Residencial",
      image: "/images/aluminum-french-doors-interior.webp",
      description: "Portas francesas de alumínio premium conectando espaços internos e externos",
      year: "2024",
    },
    {
      title: "Arquitetura Residencial Moderna",
      category: "Residencial",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3053.jpg-NkmnuDL2PXKjLRlm77xHLncnVWyTNK.jpeg",
      description:
        "Residência contemporânea com características sofisticadas de vidro em esquina e sistemas premium de janelas de alumínio",
      year: "2024",
    },
  ]

  const stats = [
    { number: "500+", label: "Clientes Satisfeitos", icon: Users },
    { number: "8+", label: "Anos de Excelência", icon: Award },
    { number: "1000+", label: "Projetos Concluídos", icon: CheckCircle },
    { number: "98%", label: "Satisfação do Cliente", icon: Star },
  ]

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Padrões de Qualidade Superior",
      description:
        "Materiais premium e mão de obra qualificada que atendem aos mais altos padrões de qualidade para durabilidade excepcional.",
      color: "text-blue-600",
    },
    {
      icon: Clock,
      title: "Entrega Pontual de Projetos",
      description: "Gestão profissional de projetos garantindo que suas instalações sejam concluídas no prazo acordado.",
      color: "text-green-600",
    },
    {
      icon: Sparkles,
      title: "Soluções de Design Personalizadas",
      description:
        "Soluções sob medida em alumínio e vidro adaptadas à sua visão arquitetônica única e requisitos específicos.",
      color: "text-orange-600",
    },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [heroSlides.length, isAutoPlaying])

  const nextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const toggleMute = () => {
    setIsVideoMuted(!isVideoMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted
    }
  }

  const openShowcase = (id: string) => {
    setSelectedShowcase(id)
    document.body.style.overflow = "hidden"
  }

  const openVideo = (videoSrc: string) => {
    setSelectedVideo(videoSrc)
    document.body.style.overflow = "hidden"
  }

  const closeShowcase = () => {
    setSelectedShowcase(null)
    document.body.style.overflow = "auto"
  }

  const closeVideo = () => {
    setSelectedVideo(null)
    document.body.style.overflow = "auto"
  }

  const scrollToShowcase = () => {
    showcaseRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Enhanced Hero Section */}
      <section className="relative h-[70vh] md:h-screen overflow-hidden">
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3054.jpg-jbEIhcQZcKqyG7Gg8af1ktovXlRxIt.jpeg"
              alt="Residência Moderna de Luxo com Esquadrias Premium de Alumínio"
              fill
              className="object-cover"
              priority
              quality={100}
            />

            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"
                style={{
                  clipPath: "polygon(0 0, 70% 0, 50% 100%, 0% 100%)",
                }}
              />
            </div>

            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container-professional">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-4 md:mb-8"
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white/90 text-xs md:text-sm font-medium">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-400 rounded-full animate-pulse" />
                  Criado por Enygna & GF Construtora
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-3 md:mb-6"
              >
                Construção
                <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Excelência
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base md:text-xl text-white/80 mb-6 md:mb-10 max-w-lg"
              >
                Especialistas em construção civil com mais de 8 anos de experiência. Realizamos projetos residenciais,
                comerciais e industriais com qualidade superior e acabamento impecável.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4"
              >
                <Button
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/contact">
                    Iniciar Projeto
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </Button>

                <Button
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg rounded-xl backdrop-blur-xl transition-all duration-300"
                  onClick={scrollToShowcase}
                >
                  <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Assistir
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            onClick={scrollToShowcase}
            className="flex flex-col items-center gap-1 md:gap-2 text-white/60 hover:text-white transition-colors duration-300"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <span className="text-xs md:text-sm">Rolar</span>
            <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
          </motion.button>
        </motion.div>
      </section>

      {/* Enhanced Visual Showcase Gallery */}
      <section id="showcase" ref={showcaseRef} className="py-10 md:py-20 bg-gray-50">
        <div className="container-professional">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-light text-gray-900 mb-2 md:mb-4">
              Nossos Projetos em Destaque
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-orange-400 mx-auto mb-4 md:mb-8" />
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-light px-4">
              Descubra a qualidade e precisão por trás de nossas construções residenciais, comerciais e industriais.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {showcaseGallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="cursor-pointer group overflow-hidden"
                onClick={() => (item.type === "video" ? openVideo(item.video!) : openShowcase(item.id))}
              >
                <div className="relative h-48 md:h-80 overflow-hidden rounded-lg">
                  {item.type === "video" ? (
                    <VideoPlayer
                      src={item.video!}
                      poster={item.poster}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                      onVideoClick={() => openVideo(item.video!)}
                      showControls={false}
                    />
                  ) : (
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}

                  <div className="absolute top-2 left-2 md:top-4 md:left-4">
                    <span className="px-2 py-1 md:px-3 md:py-1 bg-white/90 text-gray-900 text-xs md:text-sm font-medium rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-3 md:p-6">
                    <h3 className="text-sm md:text-xl font-display text-white mb-1 md:mb-2">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-10 md:py-20 bg-white">
        <div className="container-professional">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-light text-gray-900 mb-2 md:mb-4">
              Bastidores
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-orange-400 mx-auto mb-4 md:mb-8" />
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-light px-4">
              Veja nossos artesãos especializados trabalhando e a precisão que entra em cada projeto.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snapins-ai_3604849042971352178-RDIWUAg2KsqtcSQBFvsJStUlMqSL3u.MP4",
                poster: "/placeholder.svg?height=400&width=600&text=Manufacturing+Process",
                title: "Processo de Fabricação",
                description: "Veja nosso artesanato de precisão em ação",
              },
              {
                src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snapins-ai_3583088495040956202-dGAB8XPSYdKH6JstF4cYjhBoOTSRMb.MP4",
                poster: "/placeholder.svg?height=400&width=600&text=Installation+Process",
                title: "Instalação Profissional",
                description: "Instalação especializada com atenção aos detalhes",
              },
            ].map((video, index) => (
              <motion.div
                key={video.src}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => openVideo(video.src)}
              >
                <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden rounded-xl">
                  <VideoPlayer
                    src={video.src}
                    poster={video.poster}
                    className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                    onVideoClick={() => openVideo(video.src)}
                    showControls={true}
                  />

                  <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6">
                    <h3 className="text-base md:text-xl font-display text-white mb-1 md:mb-2">{video.title}</h3>
                    <p className="text-white/80 text-xs md:text-sm">{video.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classic Introduction Section */}
      <section className="py-10 md:py-20 bg-white">
        <div className="container-professional">
          <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-light text-gray-900 mb-3 md:mb-6 px-4">
                Onde a Tradição da Construção
                <span className="block text-blue-600">Encontra a Inovação Catarinense</span>
              </h2>
              <div className="w-16 md:w-24 h-0.5 md:h-1 bg-orange-400 mx-auto mb-4 md:mb-8" />
              <p className="text-base md:text-xl lg:text-2xl text-gray-600 leading-relaxed font-light px-4">
                Por mais de oito anos, a GF Construtora tem sido referência em construção civil em Tubarão, Santa
                Catarina, oferecendo soluções completas para clientes que buscam qualidade e confiabilidade.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 md:pt-16"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <div className="text-xl md:text-3xl lg:text-4xl font-display font-light text-gray-900 mb-1 md:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-10 md:py-20 bg-white">
        <div className="container-professional">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-20"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-light text-gray-900 mb-3 md:mb-6 px-4">
              Nossos Serviços
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-orange-400 mx-auto mb-4 md:mb-8" />
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-light px-4">
              Oferecemos soluções completas em construção civil, desde projetos residenciais até grandes empreendimentos
              comerciais e industriais.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative h-48 md:h-80 mb-4 md:mb-8 overflow-hidden rounded-lg">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="space-y-3 md:space-y-6">
                  <div>
                    <h3 className="text-lg md:text-2xl font-display font-light text-gray-900 mb-1 md:mb-2">
                      {service.title}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2 md:mb-4 text-sm md:text-base">{service.subtitle}</p>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{service.description}</p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 md:gap-3">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-400 rounded-full" />
                        <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="btn-outline-blue w-full text-sm md:text-base" asChild>
                    <Link href="/services">
                      Ver Mais Serviços
                      <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="container-professional">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-20"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-light text-gray-900 mb-3 md:mb-6 px-4">
              Destaques do Portfólio
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-orange-400 mx-auto mb-4 md:mb-8" />
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-light px-4">
              Uma vitrine de nossos melhores trabalhos, demonstrando nosso compromisso com a excelência e atenção aos
              detalhes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {portfolioHighlights.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative h-48 md:h-64 mb-3 md:mb-6 overflow-hidden rounded-lg">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-2 left-2 md:top-4 md:left-4">
                    <span className="px-2 py-1 md:px-3 md:py-1 bg-white/90 text-gray-900 text-xs md:text-sm font-medium rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="text-xs md:text-sm">{project.year}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-display font-light text-gray-900 mb-1 md:mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:mt-16"
          >
            <Button className="btn-blue text-base md:text-lg px-8 py-3 md:px-10 md:py-4" asChild>
              <Link href="/projects">
                Ver Portfólio Completo
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Cost Estimator Section */}
      <section className="py-10 md:py-20 bg-white">
        <div className="container-professional">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-light text-gray-900 mb-3 md:mb-6 px-4">
              Obtenha Seu Orçamento de Construção
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-orange-400 mx-auto mb-4 md:mb-8" />
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-light px-4">
              Use nossa calculadora interativa para obter uma estimativa instantânea para seu projeto de construção.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <CostEstimator />
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="container-professional">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-20"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-light text-gray-900 mb-2 md:mb-4 px-4">
              Depoimentos de Clientes
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-orange-400 mx-auto mb-4 md:mb-8" />
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-light px-4">
              Ouça de nossos clientes satisfeitos sobre sua experiência com a GF Construtora.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-4 md:p-8 rounded-xl shadow-lg"
              >
                <div className="flex mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.author}</div>
                  <div className="text-gray-600 text-xs md:text-sm">{testimonial.position}</div>
                  <div className="text-blue-600 text-xs md:text-sm font-medium">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container-professional">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-light mb-3 md:mb-6 px-4">
              Pronto para Transformar Seu Espaço?
            </h2>
            <p className="text-base md:text-xl mb-6 md:mb-10 max-w-2xl mx-auto opacity-90 px-4">
              Entre em contato conosco hoje para uma consulta gratuita e descubra como nossas soluções em construção
              civil podem transformar seu projeto em realidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Button
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg"
                asChild
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Orçamento Grátis
                </Link>
              </Button>
              <Button
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg"
                asChild
              >
                <Link href="/cost-estimator">
                  <Calculator className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Calculadora de Custos
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 md:py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container-professional">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-20"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-light text-gray-900 mb-3 md:mb-6 px-4">
              Por Que Escolher a GF Construtora
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-orange-400 mx-auto mb-4 md:mb-8" />
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-light px-4">
              Experimente a diferença que vem ao escolher os principais especialistas em construção civil de Tubarão,
              Santa Catarina.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 ${item.color} bg-gray-50 rounded-full flex items-center justify-center mb-4 md:mb-6`}
                >
                  <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Modal */}
      <AnimatePresence>
        {selectedShowcase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeShowcase}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeShowcase}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {(() => {
                const item = showcaseGallery.find((item) => item.id === selectedShowcase)
                if (!item) return null

                return (
                  <div>
                    <div className="relative h-64 md:h-96">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display font-light text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={closeVideo}
          >
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center p-4">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                autoPlay
                muted={isVideoMuted}
                playsInline
              >
                <source src={selectedVideo} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>

            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isVideoMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  )
}

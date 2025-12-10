import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface PageHeaderProps {
  title: string
  highlightedText?: string
  description: string
  backgroundImage: string
  badge?: string
}

export function PageHeader({ title, highlightedText, description, backgroundImage, badge }: PageHeaderProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={backgroundImage || "/placeholder.svg"} alt={title} fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-900" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {badge && <Badge className="mb-6 bg-gold-500/20 text-gold-500 border-gold-500/30 px-4 py-1.5">{badge}</Badge>}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            {highlightedText ? (
              <>
                {title.replace(highlightedText, "")} <span className="text-gradient">{highlightedText}</span>
              </>
            ) : (
              title
            )}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10">{description}</p>
        </div>
      </div>
    </section>
  )
}

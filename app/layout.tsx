
import type React from "react"
import "@/app/globals.css"
import { Inter, Playfair_Display, Cormorant_Garamond, Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"

// Initialize the fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata = {
  title: {
    default: "GF Construtora | Construção Civil e Reformas",
    template: "%s | GF Construtora",
  },
  description:
    "Serviços completos de construção civil, reformas e acabamentos. Especializados em obras residenciais, comerciais e industriais com qualidade premium e expertise técnica em Santa Catarina.",
  keywords: [
    "construtora",
    "construção civil",
    "reformas",
    "obras residenciais",
    "obras comerciais",
    "acabamentos",
    "alvenaria",
    "fundação",
    "estrutura metálica",
    "esquadrias de alumínio",
    "fachadas",
    "pintura predial",
    "revestimentos",
    "construção Tubarão",
    "construtora Santa Catarina",
  ],
  authors: [{ name: "GF Construtora" }],
  creator: "GF Construtora",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://gfconstrutora.com.br",
    title: "GF Construtora | Construção Civil e Reformas",
    description:
      "Serviços completos de construção civil, reformas e acabamentos com qualidade premium e expertise técnica em Santa Catarina.",
    siteName: "GF Construtora",
  },
  twitter: {
    card: "summary_large_image",
    title: "GF Construtora | Construção Civil e Reformas",
    description:
      "Serviços completos de construção civil, reformas e acabamentos com qualidade premium e expertise técnica.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${montserrat.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div suppressHydrationWarning>
              {children}
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

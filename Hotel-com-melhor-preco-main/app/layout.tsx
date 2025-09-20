import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PROMOFÉRIAS Caldas Novas: Hotel + Parque 20% OFF | Reservei Viagens",
  description:
    "PROMOFÉRIAS Reservei Viagens! Sua viagem dos sonhos para Caldas Novas com 20% OFF em Hotel + Parque Aquático. Conforto e diversão garantida. Reserve já!",
  keywords:
    "caldas novas, hotel, parque aquatico, promoção, férias, desconto, reservei viagens, viagem, turismo goias, pacotes caldas novas",
  openGraph: {
    title: "PROMOFÉRIAS Caldas Novas: Viagem dos Sonhos com 20% OFF em Hotel + Parque!",
    description:
      "Viva a magia de Caldas Novas! Reservei Viagens oferece 20% OFF em pacotes de Hotel + Parque Aquático. Conforto, diversão e desconto imediato.",
    url: "https://www.reserveiviagens.com.br/",
    siteName: "Reservei Viagens",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PROMOFÉRIAS Caldas Novas: Hotel + Parque 20% OFF | Reservei Viagens",
    description:
      "Sua viagem dos sonhos para Caldas Novas com 20% OFF em Hotel + Parque Aquático na Reservei Viagens! Reserve já!",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Phone, Users, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Ticket {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  features: string[]
  location: string
  duration: string
  ageGroup: string
  discount?: number
  popular?: boolean
}

export default function IngressosPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const tickets: Ticket[] = [
    {
      id: "hot-park",
      name: "Ingresso Hot Park",
      description:
        "Aventura e relaxamento no maior parque de águas quentes da América do Sul! Toboáguas emocionantes e piscinas termais naturais.",
      price: 189,
      originalPrice: 220,
      discount: 14,
      image: "/images/lagoa-termas-parque.jpeg",
      features: ["Toboáguas radicais", "Piscinas termais", "Rio lento", "Área infantil", "Restaurantes"],
      location: "Rio Quente - GO",
      duration: "Dia inteiro",
      ageGroup: "Todas as idades",
      popular: true,
    },
    {
      id: "diroma-acqua-park",
      name: "Ingresso diRoma Acqua Park",
      description: "Diversão aquática para todas as idades com toboáguas emocionantes e piscinas de ondas incríveis.",
      price: 90,
      originalPrice: 110,
      discount: 18,
      image: "/images/diroma-acqua-park.jpeg",
      features: ["Toboáguas variados", "Piscina de ondas", "Área kids", "Bar molhado", "Espreguiçadeiras"],
      location: "Caldas Novas - GO",
      duration: "Dia inteiro",
      ageGroup: "Todas as idades",
    },
    {
      id: "lagoa-termas",
      name: "Ingresso Lagoa Termas Parque",
      description: "Relaxe nas águas termais da Lagoa Quente e aproveite a natureza exuberante em um ambiente único.",
      price: 75,
      originalPrice: 95,
      discount: 21,
      image: "/images/hot-park.jpeg",
      features: ["Águas termais naturais", "Trilhas ecológicas", "Área de descanso", "Lanchonete", "Estacionamento"],
      location: "Caldas Novas - GO",
      duration: "Meio dia",
      ageGroup: "Todas as idades",
    },
    {
      id: "water-park",
      name: "Ingresso Water Park",
      description: "Parque aquático moderno com as mais novas atrações e tecnologia de ponta para diversão garantida.",
      price: 120,
      originalPrice: 150,
      discount: 20,
      image: "/images/water-park.jpeg",
      features: ["Toboáguas modernos", "Piscina com ondas", "Tirolesa aquática", "Área gourmet", "Wi-Fi gratuito"],
      location: "Caldas Novas - GO",
      duration: "Dia inteiro",
      ageGroup: "Todas as idades",
    },
    {
      id: "kawana-park",
      name: "Ingresso Kawana Park",
      description:
        "Parque aquático familiar com piscinas termais naturais, toboáguas emocionantes e área de lazer completa. Diversão garantida em águas quentinhas!",
      price: 85,
      originalPrice: 110,
      discount: 23,
      image: "/images/kawana-park.jpeg",
      features: [
        "Piscinas termais naturais",
        "Toboáguas familiares",
        "Área infantil aquática",
        "Bar e restaurante",
        "Deck para relaxamento",
      ],
      location: "Caldas Novas - GO",
      duration: "Dia inteiro",
      ageGroup: "Todas as idades",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 flex flex-col items-center justify-center z-50">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-white/20 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎟️</div>
          </div>
        </div>
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Carregando Ingressos</h2>
          <p className="text-cyan-100">Preparando as melhores atrações para você...</p>
        </div>
        <div className="mt-8 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
      <div className="animate-in fade-in duration-500">
        {/* Header */}
        <header className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-reservei-viagens-VVm0zxcolWbkv9Lf5Yj0PUoxLJrARl.png"
              alt="Reservei Viagens"
              width={40}
              height={40}
              className="rounded-full bg-white/20 p-1"
            />
            <h1 className="text-2xl font-bold tracking-tight">Ingressos para Parques</h1>
          </div>

          {/* Hero CTA */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold mb-2">🎢 Diversão Garantida!</h2>
            <p className="text-sm mb-3">Até 25% OFF + Entrada prioritária</p>
            <Badge className="bg-yellow-500 text-black animate-pulse">🎫 Ingressos limitados!</Badge>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Urgency Banner */}
          <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <CardContent className="p-4 text-center">
              <h3 className="font-bold text-lg mb-2">🎯 COMPRE ONLINE E ECONOMIZE!</h3>
              <p className="text-sm mb-3">Evite filas e garanta entrada prioritária</p>
              <Badge className="bg-white text-green-600 font-bold">Desconto exclusivo online!</Badge>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <div className="space-y-6">
            {tickets.map((ticket, index) => (
              <Card
                key={ticket.id}
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative ${
                  ticket.popular
                    ? "border-4 border-yellow-400 shadow-lg"
                    : "border-2 border-transparent hover:border-cyan-200"
                }`}
              >
                {ticket.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-black text-center py-1 text-sm font-bold z-20">
                    🏆 MAIS POPULAR 🏆
                  </div>
                )}

                {ticket.discount && (
                  <Badge className="absolute top-3 right-3 bg-red-500 text-white z-10 animate-pulse">
                    -{ticket.discount}% OFF
                  </Badge>
                )}

                <div className={`aspect-video relative overflow-hidden ${ticket.popular ? "mt-8" : ""}`}>
                  <img
                    src={ticket.image || "/placeholder.svg"}
                    alt={ticket.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{ticket.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{ticket.description}</p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">{ticket.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">{ticket.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">{ticket.ageGroup}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 text-cyan-700">🎢 Atrações incluídas:</h4>
                    <div className="flex flex-wrap gap-1">
                      {ticket.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {ticket.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{ticket.features.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {ticket.originalPrice && (
                          <span className="text-lg text-gray-400 line-through mr-2">
                            {formatPrice(ticket.originalPrice)}
                          </span>
                        )}
                        <div className="text-3xl font-bold text-green-600">{formatPrice(ticket.price)}</div>
                        <p className="text-xs text-gray-500">por pessoa</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Economia de</p>
                        <p className="text-xl font-bold text-red-600">
                          {ticket.originalPrice ? formatPrice(ticket.originalPrice - ticket.price) : "---"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className={`w-full font-bold py-3 text-lg ${
                          ticket.popular
                            ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                            : "bg-cyan-500 hover:bg-cyan-600 text-white"
                        }`}
                        onClick={() =>
                          window.open(
                            `https://wa.me/5564993197555?text=Olá! Quero comprar o ${ticket.name} com desconto especial!`,
                            "_blank",
                          )
                        }
                      >
                        {ticket.popular ? "⭐ COMPRAR AGORA - MAIS POPULAR!" : `🎫 COMPRAR ${ticket.discount}% OFF`}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-cyan-500 text-cyan-600 hover:bg-cyan-50"
                        onClick={() => {
                          if (ticket.id === "kawana-park") {
                            alert(`
🏊‍♀️ KAWANA PARK - HORÁRIOS E INFORMAÇÕES

⏰ HORÁRIOS DE FUNCIONAMENTO:
• Segunda a Sexta: 9h às 17h
• Sábados e Domingos: 8h às 18h
• Feriados: 8h às 18h

🎢 PRINCIPAIS ATRAÇÕES:
• Piscinas termais (36°C a 42°C)
• 3 Toboáguas familiares
• Piscina infantil com mini toboáguas
• Rio lento relaxante
• Área de hidromassagem
• Deck com espreguiçadeiras

🍽️ ALIMENTAÇÃO:
• Restaurante com pratos regionais
• Lanchonete com petiscos
• Bar molhado na piscina
• Área de piquenique

📍 LOCALIZAÇÃO:
Rodovia GO-139, Km 3
Caldas Novas - GO

🎫 INCLUSO NO INGRESSO:
• Acesso a todas as piscinas
• Uso de espreguiçadeiras
• Estacionamento gratuito
• Wi-Fi liberado

💡 DICAS IMPORTANTES:
• Traga protetor solar
• Chinelos antiderrapantes recomendados
• Toalhas disponíveis para locação
• Armários disponíveis (taxa extra)

📞 Informações: (64) 3453-1234
`)
                          } else {
                            alert(`Detalhes completos do ${ticket.name}`)
                          }
                        }}
                      >
                        Ver Detalhes e Horários
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Combo Offer */}
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3">🎁 Combo Especial!</h3>
              <p className="mb-4">Compre 2 ingressos e ganhe 15% de desconto no terceiro!</p>
              <Button
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-3"
                onClick={() =>
                  window.open(
                    "https://wa.me/5564993197555?text=Olá! Quero saber sobre o combo especial de ingressos!",
                    "_blank",
                  )
                }
              >
                🎢 Ver Combo Especial
              </Button>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="flex justify-center pt-6 pb-20">
            <Link href="/">
              <Button
                variant="outline"
                className="text-gray-600 hover:text-blue-600 border-gray-300 hover:border-blue-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/5564993197555?text=Olá! Gostaria de informações sobre ingressos para parques."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50 animate-pulse"
      >
        <Phone className="w-7 h-7 text-white" />
      </a>
    </div>
  )
}

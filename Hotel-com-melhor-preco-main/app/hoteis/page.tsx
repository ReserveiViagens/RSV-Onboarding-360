"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Star, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Hotel {
  id: string
  name: string
  stars: number
  description: string
  price: number
  originalPrice?: number
  images: string[]
  features: string[]
  location: string
  discount?: number
}

interface ImageGalleryProps {
  images: string[]
  alt: string
  popular?: boolean
}

function ImageGallery({ images, alt, popular }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className={`aspect-video relative overflow-hidden ${popular ? "mt-8" : ""}`}>
      <img
        src={images[currentImageIndex] || "/placeholder.svg"}
        alt={`${alt} - Foto ${currentImageIndex + 1}`}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentImageIndex + 1}/{images.length}
        </div>
      )}
    </div>
  )
}

export default function HoteisPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const hotels: Hotel[] = [
    {
      id: "spazzio-diroma",
      name: "Spazzio DiRoma",
      stars: 4,
      description:
        "Conforto e lazer completo com a qualidade diRoma. Piscinas termais naturais e estrutura completa para toda família.",
      price: 250,
      originalPrice: 312.5,
      discount: 20,
      images: [
        "/images/spazzio-diroma-hotel.jpg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20Viagens%20%281%29.jpg-7DhCDbMcNkgFfxxptkCNaraAWv9kQ7.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20Viagens%20%282%29.jpg-MjqWbBqajq4aJnz0SdR4sDrHr11Jv7.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20Viagens%20%2817%29.jpg-fcutcCanqZ9PdfdfCwPmYr0rkw3jjo.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20Viagens%20%2814%29.jpg-L1a1WYSclQgw2LQl4C3FbR5AhMaYMS.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20Viagens%20%2812%29.jpg-xMuEzIDnbv1U94YDSwmYZyWnlGjFCI.jpeg",
      ],
      features: ["Piscinas Termais", "Acqua Park", "Restaurante", "Wi-Fi Gratuito", "Estacionamento"],
      location: "Centro de Caldas Novas",
    },
    {
      id: "piazza-diroma",
      name: "Piazza DiRoma",
      stars: 5,
      description: "Sofisticação e acesso privilegiado aos parques diRoma. Arquitetura italiana e serviços premium.",
      price: 260,
      originalPrice: 325,
      discount: 20,
      images: [
        "/images/piazza-diroma-hotel.jpg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Piazza%20Didroma%20reservei%20Viagens%20%286%29.jpg-34SGE3Ulyc1owoVthnaoD8TTKMsPh7.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Piazza%20Didroma%20reservei%20Viagens%20%2829%29.jpg-gyJlNgGgJrvyWQm5cHWsoqQYr4819K.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Piazza%20Didroma%20reservei%20Viagens%20%2811%29.jpg-I7eNXZKVAFPQBpFM4VjUNBJueQU65s.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Piazza%20Didroma%20reservei%20Viagens%20%284%29.jpg-dilFRgcemOW9qrgduFmwvDi28VrwjM.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Piazza%20Didroma%20reservei%20Viagens%20%2810%29.jpg-ANSLABfJa5p4eRUtFh7cbRtE2l4FlA.jpeg",
      ],
      features: ["Arquitetura Italiana", "Spa Premium", "Piscinas Exclusivas", "Restaurante Gourmet", "Concierge"],
      location: "Área Nobre - Caldas Novas",
    },
    {
      id: "lacqua-diroma",
      name: "Lacqua DiRoma",
      stars: 4,
      description: "Parque aquático exclusivo e diversão para toda a família. Toboáguas e piscinas de ondas incríveis.",
      price: 440,
      originalPrice: 550,
      discount: 20,
      images: [
        "/images/lacqua-diroma-hotel.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/184981043%20%281%29-I2iuBzXMrj8RLrl2o2tI55osVahFhB.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/184981048-bOYk2CDC50epvKbMqur42WwuJY3KFa.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/184791350-uUG8zXfFhDuUjCSLOeiUZlMW6ws8lz.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/184981061-nskxe8zH6lqP5dh7TqQOVf4IXcWm8l.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/184981101-oQaDqYS6JwAzBzi9IL3Mj9ENvjNrJC.jpeg",
      ],
      features: ["Jardins Acqua Park", "Piscinas de Ondas", "Toboáguas", "Ofurôs", "Kids Club"],
      location: "Próximo ao Centro",
    },
    {
      id: "diroma-fiori",
      name: "DiRoma Fiori",
      stars: 3,
      description: "Hotel aconchegante com piscinas termais e tranquilidade. Perfeito para relaxar em família.",
      price: 407,
      originalPrice: 508.75,
      discount: 20,
      images: [
        "/images/diroma-fiori-hotel.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reserveiviagens%20%2825%29.jpg-AqUPM5y6756BhEMFxJMJ8b8tPzW9OB.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reserveiviagens%20%287%29.jpg-1sFY9scjcvnQrEmU0THq9l79YNTIgF.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reserveiviagens%20%2816%29.jpg-dBQzifSY483AebgJzFWFXAHIgDMm9d.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reserveiviagens%20%288%29.jpg-n7FCg21L50fma7r7FtNPNQL3OzSDmc.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reserveiviagens%20%282%29.jpg-fdOkeJDncCDm11LgAkeghldclZ29YR.jpeg",
      ],
      features: ["Ambiente Familiar", "Piscinas Termais", "Sauna", "Jardins", "Playground"],
      location: "Zona Residencial",
    },
    {
      id: "lagoa-eco-towers",
      name: "Lagoa Eco Towers",
      stars: 5,
      description:
        "Luxo e sustentabilidade em Caldas Novas. Torres ecológicas com vista panorâmica e serviços premium.",
      price: 850,
      originalPrice: 1062.5,
      discount: 20,
      images: [
        "/images/lagoa-eco-towers-hotel.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20lagoa%20eco%20towers.jpg-eflMoZcTLPAcWwsw2jeNXRi7xiNkHe.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20lagoa%20eco%20towers21.jpg-3LyCHJ4xvO5oh04ekDJTObJ06IfjOP.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20lagoa%20eco%20towers22.jpg-3hNMZMaM8G61R2mx1sNrRDBgj9LqI3.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20lagoa%20eco%20towers16.jpg-i8XQectrf6ICX2Icm9n4XoeCwNMUHy.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reservei%20lagoa%20eco%20towers23.jpg-qJ1QEKwClVemApK1Yz9Sn8gEfOImdW.jpeg",
      ],
      features: ["Torres Ecológicas", "Vista Panorâmica", "Spa Completo", "Gastronomia Premium", "Sustentabilidade"],
      location: "Área Premium",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center z-50">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-white/20 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🏨</div>
          </div>
        </div>
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Carregando Hotéis</h2>
          <p className="text-blue-100">Preparando as melhores opções para você...</p>
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
        <header className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-lg">
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
            <h1 className="text-2xl font-bold tracking-tight">Hotéis em Caldas Novas</h1>
          </div>

          {/* Hero CTA */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold mb-2">🔥 Ofertas Exclusivas!</h2>
            <p className="text-sm mb-3">Até 20% OFF + Estacionamento GRÁTIS</p>
            <Badge className="bg-yellow-500 text-black animate-pulse">⏰ Por tempo limitado!</Badge>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Urgency Banner */}
          <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <CardContent className="p-4 text-center">
              <h3 className="font-bold text-lg mb-2">⚡ ÚLTIMAS VAGAS DISPONÍVEIS!</h3>
              <p className="text-sm mb-3">Mais de 50 pessoas visualizando estes hotéis agora</p>
              <Badge className="bg-white text-red-600 font-bold">Reserve já e garante sua vaga!</Badge>
            </CardContent>
          </Card>

          {/* Gallery Info Banner */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-4 text-center">
              <h3 className="font-bold text-lg mb-2">📸 Galeria Interativa! 🎢📸✨</h3>
              <p className="text-sm mb-3">Navegue pelas fotos de cada hotel e veja todos os ambientes</p>
              <Badge className="bg-white text-blue-600 font-bold">Use as setas para ver mais fotos!</Badge>
            </CardContent>
          </Card>

          {/* Hotels List */}
          <div className="space-y-6">
            {hotels.map((hotel, index) => (
              <Card
                key={hotel.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative border-2 border-transparent hover:border-blue-200"
              >
                {hotel.discount && (
                  <Badge className="absolute top-3 right-3 bg-red-500 text-white z-10 animate-pulse">
                    -{hotel.discount}% OFF
                  </Badge>
                )}

                <ImageGallery images={hotel.images} alt={hotel.name} />

                {index === 0 && (
                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-black font-bold z-10">
                    🏆 MAIS PROCURADO
                  </Badge>
                )}

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{hotel.name}</h3>
                      <div className="flex gap-1 mb-2">{renderStars(hotel.stars)}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {hotel.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{hotel.description}</p>

                  {/* Gallery Info */}
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                      📸 {hotel.images.length} fotos disponíveis
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {hotel.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hotel.features.length - 3} mais
                      </Badge>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {hotel.originalPrice && (
                          <span className="text-sm text-gray-400 line-through mr-2">
                            {formatPrice(hotel.originalPrice)}
                          </span>
                        )}
                        <div className="text-2xl font-bold text-green-600">{formatPrice(hotel.price)}</div>
                        <p className="text-xs text-gray-500">
                          diária a partir de - para{" "}
                          {hotel.id === "spazzio-diroma"
                            ? "4 pessoas"
                            : hotel.id === "piazza-diroma"
                              ? "4 pessoas"
                              : hotel.id === "lacqua-diroma"
                                ? "4 pessoas"
                                : hotel.id === "diroma-fiori"
                                  ? "5 pessoas"
                                  : hotel.id === "lagoa-eco-towers"
                                    ? "7 pessoas"
                                    : "pessoas"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Economia de</p>
                        <p className="text-lg font-bold text-red-600">
                          {hotel.originalPrice ? formatPrice(hotel.originalPrice - hotel.price) : "---"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 text-lg"
                        onClick={() =>
                          window.open(
                            `https://wa.me/5564993197555?text=Olá! Quero reservar o ${hotel.name} com desconto especial!`,
                            "_blank",
                          )
                        }
                      >
                        💚 RESERVAR AGORA - {hotel.discount}% OFF
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                        onClick={() => alert(`Detalhes completos do ${hotel.name}`)}
                      >
                        Ver Detalhes Completos
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Final CTA */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3">🎯 Não encontrou o hotel ideal?</h3>
              <p className="mb-4">Fale conosco! Temos mais de 50 opções de hospedagem em Caldas Novas</p>
              <Button
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3"
                onClick={() =>
                  window.open(
                    "https://wa.me/5564993197555?text=Olá! Gostaria de ver mais opções de hotéis em Caldas Novas.",
                    "_blank",
                  )
                }
              >
                📞 Falar com Especialista
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
        href="https://wa.me/5564993197555?text=Olá! Gostaria de informações sobre hotéis em Caldas Novas."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50 animate-pulse"
      >
        <Phone className="w-7 h-7 text-white" />
      </a>
    </div>
  )
}

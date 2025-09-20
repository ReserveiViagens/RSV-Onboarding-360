"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Send, X, User, Phone, Minimize2, Maximize2, Smile, Calendar, Users, Baby } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

interface Message {
  id: string
  text: string
  sender: "user" | "agent" | "bot"
  timestamp: Date
  type?: "text" | "quick_reply" | "form" | "file" | "whatsapp_transfer" | "booking_form" | "calendar_confirmation"
  metadata?: any
}

interface BookingData {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  babies: number
  interests: string[]
  totalDays: number
}

interface ChatSession {
  id: string
  userId: string
  status: "active" | "waiting" | "closed"
  messages: Message[]
  userInfo?: {
    name?: string
    email?: string
    phone?: string
  }
  bookingData?: BookingData
}

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" })
  const [showUserForm, setShowUserForm] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [agentStatus, setAgentStatus] = useState<"online" | "offline" | "busy">("online")
  const [unreadCount, setUnreadCount] = useState(0)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    babies: 0,
    interests: [],
    totalDays: 0,
  })
  const [bookingStep, setBookingStep] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Knowledge Base
  const knowledgeBase = {
    hoteis: {
      "spazzio diroma": {
        name: "Spazzio DiRoma",
        price: "R$ 250",
        features: ["Piscinas Termais", "Acqua Park", "Restaurante", "Wi-Fi Gratuito"],
        capacity: "4 pessoas",
        discount: "20% OFF",
      },
      "piazza diroma": {
        name: "Piazza DiRoma",
        price: "R$ 260",
        features: ["Arquitetura Italiana", "Spa Premium", "Piscinas Exclusivas"],
        capacity: "4 pessoas",
        discount: "20% OFF",
      },
      "lacqua diroma": {
        name: "Lacqua DiRoma",
        price: "R$ 440",
        features: ["Jardins Acqua Park", "Piscinas de Ondas", "Toboáguas"],
        capacity: "4 pessoas",
        discount: "20% OFF",
      },
      "diroma fiori": {
        name: "DiRoma Fiori",
        price: "R$ 407",
        features: ["Ambiente Familiar", "Piscinas Termais", "Sauna"],
        capacity: "5 pessoas",
        discount: "20% OFF",
      },
      "lagoa eco towers": {
        name: "Lagoa Eco Towers",
        price: "R$ 850",
        features: ["Torres Ecológicas", "Vista Panorâmica", "Spa Completo"],
        capacity: "7 pessoas",
        discount: "20% OFF",
      },
    },
    ingressos: {
      "hot park": {
        name: "Hot Park",
        price: "R$ 189",
        features: ["Toboáguas radicais", "Piscinas termais", "Rio lento"],
        discount: "14% OFF",
      },
      "diroma acqua park": {
        name: "diRoma Acqua Park",
        price: "R$ 90",
        features: ["Toboáguas variados", "Piscina de ondas", "Área kids"],
        discount: "18% OFF",
      },
      "lagoa termas": {
        name: "Lagoa Termas Parque",
        price: "R$ 75",
        features: ["Águas termais naturais", "Trilhas ecológicas"],
        discount: "21% OFF",
      },
      "water park": {
        name: "Water Park",
        price: "R$ 120",
        features: ["Toboáguas modernos", "Piscina com ondas", "Tirolesa aquática"],
        discount: "20% OFF",
      },
      "kawana park": {
        name: "Kawana Park",
        price: "R$ 85",
        features: ["Piscinas termais naturais", "Toboáguas familiares"],
        discount: "23% OFF",
      },
    },
    atracoes: {
      "jardim japones": "Jardim Japonês - R$ 10 - Arquitetura japonesa e lagos ornamentais",
      "lago corumba": "Lago Corumbá - Passeios de barco e jet ski",
      "monumento aguas": "Monumento das Águas - GRÁTIS - Marco histórico de Caldas Novas",
      "feira luar": "Feira do Luar - GRÁTIS - Artesanato e gastronomia típica",
      "parque estadual": "Parque Estadual da Serra - Trilhas ecológicas e cachoeiras",
    },
    promocoes: {
      promoferias: "PROMOFÉRIAS - Hotel + Parque a partir de R$ 149,99 por pessoa",
      "melhor idade": "Pacote Melhor Idade - R$ 210 com atividades adaptadas",
      "fim semana": "Fim de Semana Dourado - R$ 299 com late check-out",
      familia: "Pacote Família Completa - R$ 450 com crianças grátis",
    },
  }

  useEffect(() => {
    // Generate session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)

    // Initialize chat with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      text: "Olá! 👋 Sou a Serena, sua Consultora de Turismo Imobiliário da Reservei Viagens. Como posso ajudá-lo hoje?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    }
    setMessages([welcomeMessage])

    // Check agent status
    checkAgentStatus()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isOpen && unreadCount === 0) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const checkAgentStatus = async () => {
    try {
      const response = await fetch("/api/n8n", {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.json()
        setAgentStatus(data.status === "connected" ? "online" : data.status === "error" ? "busy" : "offline")
      } else {
        setAgentStatus("offline")
      }
    } catch (error) {
      console.log("N8N status check unavailable, defaulting to online")
      setAgentStatus("online")
    }
  }

  const sendToN8N = async (message: string, messageType = "text", additionalData = {}) => {
    try {
      const payload = {
        sessionId,
        message,
        messageType,
        userInfo,
        bookingData,
        timestamp: new Date().toISOString(),
        source: "website_chat",
        context: conversationContext,
        ...additionalData,
      }

      const response = await fetch("/api/n8n", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.log("N8N webhook unavailable, using fallback response")
    }
    return null
  }

  const calculateDays = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const createGoogleCalendarEvent = async () => {
    const totalPeople = bookingData.adults + bookingData.children + bookingData.babies
    const eventTitle = `Reserva Caldas Novas - ${userInfo.name || "Cliente"} (${totalPeople} pessoas)`
    const eventDescription = `
Reserva via Chat Serena - Reservei Viagens

👤 Cliente: ${userInfo.name || "Não informado"}
📧 Email: ${userInfo.email || "Não informado"}
📱 Telefone: ${userInfo.phone || "Não informado"}

📅 Check-in: ${formatDate(bookingData.checkIn)}
📅 Check-out: ${formatDate(bookingData.checkOut)}
🏨 Período: ${bookingData.totalDays} dias

👥 Pessoas:
• Adultos: ${bookingData.adults}
• Crianças: ${bookingData.children}
• Bebês: ${bookingData.babies}
• Total: ${totalPeople} pessoas

🎯 Interesses: ${bookingData.interests.join(", ") || "Não especificado"}

💬 Contexto da conversa: ${conversationContext.join(" | ")}

⚠️ AÇÃO NECESSÁRIA: Entrar em contato com o cliente para finalizar a reserva
    `

    // Send to N8N for Google Calendar integration
    const calendarData = {
      title: eventTitle,
      description: eventDescription,
      startDate: bookingData.checkIn,
      endDate: bookingData.checkOut,
      attendees: [userInfo.email].filter(Boolean),
      userInfo,
      bookingData,
    }

    await sendToN8N("calendar_event", "google_calendar", { calendarData })

    return {
      title: eventTitle,
      description: eventDescription,
      startDate: bookingData.checkIn,
      endDate: bookingData.checkOut,
    }
  }

  const generateIntelligentResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase()

    // Booking intent detection
    if (
      message.includes("reserva") ||
      message.includes("reservar") ||
      message.includes("agendar") ||
      message.includes("data") ||
      message.includes("quando") ||
      message.includes("disponibilidade")
    ) {
      setTimeout(() => {
        setShowBookingForm(true)
        const bookingMessage: Message = {
          id: `booking_${Date.now()}`,
          text: "Perfeito! Vou te ajudar a organizar sua viagem. Preciso de algumas informações para encontrar as melhores opções:",
          sender: "bot",
          timestamp: new Date(),
          type: "booking_form",
        }
        setMessages((prev) => [...prev, bookingMessage])
      }, 1000)

      return "Ótimo! Vou te ajudar a planejar sua viagem para Caldas Novas! 🗓️"
    }

    // Hotel queries
    if (
      message.includes("hotel") ||
      message.includes("hospedagem") ||
      message.includes("diroma") ||
      message.includes("spazzio") ||
      message.includes("piazza") ||
      message.includes("lacqua") ||
      message.includes("fiori") ||
      message.includes("lagoa eco")
    ) {
      const hotelInfo = Object.values(knowledgeBase.hoteis)
        .map((hotel) => `🏨 ${hotel.name}: ${hotel.price} (${hotel.discount}) para ${hotel.capacity}`)
        .join("\n")

      return `Temos excelentes opções de hotéis em Caldas Novas! 🏨\n\n${hotelInfo}\n\nTodos com piscinas termais e estrutura completa! Gostaria de fazer uma reserva?`
    }

    // Ticket queries
    if (
      message.includes("ingresso") ||
      message.includes("parque") ||
      message.includes("hot park") ||
      message.includes("acqua") ||
      message.includes("kawana") ||
      message.includes("water park")
    ) {
      const ticketInfo = Object.values(knowledgeBase.ingressos)
        .map((ticket) => `🎢 ${ticket.name}: ${ticket.price} (${ticket.discount})`)
        .join("\n")

      return `Temos os melhores ingressos para parques aquáticos! 🎢\n\n${ticketInfo}\n\nTodos com desconto especial! Quer que eu ajude a agendar sua visita?`
    }

    // Attraction queries
    if (
      message.includes("atracao") ||
      message.includes("atração") ||
      message.includes("passeio") ||
      message.includes("jardim") ||
      message.includes("lago") ||
      message.includes("monumento")
    ) {
      return `Caldas Novas tem atrações incríveis! 🏞️\n\n🌸 Jardim Japonês - R$ 10\n🚤 Lago Corumbá - Passeios de barco\n🏛️ Monumento das Águas - GRÁTIS\n🎪 Feira do Luar - GRÁTIS\n🌲 Parque Estadual - Trilhas\n\nQuer que eu inclua algumas dessas atrações no seu roteiro?`
    }

    // Promotion queries
    if (
      message.includes("promocao") ||
      message.includes("promoção") ||
      message.includes("desconto") ||
      message.includes("oferta") ||
      message.includes("promoferias")
    ) {
      return `Temos promoções imperdíveis! 🔥\n\n🏷️ PROMOFÉRIAS: Hotel + Parque por R$ 149,99\n👴 Melhor Idade: R$ 210 com atividades especiais\n👨‍👩‍👧‍👦 Família Completa: R$ 450 com crianças grátis\n🌅 Fim de Semana: R$ 299 com late check-out\n\nVamos agendar sua viagem com desconto especial?`
    }

    // Price queries
    if (
      message.includes("preço") ||
      message.includes("preco") ||
      message.includes("valor") ||
      message.includes("quanto custa")
    ) {
      return `Nossos preços são super competitivos! 💰\n\n🏨 Hotéis: R$ 250 a R$ 850 (até 20% OFF)\n🎢 Ingressos: R$ 75 a R$ 189 (até 25% OFF)\n🏞️ Atrações: Gratuitas a R$ 10\n🏷️ Promoções: A partir de R$ 149,99\n\nQuer que eu calcule um orçamento personalizado para suas datas?`
    }

    // Investment/real estate queries
    if (
      message.includes("investimento") ||
      message.includes("imobiliario") ||
      message.includes("comprar") ||
      message.includes("imovel")
    ) {
      return `Como Consultora de Turismo Imobiliário, posso ajudar com investimentos em Caldas Novas! 🏢\n\n💼 Oportunidades de investimento\n🏨 Hotéis e resorts\n🏠 Imóveis para renda\n📈 Análise de mercado\n\nVamos agendar uma consulta para discutir suas metas?`
    }

    // Generic responses based on context
    const responses = [
      `Perfeito! Como sua Consultora de Turismo Imobiliário, vou te ajudar a encontrar a melhor opção em Caldas Novas! 🌟\n\nTemos:\n🏨 Hotéis com até 20% OFF\n🎢 Ingressos com desconto\n🏞️ Atrações imperdíveis\n🏷️ Promoções especiais\n\nQuer que eu ajude a agendar sua viagem?`,
      `Ótima escolha em nos procurar! Sou especialista em Caldas Novas e posso te ajudar com:\n\n✅ Hospedagem completa\n✅ Ingressos para parques\n✅ Roteiros personalizados\n✅ Investimentos imobiliários\n\nVamos começar planejando suas datas?`,
      `Excelente! Caldas Novas é o destino perfeito! 🌊\n\nComo sua consultora, posso organizar:\n🏨 Hospedagem ideal\n🎢 Diversão garantida\n🏞️ Passeios únicos\n💰 Melhores preços\n\nQuer que eu prepare um roteiro personalizado?`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setConversationContext((prev) => [...prev, inputMessage])
    setInputMessage("")
    setIsTyping(true)

    // Send to n8n
    const response = await sendToN8N(inputMessage)

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false)

      let botResponse: Message

      if (response && response.reply) {
        botResponse = {
          id: `bot_${Date.now()}`,
          text: response.reply,
          sender: response.isHuman ? "agent" : "bot",
          timestamp: new Date(),
          type: response.type || "text",
          metadata: response.metadata,
        }
      } else {
        // Intelligent fallback response
        const intelligentResponse = generateIntelligentResponse(inputMessage)
        botResponse = {
          id: `bot_${Date.now()}`,
          text: intelligentResponse,
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        }
      }

      setMessages((prev) => [...prev, botResponse])

      // Add WhatsApp transfer option after a few exchanges
      if (conversationContext.length >= 3 && !showBookingForm) {
        setTimeout(() => {
          const transferMessage: Message = {
            id: `transfer_${Date.now()}`,
            text: "Gostaria de falar diretamente com um de nossos especialistas via WhatsApp? Posso te conectar agora mesmo! 📱",
            sender: "bot",
            timestamp: new Date(),
            type: "whatsapp_transfer",
          }
          setMessages((prev) => [...prev, transferMessage])
        }, 2000)
      }

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1)
      }
    }, 1500)
  }

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleWhatsAppTransfer = () => {
    const context = conversationContext.join(", ")
    let transferMessage = `Olá! Vim do chat com a Serena e gostaria de continuar nossa conversa.`

    if (userInfo.name) {
      transferMessage += `\n\n👤 Nome: ${userInfo.name}`
    }
    if (userInfo.email) {
      transferMessage += `\n📧 Email: ${userInfo.email}`
    }
    if (userInfo.phone) {
      transferMessage += `\n📱 Telefone: ${userInfo.phone}`
    }

    if (bookingData.checkIn && bookingData.checkOut) {
      const totalPeople = bookingData.adults + bookingData.children + bookingData.babies
      transferMessage += `\n\n📅 DADOS DA VIAGEM:`
      transferMessage += `\n• Check-in: ${formatDate(bookingData.checkIn)}`
      transferMessage += `\n• Check-out: ${formatDate(bookingData.checkOut)}`
      transferMessage += `\n• Período: ${bookingData.totalDays} dias`
      transferMessage += `\n\n👥 QUANTIDADE DE PESSOAS:`
      transferMessage += `\n• Adultos: ${bookingData.adults} pessoa${bookingData.adults > 1 ? "s" : ""}`
      transferMessage += `\n• Crianças (2-12 anos): ${bookingData.children} criança${bookingData.children > 1 ? "s" : ""}`
      transferMessage += `\n• Bebês (0-2 anos): ${bookingData.babies} bebê${bookingData.babies > 1 ? "s" : ""}`
      transferMessage += `\n• TOTAL: ${totalPeople} pessoa${totalPeople > 1 ? "s" : ""}`

      if (bookingData.interests && bookingData.interests.length > 0) {
        transferMessage += `\n\n🎯 Interesses: ${bookingData.interests.join(", ")}`
      }

      transferMessage += `\n\n📋 Status: Agendamento criado no Google Agenda`
      transferMessage += `\n⚠️ Pronto para finalizar a reserva!`
    }

    if (context) {
      transferMessage += `\n\n💬 Histórico da conversa: ${context}`
    }

    transferMessage += `\n\n🎯 Gostaria de finalizar minha reserva com essas informações!`

    window.open(`https://wa.me/5564993197555?text=${encodeURIComponent(transferMessage)}`, "_blank")
  }

  const handleUserInfoSubmit = () => {
    if (userInfo.name && userInfo.email) {
      setShowUserForm(false)
      const infoMessage: Message = {
        id: `info_${Date.now()}`,
        text: `Obrigada, ${userInfo.name}! Suas informações foram registradas. Como sua Consultora de Turismo Imobiliário, como posso ajudá-lo com sua viagem ou investimento em Caldas Novas?`,
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, infoMessage])

      // Send user info to n8n
      sendToN8N(JSON.stringify(userInfo), "user_info")
    }
  }

  const handleBookingSubmit = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert("Por favor, preencha as datas de check-in e check-out")
      return
    }

    const checkInDate = new Date(bookingData.checkIn)
    const checkOutDate = new Date(bookingData.checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      alert("A data de check-in deve ser hoje ou uma data futura")
      return
    }

    if (checkOutDate <= checkInDate) {
      alert("A data de check-out deve ser posterior à data de check-in")
      return
    }

    const totalDays = calculateDays(bookingData.checkIn, bookingData.checkOut)
    const updatedBookingData = { ...bookingData, totalDays }
    setBookingData(updatedBookingData)

    setShowBookingForm(false)

    // Create Google Calendar event
    const calendarEvent = await createGoogleCalendarEvent()

    const totalPeople = bookingData.adults + bookingData.children + bookingData.babies
    const confirmationMessage: Message = {
      id: `confirmation_${Date.now()}`,
      text: `✅ Perfeito! Suas informações foram registradas:\n\n📅 Check-in: ${formatDate(bookingData.checkIn)}\n📅 Check-out: ${formatDate(bookingData.checkOut)}\n🏨 Período: ${totalDays} dias\n\n👥 Pessoas:\n• Adultos: ${bookingData.adults}\n• Crianças: ${bookingData.children}\n• Bebês: ${bookingData.babies}\n• Total: ${totalPeople} pessoas\n\n📋 Agendamento criado no Google Agenda para nossos consultores!\n\nAgora vou te conectar com um especialista para finalizar sua reserva! 🎯`,
      sender: "bot",
      timestamp: new Date(),
      type: "calendar_confirmation",
    }

    setMessages((prev) => [...prev, confirmationMessage])

    // Send booking data to N8N
    await sendToN8N(JSON.stringify(updatedBookingData), "booking_data", { calendarEvent })

    // Auto-trigger WhatsApp transfer after booking
    setTimeout(() => {
      const transferMessage: Message = {
        id: `auto_transfer_${Date.now()}`,
        text: "Vou te conectar agora com nosso especialista via WhatsApp para finalizar todos os detalhes da sua viagem! 📱✨",
        sender: "bot",
        timestamp: new Date(),
        type: "whatsapp_transfer",
      }
      setMessages((prev) => [...prev, transferMessage])
    }, 2000)
  }

  const quickReplies = [
    "Quero fazer uma reserva",
    "Ver hotéis disponíveis",
    "Pacotes promocionais",
    "Ingressos para parques",
    "Falar com especialista",
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  // Get minimum checkout date (day after checkin)
  const getMinCheckoutDate = () => {
    if (!bookingData.checkIn) return getMinDate()
    const checkIn = new Date(bookingData.checkIn)
    checkIn.setDate(checkIn.getDate() + 1)
    return checkIn.toISOString().split("T")[0]
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            onClick={() => {
              setIsOpen(true)
              setUnreadCount(0)
            }}
            className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 relative"
          >
            <MessageCircle className="w-8 h-8 text-white" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </Badge>
            )}
          </Button>
          {agentStatus === "online" && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
          }`}
        >
          <Card className="h-full flex flex-col shadow-2xl border-2 border-purple-200">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-500 text-white text-sm font-bold">S</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">Serena</h3>
                    <p className="text-xs opacity-90">Consultora de Turismo Imobiliário</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          agentStatus === "online"
                            ? "bg-green-400"
                            : agentStatus === "busy"
                              ? "bg-yellow-400"
                              : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="text-xs opacity-90">
                        {agentStatus === "online" ? "Online" : agentStatus === "busy" ? "Ocupada" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <div className="h-full overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-purple-600 text-white"
                              : message.sender === "agent"
                                ? "bg-green-100 text-gray-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                            {message.sender === "agent" && (
                              <Badge variant="outline" className="text-xs">
                                Serena
                              </Badge>
                            )}
                          </div>

                          {/* WhatsApp Transfer Button */}
                          {message.type === "whatsapp_transfer" && (
                            <div className="mt-3">
                              <Button
                                onClick={handleWhatsAppTransfer}
                                className="bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-2 rounded-full"
                              >
                                📱 Continuar no WhatsApp
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                {/* Quick Replies */}
                {messages.length <= 2 && (
                  <div className="p-4 border-t bg-gray-50">
                    <p className="text-xs text-gray-600 mb-2">Respostas rápidas:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.slice(0, 3).map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booking Form */}
                {showBookingForm && (
                  <div className="p-4 border-t bg-blue-50 max-h-80 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-sm">Informações da Viagem</h4>
                    </div>
                    <div className="space-y-3">
                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="checkin" className="text-xs">
                            Check-in
                          </Label>
                          <Input
                            id="checkin"
                            type="date"
                            value={bookingData.checkIn}
                            min={getMinDate()}
                            onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="checkout" className="text-xs">
                            Check-out
                          </Label>
                          <Input
                            id="checkout"
                            type="date"
                            value={bookingData.checkOut}
                            min={getMinCheckoutDate()}
                            onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                            className="text-xs"
                          />
                        </div>
                      </div>

                      {/* People Count */}
                      <div className="space-y-2">
                        <Label className="text-xs">Quantidade de Pessoas</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor="adults" className="text-xs flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Adultos
                            </Label>
                            <Input
                              id="adults"
                              type="number"
                              min="1"
                              max="10"
                              value={bookingData.adults}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, adults: Number.parseInt(e.target.value) || 1 })
                              }
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="children" className="text-xs flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Crianças
                            </Label>
                            <Input
                              id="children"
                              type="number"
                              min="0"
                              max="10"
                              value={bookingData.children}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, children: Number.parseInt(e.target.value) || 0 })
                              }
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="babies" className="text-xs flex items-center gap-1">
                              <Baby className="w-3 h-3" />
                              Bebês
                            </Label>
                            <Input
                              id="babies"
                              type="number"
                              min="0"
                              max="5"
                              value={bookingData.babies}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, babies: Number.parseInt(e.target.value) || 0 })
                              }
                              className="text-xs"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Crianças: 2-12 anos | Bebês: 0-2 anos</p>
                      </div>

                      {/* Summary */}
                      {bookingData.checkIn && bookingData.checkOut && (
                        <div className="bg-white p-2 rounded border text-xs">
                          <p className="font-semibold text-blue-700">Resumo:</p>
                          <p>📅 {calculateDays(bookingData.checkIn, bookingData.checkOut)} dias</p>
                          <p>👥 {bookingData.adults + bookingData.children + bookingData.babies} pessoas</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={handleBookingSubmit} className="flex-1 text-xs bg-blue-600 hover:bg-blue-700">
                          📅 Agendar no Google Agenda
                        </Button>
                        <Button onClick={() => setShowBookingForm(false)} variant="outline" className="text-xs">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* User Info Form */}
                {showUserForm && (
                  <div className="p-4 border-t bg-purple-50">
                    <h4 className="font-semibold text-sm mb-3">Para melhor atendimento:</h4>
                    <div className="space-y-2">
                      <Input
                        placeholder="Seu nome"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Seu email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Seu telefone"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        className="text-sm"
                      />
                      <Button
                        onClick={handleUserInfoSubmit}
                        className="w-full text-sm bg-purple-600 hover:bg-purple-700"
                      >
                        Continuar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                          onClick={() => setShowBookingForm(true)}
                          title="Agendar viagem"
                        >
                          <Calendar className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                          <Smile className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleSendMessage} size="sm" className="px-3 bg-purple-600 hover:bg-purple-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex justify-center gap-4 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleWhatsAppTransfer}
                      className="text-green-600 hover:text-green-700 text-xs"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUserForm(true)}
                      className="text-purple-600 hover:text-purple-700 text-xs"
                    >
                      <User className="w-3 h-3 mr-1" />
                      Meus Dados
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBookingForm(true)}
                      className="text-blue-600 hover:text-blue-700 text-xs"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Agendar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export interface AppNotification {
  id: string
  type: 'newBooking' | 'paymentUpdate' | 'customerMessage' | 'system'
  title: string
  message: string
  createdAt: string
  read?: boolean
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000'
    const socket = io(url, { transports: ['websocket'], autoConnect: true })
    socketRef.current = socket

    socket.on('newBooking', (payload: any) => {
      setNotifications((prev) => [
        { id: String(Date.now()), type: 'newBooking', title: 'Nova reserva', message: JSON.stringify(payload), createdAt: new Date().toISOString() },
        ...prev,
      ])
    })

    socket.on('paymentUpdate', (payload: any) => {
      setNotifications((prev) => [
        { id: String(Date.now()), type: 'paymentUpdate', title: 'Pagamento atualizado', message: JSON.stringify(payload), createdAt: new Date().toISOString() },
        ...prev,
      ])
    })

    socket.on('customerMessage', (payload: any) => {
      setNotifications((prev) => [
        { id: String(Date.now()), type: 'customerMessage', title: 'Mensagem do cliente', message: JSON.stringify(payload), createdAt: new Date().toISOString() },
        ...prev,
      ])
    })

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [])

  const markAsRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const trigger = (n: Omit<AppNotification, 'id' | 'createdAt'>) => setNotifications((prev) => [
    { id: String(Date.now()), createdAt: new Date().toISOString(), ...n },
    ...prev,
  ])

  return { notifications, markAsRead, trigger }
}


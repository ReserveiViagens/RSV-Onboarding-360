import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface BookingItem {
  id: number
  packageName: string
  customer: string
  checkIn: string
  checkOut: string
  value: number
  status: 'confirmed' | 'pending' | 'canceled'
  paymentStatus: 'paid' | 'unpaid' | 'refunded'
}

const fetchBookings = async (): Promise<BookingItem[]> => {
  // Mock local por enquanto
  return [
    {
      id: 1,
      packageName: 'Caldas Novas Família 3 dias',
      customer: 'João Silva',
      checkIn: '2025-08-15',
      checkOut: '2025-08-18',
      value: 1500,
      status: 'confirmed',
      paymentStatus: 'paid',
    },
  ]
}

export const useBooking = () => {
  const queryClient = useQueryClient()

  const query = useQuery({ queryKey: ['bookings'], queryFn: fetchBookings })

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<BookingItem, 'id'>) => ({ id: Date.now(), ...payload } as BookingItem),
    onSuccess: (newItem) => {
      queryClient.setQueryData<BookingItem[]>(['bookings'], (old = []) => [newItem, ...old])
    },
  })

  return {
    ...query,
    createBooking: createMutation.mutateAsync,
  }
}


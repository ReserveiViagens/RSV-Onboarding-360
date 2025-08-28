import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface CustomerItem {
  id: number
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  documents?: { name: string; type: string; size: number }[]
  totalTrips?: number
  totalSpent?: number
}

const fetchCustomers = async (): Promise<CustomerItem[]> => {
  return [
    { id: 1, name: 'João Silva', email: 'joao@example.com', phone: '(64) 99999-1111', totalTrips: 3, totalSpent: 5200 },
    { id: 2, name: 'Maria Souza', email: 'maria@example.com', phone: '(65) 98888-2222', totalTrips: 1, totalSpent: 1500 },
  ]
}

export const useCustomers = () => {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['customers'], queryFn: fetchCustomers })

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<CustomerItem, 'id'>) => ({ id: Date.now(), ...payload } as CustomerItem),
    onSuccess: (created) => {
      queryClient.setQueryData<CustomerItem[]>(['customers'], (old = []) => [created, ...old])
    }
  })

  return {
    ...query,
    createCustomer: createMutation.mutateAsync,
  }
}


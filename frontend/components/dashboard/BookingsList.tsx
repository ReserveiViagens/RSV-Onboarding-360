import React from 'react'
import { Card } from '../ui/Card'
import { Table, Column } from '../ui/Table'
import { Badge } from '../ui/Badge'
import { BookingItem } from '../../src/hooks/useBooking'

interface BookingsListProps {
  items: BookingItem[]
}

export const BookingsList: React.FC<BookingsListProps> = ({ items }) => {
  const columns: Column<BookingItem>[] = [
    { key: 'id', header: 'ID' },
    { key: 'packageName', header: 'Pacote' },
    { key: 'customer', header: 'Cliente' },
    { key: 'checkIn', header: 'Check-in' },
    { key: 'checkOut', header: 'Check-out' },
    { key: 'value', header: 'Valor', render: (r) => r.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
    { key: 'status', header: 'Status', render: (r) => (
      <Badge variant={r.status === 'confirmed' ? 'success' : r.status === 'pending' ? 'warning' : 'danger'}>
        {r.status}
      </Badge>
    ) },
  ]

  return (
    <Card title="Reservas Recentes">
      <Table columns={columns} data={items} />
    </Card>
  )
}

export default BookingsList


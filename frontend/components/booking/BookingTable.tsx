import React from 'react'
import { Table, Column } from '../ui/Table'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { BookingItem } from '../../src/hooks/useBooking'

interface BookingTableProps {
  items: BookingItem[]
}

export const BookingTable: React.FC<BookingTableProps> = ({ items }) => {
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
    <Card title="Lista de Reservas">
      <Table columns={columns} data={items} />
    </Card>
  )
}

export default BookingTable


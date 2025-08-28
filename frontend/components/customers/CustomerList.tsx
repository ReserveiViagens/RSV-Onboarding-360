import React from 'react'
import { Card } from '../ui/Card'
import { Table, Column } from '../ui/Table'
import { CustomerItem } from '../../src/hooks/useCustomers'

interface CustomerListProps {
  items: CustomerItem[]
}

export const CustomerList: React.FC<CustomerListProps> = ({ items }) => {
  const columns: Column<CustomerItem>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Telefone' },
    { key: 'totalTrips', header: 'Viagens' },
    { key: 'totalSpent', header: 'Gasto Total', render: (r) => (r.totalSpent || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
  ]
  return (
    <Card title="Clientes">
      <Table columns={columns} data={items} />
    </Card>
  )
}

export default CustomerList


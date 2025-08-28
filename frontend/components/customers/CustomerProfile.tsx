import React from 'react'
import { Card } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { CustomerItem } from '../../src/hooks/useCustomers'

interface CustomerProfileProps {
  customer: CustomerItem
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer }) => {
  return (
    <Card title="Perfil do Cliente">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Avatar name={customer.name} src={customer.avatarUrl} size={56} />
        <div style={{ display: 'grid' }}>
          <strong>{customer.name}</strong>
          <span style={{ opacity: 0.8 }}>{customer.email}</span>
          {customer.phone && <span style={{ opacity: 0.8 }}>{customer.phone}</span>}
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <div>Viagens: <strong>{customer.totalTrips || 0}</strong></div>
        <div>Gasto total: <strong>{(customer.totalSpent || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
      </div>
      {customer.documents && customer.documents.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>Documentos</strong>
          <ul>
            {customer.documents.map((d) => (
              <li key={d.name}>{d.name} ({d.type})</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )}

export default CustomerProfile


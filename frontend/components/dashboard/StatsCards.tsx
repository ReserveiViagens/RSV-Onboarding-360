import React from 'react'
import { Card } from '../ui/Card'
import { designTokens } from '../../styles/design-tokens'

export interface StatsData {
  totalBookings: number
  monthlyRevenue: number
  activeCustomers: number
  popularDestination: string
}

interface StatsCardsProps {
  data: StatsData
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const items = [
    { label: 'Reservas Totais', value: data.totalBookings.toLocaleString(), color: designTokens.colors.primary },
    { label: 'Receita Mensal', value: data.monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), color: designTokens.colors.accent },
    { label: 'Clientes Ativos', value: data.activeCustomers.toLocaleString(), color: designTokens.colors.secondary },
    { label: 'Destino Popular', value: data.popularDestination, color: '#06B6D4' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
      {items.map((it) => (
        <Card key={it.label}>
          <div style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: '#94A3B8', fontSize: 12 }}>{it.label}</span>
            <strong style={{ fontSize: 22, color: it.color }}>{it.value}</strong>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default StatsCards


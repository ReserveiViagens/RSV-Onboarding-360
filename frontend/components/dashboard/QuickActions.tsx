import React from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface QuickActionsProps {
  onNewBooking: () => void
  onNewCustomer: () => void
  onMonthlyReport: () => void
  onSettings: () => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNewBooking, onNewCustomer, onMonthlyReport, onSettings }) => {
  return (
    <Card title="Ações Rápidas">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Button onClick={onNewBooking}>Nova reserva</Button>
        <Button variant="secondary" onClick={onNewCustomer}>Adicionar cliente</Button>
        <Button variant="ghost" onClick={onMonthlyReport}>Relatório mensal</Button>
        <Button variant="danger" onClick={onSettings}>Configurações</Button>
      </div>
    </Card>
  )
}

export default QuickActions


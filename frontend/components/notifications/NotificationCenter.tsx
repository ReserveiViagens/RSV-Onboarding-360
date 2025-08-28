import React from 'react'
import { AppNotification } from '../../src/hooks/useNotifications'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface Props {
  items: AppNotification[]
  onMarkRead: (id: string) => void
}

export const NotificationCenter: React.FC<Props> = ({ items, onMarkRead }) => {
  return (
    <Card title="Centro de Notificações">
      <div style={{ display: 'grid', gap: 8 }}>
        {items.length === 0 && <div style={{ opacity: 0.8 }}>Sem notificações</div>}
        {items.map((n) => (
          <div key={n.id} style={{ border: '1px solid #1E293B', borderRadius: 8, padding: 8, display: 'grid', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{n.title}</strong>
              {!n.read && <Button size="sm" variant="ghost" onClick={() => onMarkRead(n.id)}>Marcar como lida</Button>}
            </div>
            <span style={{ opacity: 0.85 }}>{n.message}</span>
            <small style={{ opacity: 0.6 }}>{new Date(n.createdAt).toLocaleString('pt-BR')}</small>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default NotificationCenter


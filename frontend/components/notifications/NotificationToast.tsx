import React, { useEffect } from 'react'
import { AppNotification } from '../../src/hooks/useNotifications'

interface Props {
  item: AppNotification
  onClose: (id: string) => void
}

export const NotificationToast: React.FC<Props> = ({ item, onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(item.id), 3000)
    return () => clearTimeout(t)
  }, [item.id, onClose])
  return (
    <div role="status" aria-live="polite" style={{
      background: '#122033', border: '1px solid #1E293B', color: '#E2E8F0',
      borderRadius: 10, padding: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
    }}>
      <strong style={{ display: 'block' }}>{item.title}</strong>
      <span style={{ opacity: 0.85 }}>{item.message}</span>
    </div>
  )
}

export default NotificationToast


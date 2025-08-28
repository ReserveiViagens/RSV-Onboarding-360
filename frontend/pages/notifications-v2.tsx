import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import { useNotifications } from '../src/hooks/useNotifications'
import { NotificationCenter } from '../components/notifications/NotificationCenter'
import { NotificationToast } from '../components/notifications/NotificationToast'
import { Button } from '../components/ui/Button'

export default function NotificationsV2() {
  const { notifications, markAsRead, trigger } = useNotifications()
  const [toast, setToast] = useState<string | null>(null)

  const latest = notifications[0]
  const onSimulate = () => {
    trigger({ type: 'system', title: 'Teste', message: 'Notificação simulada' })
    setToast('ok')
  }

  return (
    <>
      <Head>
        <title>Notificações V2</title>
      </Head>
      <div style={{ padding: 24, display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#E2E8F0', margin: 0 }}>Notificações</h1>
          <Button onClick={onSimulate}>Simular notificação</Button>
        </div>
        <NotificationCenter items={notifications} onMarkRead={markAsRead} />
      </div>
      <div style={{ position: 'fixed', right: 16, bottom: 16, display: 'grid', gap: 8 }}>
        {toast && latest && (
          <NotificationToast item={latest} onClose={() => setToast(null)} />
        )}
      </div>
    </>
  )
}


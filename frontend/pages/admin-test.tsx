import React from 'react'
import Head from 'next/head'
import ProtectedRoute from '../components/ProtectedRoute'
import { Protected } from '../components/rbac/Protected'

export default function AdminTest() {
  return (
    <>
      <Head>
        <title>Admin Test</title>
      </Head>
      <ProtectedRoute requiredPermissions={['admin']}> 
        <div style={{ padding: 24, color: '#E2E8F0' }}>
          <h1>Área Administrativa</h1>
          <Protected permission="bookings.*">
            <p>Você tem permissão para gerenciar reservas.</p>
          </Protected>
        </div>
      </ProtectedRoute>
    </>
  )
}


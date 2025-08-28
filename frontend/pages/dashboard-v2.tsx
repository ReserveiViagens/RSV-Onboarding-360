import React from 'react'
import Head from 'next/head'
import { StatsCards, StatsData } from '../components/dashboard/StatsCards'
import { AnalyticsCharts } from '../components/dashboard/AnalyticsCharts'
import { BookingsList } from '../components/dashboard/BookingsList'
import { QuickActions } from '../components/dashboard/QuickActions'
import { useBooking } from '../src/hooks/useBooking'
import ProtectedRoute from '../components/ProtectedRoute'
import { Protected } from '../components/rbac/Protected'

export default function DashboardV2() {
  const { data: bookings = [] } = useBooking()

  const stats: StatsData = {
    totalBookings: 1280,
    monthlyRevenue: 89450,
    activeCustomers: 342,
    popularDestination: 'Caldas Novas'
  }

  const revenueByMonth = [
    { month: 'Jan', value: 12000 }, { month: 'Fev', value: 13200 }, { month: 'Mar', value: 14500 },
    { month: 'Abr', value: 16000 }, { month: 'Mai', value: 17200 }, { month: 'Jun', value: 18000 },
  ]
  const popularDestinations = [
    { name: 'Caldas Novas', value: 320 },
    { name: 'Rio Quente', value: 210 },
    { name: 'Hot Park', value: 140 },
  ]
  const bookingStatus = [
    { name: 'Confirmadas', value: 68 },
    { name: 'Pendentes', value: 22 },
    { name: 'Canceladas', value: 10 },
  ]
  const customerGrowth = [
    { month: 'Jan', value: 50 }, { month: 'Fev', value: 75 }, { month: 'Mar', value: 110 },
    { month: 'Abr', value: 140 }, { month: 'Mai', value: 170 }, { month: 'Jun', value: 200 },
  ]

  return (
    <>
      <Head>
        <title>Dashboard V2</title>
      </Head>
      <ProtectedRoute>
        <div style={{ padding: 24, display: 'grid', gap: 12 }}>
          <Protected permission="admin">
            <button aria-label="Botão admin" style={{ justifySelf: 'end' }}>Apenas Admin</button>
          </Protected>
          <StatsCards data={stats} />
          <AnalyticsCharts
            revenueByMonth={revenueByMonth}
            popularDestinations={popularDestinations}
            bookingStatus={bookingStatus}
            customerGrowth={customerGrowth}
          />
          <QuickActions
            onNewBooking={() => alert('Nova reserva')}
            onNewCustomer={() => alert('Adicionar cliente')}
            onMonthlyReport={() => alert('Relatório mensal')}
            onSettings={() => alert('Configurações')}
          />
          <BookingsList items={bookings} />
        </div>
      </ProtectedRoute>
    </>
  )
}


import React from 'react'
import { Card } from '../ui/Card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface AnalyticsChartsProps {
  revenueByMonth: { month: string; value: number }[]
  popularDestinations: { name: string; value: number }[]
  bookingStatus: { name: string; value: number }[]
  customerGrowth: { month: string; value: number }[]
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#06B6D4', '#EF4444']

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ revenueByMonth, popularDestinations, bookingStatus, customerGrowth }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 12 }}>
      <Card title="Receita Mensal">
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={revenueByMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Destinos Populares">
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={popularDestinations}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Status das Reservas">
        <div style={{ width: '100%', height: 260, display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={bookingStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                {bookingStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Crescimento de Clientes">
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={customerGrowth}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#06B6D4" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default AnalyticsCharts


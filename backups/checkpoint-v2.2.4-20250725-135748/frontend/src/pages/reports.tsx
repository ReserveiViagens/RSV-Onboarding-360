import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';
import {
  BarChart3,
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Plane,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';

interface ReportData {
  period: string;
  totalRevenue: number;
  totalBookings: number;
  averagePrice: number;
  topDestination: string;
  growthRate: number;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Dados mockados de relatórios
  const mockReportData: ReportData = {
    period: 'Último Mês',
    totalRevenue: 125000,
    totalBookings: 45,
    averagePrice: 2777.78,
    topDestination: 'Paris, França',
    growthRate: 12.5
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const handleDownloadReport = (type: string) => {
    // Simular download de relatório
    console.log(`Baixando relatório: ${type}`);
    alert(`Relatório ${type} será baixado em breve!`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">📊 Relatórios e Analytics</h1>
                <p className="text-gray-600 mt-2">Análise completa de dados e performance</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/travel')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar às Viagens
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Period Selector */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Período de Análise</h2>
                  <p className="text-sm text-gray-600">Selecione o período para os relatórios</p>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">Última Semana</option>
                  <option value="month">Último Mês</option>
                  <option value="quarter">Último Trimestre</option>
                  <option value="year">Último Ano</option>
                </select>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockReportData.totalRevenue)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{formatPercentage(mockReportData.growthRate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">{mockReportData.totalBookings}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.2%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockReportData.averagePrice)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+4.1%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Destino Top</p>
                  <p className="text-lg font-bold text-gray-900">{mockReportData.topDestination}</p>
                  <p className="text-sm text-gray-600">15 reservas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Receita por Mês</h3>
                  <button
                    onClick={() => handleDownloadReport('revenue')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </button>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Gráfico de Receita</p>
                    <p className="text-sm text-gray-400">Dados dos últimos 12 meses</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Destinations Chart */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Destinos Mais Populares</h3>
                  <button
                    onClick={() => handleDownloadReport('destinations')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </button>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Gráfico de Destinos</p>
                    <p className="text-sm text-gray-400">Distribuição por localização</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Reports */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Relatórios Detalhados</h2>
                <button
                  onClick={() => handleDownloadReport('complete')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Relatório Completo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Financial Report */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold">Relatório Financeiro</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Análise completa de receitas, custos e lucros
                  </p>
                  <button
                    onClick={() => handleDownloadReport('financial')}
                    className="w-full bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-200"
                  >
                    Baixar PDF
                  </button>
                </div>

                {/* Performance Report */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Activity className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold">Relatório de Performance</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Métricas de vendas e conversão
                  </p>
                  <button
                    onClick={() => handleDownloadReport('performance')}
                    className="w-full bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-200"
                  >
                    Baixar PDF
                  </button>
                </div>

                {/* Customer Report */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Users className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold">Relatório de Clientes</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Análise de comportamento e preferências
                  </p>
                  <button
                    onClick={() => handleDownloadReport('customers')}
                    className="w-full bg-purple-100 text-purple-700 px-3 py-2 rounded text-sm font-medium hover:bg-purple-200"
                  >
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow mt-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Plane className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nova reserva confirmada</p>
                    <p className="text-xs text-gray-600">Paris, França - R$ 4.500,00</p>
                  </div>
                  <span className="text-xs text-gray-500">2 min atrás</span>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pagamento processado</p>
                    <p className="text-xs text-gray-600">Orlando, EUA - R$ 8.500,00</p>
                  </div>
                  <span className="text-xs text-gray-500">15 min atrás</span>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Agendamento cancelado</p>
                    <p className="text-xs text-gray-600">São Paulo, Brasil - R$ 1.200,00</p>
                  </div>
                  <span className="text-xs text-gray-500">1 hora atrás</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
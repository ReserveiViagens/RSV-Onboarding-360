// ===================================================================
// RESERVATIONS RSV PAGE - PÁGINA DEDICADA PARA GESTÃO DE RESERVAS
// ===================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NotificationProvider } from '../src/context/NotificationContext';
import { NotificationBell, NotificationToastContainer } from '../src/components/notifications';
import { BookingCalendar, BookingModal } from '../src/components/bookings';
import {
  ArrowLeft,
  Calendar,
  Plus,
  Settings,
  Menu,
  X,
  LogOut,
  BarChart3,
  Users,
  MapPin
} from 'lucide-react';

// ===================================================================
// TIPOS
// ===================================================================

interface Booking {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destination: string;
  checkIn: Date;
  checkOut: Date;
  value: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  guests: number;
  notes?: string;
}

// ===================================================================
// COMPONENTE PRINCIPAL
// ===================================================================

export default function ReservationsRSVPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'analytics'>('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // ===================================================================
  // HANDLERS
  // ===================================================================

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingBooking(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (booking: Booking) => {
    setModalMode('edit');
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBooking(null);
  };

  const handleSaveBooking = (booking: Booking) => {
    console.log('Salvando reserva:', booking);
    // Implementar lógica de salvamento
    alert('Reserva salva com sucesso!');
  };

  // ===================================================================
  // RENDERIZAÇÃO
  // ===================================================================

  return (
    <ProtectedRoute>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    title="Abrir menu"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <div className="ml-4 lg:ml-0">
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Reservas</h1>
                    <p className="text-sm text-gray-500">Sistema completo de reservas com drag & drop</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <NotificationBell />
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
                      <p className="text-xs text-gray-500">{user?.role || 'Agente'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                      title="Sair"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
                    title="Fechar menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                  <Link href="/dashboard-rsv" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Voltar ao Dashboard
                  </Link>
                  
                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Reservas
                    </h3>
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={() => setActiveTab('calendar')}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          activeTab === 'calendar'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Calendar className="w-5 h-5 mr-3" />
                        Calendário
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('list')}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          activeTab === 'list'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Users className="w-5 h-5 mr-3" />
                        Lista de Reservas
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('analytics')}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          activeTab === 'analytics'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <BarChart3 className="w-5 h-5 mr-3" />
                        Analytics
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Outros
                    </h3>
                    <div className="mt-2 space-y-1">
                      <Link href="/customers-rsv" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                        <Users className="w-5 h-5 mr-3" />
                        Clientes
                      </Link>
                      <Link href="/travel-catalog-rsv" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                        <MapPin className="w-5 h-5 mr-3" />
                        Catálogo de Viagens
                      </Link>
                      <Link href="/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                        <Settings className="w-5 h-5 mr-3" />
                        Configurações
                      </Link>
                    </div>
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        <button
                          onClick={() => setActiveTab('calendar')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'calendar'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Calendário</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveTab('list')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'list'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Lista</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveTab('analytics')}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'analytics'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics</span>
                          </div>
                        </button>
                      </nav>
                    </div>
                    
                    <button
                      onClick={handleOpenCreateModal}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Reserva</span>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'calendar' && <BookingCalendar />}
                {activeTab === 'list' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de Reservas</h3>
                    <p className="text-gray-600">Lista de todas as reservas em formato de tabela</p>
                    {/* Implementar componente de lista */}
                  </div>
                )}
                {activeTab === 'analytics' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics de Reservas</h3>
                    <p className="text-gray-600">Gráficos e métricas específicas de reservas</p>
                    {/* Implementar analytics específicas */}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Modal de Reserva */}
          <BookingModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveBooking}
            booking={editingBooking}
            mode={modalMode}
          />
          
          <NotificationToastContainer />
        </div>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
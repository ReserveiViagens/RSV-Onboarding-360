import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  MapPin, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Star,
  Heart,
  Share2,
  Phone,
  Mail,
  User,
  Building,
  Plane,
  Car,
  Bus,
  Train,
  Ship,
  Bike,
  Footprints,
  X
} from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destination: string;
  packageName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  value: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'partial';
  agent: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  category: 'beach' | 'mountain' | 'city' | 'adventure' | 'romantic' | 'family';
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  preferences: string[];
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
}

export default function ReservationsRSV() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Dados simulados - em produção viriam da API
  useEffect(() => {
    // Simular carregamento de dados
    const mockBookings: Booking[] = [
      {
        id: '1',
        customerName: 'João Silva',
        customerEmail: 'joao.silva@email.com',
        customerPhone: '(11) 99999-9999',
        destination: 'Caldas Novas - GO',
        packageName: 'Pacote Família 3 dias',
        checkIn: '2025-08-15',
        checkOut: '2025-08-18',
        adults: 2,
        children: 1,
        value: 1500,
        status: 'confirmed',
        paymentStatus: 'paid',
        agent: 'Maria Santos',
        notes: 'Cliente preferiu quarto com vista para o lago',
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z'
      },
      {
        id: '2',
        customerName: 'Ana Oliveira',
        customerEmail: 'ana.oliveira@email.com',
        customerPhone: '(11) 88888-8888',
        destination: 'Porto de Galinhas - PE',
        packageName: 'Pacote Romântico 5 dias',
        checkIn: '2025-08-20',
        checkOut: '2025-08-25',
        adults: 2,
        children: 0,
        value: 2200,
        status: 'pending',
        paymentStatus: 'pending',
        agent: 'Pedro Costa',
        notes: 'Aguardando confirmação do hotel',
        createdAt: '2025-01-16T14:20:00Z',
        updatedAt: '2025-01-16T14:20:00Z'
      },
      {
        id: '3',
        customerName: 'Carlos Mendes',
        customerEmail: 'carlos.mendes@email.com',
        customerPhone: '(11) 77777-7777',
        destination: 'Fernando de Noronha - PE',
        packageName: 'Pacote Aventura 7 dias',
        checkIn: '2025-09-01',
        checkOut: '2025-09-08',
        adults: 1,
        children: 0,
        value: 4500,
        status: 'confirmed',
        paymentStatus: 'paid',
        agent: 'Lucia Ferreira',
        notes: 'Cliente solicitou transfer do aeroporto',
        createdAt: '2025-01-17T09:15:00Z',
        updatedAt: '2025-01-17T09:15:00Z'
      }
    ];

    const mockPackages: TravelPackage[] = [
      {
        id: '1',
        name: 'Pacote Família Caldas Novas',
        destination: 'Caldas Novas - GO',
        description: 'Aproveite as águas termais de Caldas Novas com toda a família',
        duration: '3 dias / 2 noites',
        price: 1500,
        image: '/images/caldas-novas.jpg',
        highlights: ['Águas termais', 'Parque aquático', 'Hospedagem familiar'],
        included: ['Hospedagem', 'Café da manhã', 'Transfer aeroporto'],
        notIncluded: ['Passagens aéreas', 'Almoço e jantar', 'Passeios opcionais'],
        category: 'family'
      },
      {
        id: '2',
        name: 'Pacote Romântico Porto de Galinhas',
        destination: 'Porto de Galinhas - PE',
        description: 'Romance e praia em um dos destinos mais bonitos do Brasil',
        duration: '5 dias / 4 noites',
        price: 2200,
        image: '/images/porto-galinhas.jpg',
        highlights: ['Praias paradisíacas', 'Hospedagem romântica', 'Passeios de jangada'],
        included: ['Hospedagem', 'Café da manhã', 'Passeio de jangada'],
        notIncluded: ['Passagens aéreas', 'Almoço e jantar', 'Passeios opcionais'],
        category: 'romantic'
      }
    ];

    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-9999',
        document: '123.456.789-00',
        birthDate: '1985-03-15',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        preferences: ['Praia', 'Família', 'Águas termais'],
        totalBookings: 5,
        totalSpent: 8500,
        lastBooking: '2025-01-15'
      },
      {
        id: '2',
        name: 'Ana Oliveira',
        email: 'ana.oliveira@email.com',
        phone: '(11) 88888-8888',
        document: '987.654.321-00',
        birthDate: '1990-07-22',
        address: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        preferences: ['Romance', 'Praia', 'Luxo'],
        totalBookings: 3,
        totalSpent: 5200,
        lastBooking: '2025-01-16'
      }
    ];

    setBookings(mockBookings);
    setPackages(mockPackages);
    setCustomers(mockCustomers);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      case 'partial': return 'Parcial';
      default: return status;
    }
  };

  const handleCreateBooking = () => {
    setShowCreateModal(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCreateModal(true);
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    // Implementar visualização detalhada
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm('Tem certeza que deseja excluir esta reserva?')) {
      setBookings(bookings.filter(b => b.id !== bookingId));
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/dashboard-rsv" className="text-gray-400 hover:text-gray-500 mr-4">
                  ← Voltar ao Dashboard
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestão de Reservas</h1>
                  <p className="text-sm text-gray-500">Gerencie todas as reservas da Reservei Viagens</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCreateBooking}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Nova Reserva
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filtros e Controles */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar reservas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="confirmed">Confirmadas</option>
                    <option value="pending">Pendentes</option>
                    <option value="cancelled">Canceladas</option>
                    <option value="completed">Concluídas</option>
                  </select>
                  
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todas as Datas</option>
                    <option value="today">Hoje</option>
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mês</option>
                    <option value="future">Futuras</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        viewMode === 'list' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Lista
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        viewMode === 'calendar' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Calendário
                    </button>
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {bookings.reduce((sum, b) => sum + b.value, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Reservas */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Reservas</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destino
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pagamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                            <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.destination}</div>
                            <div className="text-sm text-gray-500">{booking.packageName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(booking.checkIn).toLocaleDateString('pt-BR')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(booking.checkOut).toLocaleDateString('pt-BR')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">R$ {booking.value.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {getPaymentStatusText(booking.paymentStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewBooking(booking)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditBooking(booking)}
                              className="text-green-600 hover:text-green-900"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Visualização em Calendário */}
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Visualização em Calendário</h3>
                <p className="text-gray-500">Funcionalidade de calendário será implementada em breve</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Criação/Edição de Reserva */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedBooking ? 'Editar Reserva' : 'Nova Reserva'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedBooking(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Formulário de Reserva</h3>
                  <p className="text-gray-500">Formulário completo será implementado em breve</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

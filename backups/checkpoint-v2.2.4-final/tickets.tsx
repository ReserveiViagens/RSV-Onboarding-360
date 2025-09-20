import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';
import {
  Ticket,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  MapPin
} from 'lucide-react';

interface TicketData {
  id: number;
  title: string;
  destination: string;
  type: 'attraction' | 'park' | 'show' | 'transport';
  price: number;
  quantity: number;
  available: number;
  status: 'active' | 'sold_out' | 'expired' | 'upcoming';
  validFrom: string;
  validUntil: string;
  description: string;
  category: string;
}

export default function TicketsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNewTicket, setShowNewTicket] = useState(false);

  // Dados mockados de ingressos
  const mockTickets: TicketData[] = [
    {
      id: 1,
      title: 'Disney World - Magic Kingdom',
      destination: 'Orlando, EUA',
      type: 'park',
      price: 450.00,
      quantity: 100,
      available: 75,
      status: 'active',
      validFrom: '2024-08-01',
      validUntil: '2024-12-31',
      description: 'Ingresso para o parque Magic Kingdom da Disney',
      category: 'Parques Temáticos'
    },
    {
      id: 2,
      title: 'Torre Eiffel - Acesso Premium',
      destination: 'Paris, França',
      type: 'attraction',
      price: 89.00,
      quantity: 50,
      available: 0,
      status: 'sold_out',
      validFrom: '2024-08-15',
      validUntil: '2024-09-15',
      description: 'Acesso prioritário à Torre Eiffel com guia',
      category: 'Atrações Turísticas'
    },
    {
      id: 3,
      title: 'Show de Cirque du Soleil',
      destination: 'Las Vegas, EUA',
      type: 'show',
      price: 180.00,
      quantity: 200,
      available: 45,
      status: 'active',
      validFrom: '2024-09-01',
      validUntil: '2024-11-30',
      description: 'Ingresso para espetáculo do Cirque du Soleil',
      category: 'Shows e Espetáculos'
    },
    {
      id: 4,
      title: 'Metrô de Nova York - 7 Dias',
      destination: 'Nova York, EUA',
      type: 'transport',
      price: 33.00,
      quantity: 500,
      available: 320,
      status: 'active',
      validFrom: '2024-08-01',
      validUntil: '2024-12-31',
      description: 'Passe de 7 dias para metrô de Nova York',
      category: 'Transporte Público'
    },
    {
      id: 5,
      title: 'Universal Studios - Express Pass',
      destination: 'Orlando, EUA',
      type: 'park',
      price: 180.00,
      quantity: 80,
      available: 12,
      status: 'active',
      validFrom: '2024-08-01',
      validUntil: '2024-12-31',
      description: 'Ingresso com acesso expresso às atrações',
      category: 'Parques Temáticos'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold_out': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'park': return 'bg-purple-100 text-purple-800';
      case 'attraction': return 'bg-orange-100 text-orange-800';
      case 'show': return 'bg-pink-100 text-pink-800';
      case 'transport': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleNewTicket = () => {
    setShowNewTicket(true);
  };

  const handleDeleteTicket = (ticketId: number) => {
    if (confirm('Tem certeza que deseja excluir este ingresso?')) {
      console.log('Ingresso excluído:', ticketId);
    }
  };

  const handleExportTickets = () => {
    console.log('Exportando ingressos...');
    alert('Relatório de ingressos será baixado em breve!');
  };

  const handleImportTickets = () => {
    console.log('Importando ingressos...');
    alert('Funcionalidade de importação será implementada em breve!');
  };

  // Filtros
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || ticket.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const totalRevenue = mockTickets.reduce((sum, ticket) => sum + (ticket.price * (ticket.quantity - ticket.available)), 0);
  const totalTickets = mockTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const soldTickets = mockTickets.reduce((sum, ticket) => sum + (ticket.quantity - ticket.available), 0);
  const activeTickets = mockTickets.filter(ticket => ticket.status === 'active').length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🎫 Gestão de Ingressos</h1>
                <p className="text-gray-600 mt-2">Gerencie ingressos, passes e tickets</p>
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Ticket className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Ingressos</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Vendidos</p>
                  <p className="text-2xl font-bold text-gray-900">{soldTickets}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTickets}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar ingressos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="sold_out">Esgotados</option>
                    <option value="expired">Expirados</option>
                    <option value="upcoming">Próximos</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleImportTickets}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                  </button>
                  <button
                    onClick={handleExportTickets}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </button>
                  <button
                    onClick={handleNewTicket}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Ingresso
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{ticket.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {ticket.destination}
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status === 'sold_out' ? 'Esgotado' : 
                           ticket.status === 'active' ? 'Ativo' : 
                           ticket.status === 'expired' ? 'Expirado' : 'Próximo'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(ticket.type)}`}>
                          {ticket.type === 'park' ? 'Parque' :
                           ticket.type === 'attraction' ? 'Atração' :
                           ticket.type === 'show' ? 'Show' : 'Transporte'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Preço:</span>
                      <span className="font-semibold">{formatCurrency(ticket.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Disponíveis:</span>
                      <span className="font-semibold">{ticket.available}/{ticket.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Válido até:</span>
                      <span className="font-semibold">{formatDate(ticket.validUntil)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        <Eye className="h-4 w-4 inline mr-1" />
                        Ver
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        <Edit className="h-4 w-4 inline mr-1" />
                        Editar
                      </button>
                    </div>
                    <button 
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Trash className="h-4 w-4 inline mr-1" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum ingresso encontrado</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 
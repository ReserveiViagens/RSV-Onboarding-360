import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';
import { 
  Star, 
  Gift, 
  Users, 
  TrendingUp, 
  Award, 
  Crown,
  Plus,
  Edit,
  Trash,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

interface LoyaltyTier {
  id: number;
  name: string;
  description: string;
  min_points: number;
  max_points?: number;
  discount_percentage: number;
  benefits: string[];
  color: string;
  icon: string;
}

interface UserLoyalty {
  id: number;
  user_id: number;
  tier_id: number;
  points_balance: number;
  lifetime_points: number;
  tier_name: string;
  tier_color: string;
  tier_icon: string;
  next_tier_points: number;
  progress_percentage: number;
}

interface LoyaltyCampaign {
  id: number;
  name: string;
  description: string;
  points_multiplier: number;
  bonus_points: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applicable_tiers: string[];
}

export default function LoyaltyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Dados simulados - em produção viriam da API
  const [loyaltyTiers] = useState<LoyaltyTier[]>([
    {
      id: 1,
      name: 'Bronze',
      description: 'Nível inicial de fidelidade',
      min_points: 0,
      max_points: 999,
      discount_percentage: 5,
      benefits: ['5% de desconto', 'Suporte básico'],
      color: 'bg-amber-500',
      icon: '🥉'
    },
    {
      id: 2,
      name: 'Prata',
      description: 'Nível intermediário',
      min_points: 1000,
      max_points: 4999,
      discount_percentage: 10,
      benefits: ['10% de desconto', 'Suporte prioritário', 'Frete grátis'],
      color: 'bg-gray-400',
      icon: '🥈'
    },
    {
      id: 3,
      name: 'Ouro',
      description: 'Nível avançado',
      min_points: 5000,
      max_points: 19999,
      discount_percentage: 15,
      benefits: ['15% de desconto', 'Suporte VIP', 'Frete grátis', 'Check-in antecipado'],
      color: 'bg-yellow-500',
      icon: '🥇'
    },
    {
      id: 4,
      name: 'Platina',
      description: 'Nível premium',
      min_points: 20000,
      discount_percentage: 20,
      benefits: ['20% de desconto', 'Suporte 24/7', 'Frete grátis', 'Check-in antecipado', 'Upgrade automático'],
      color: 'bg-purple-500',
      icon: '💎'
    }
  ]);

  const [userLoyalty] = useState<UserLoyalty>({
    id: 1,
    user_id: 1,
    tier_id: 2,
    points_balance: 2500,
    lifetime_points: 8500,
    tier_name: 'Prata',
    tier_color: 'bg-gray-400',
    tier_icon: '🥈',
    next_tier_points: 2500,
    progress_percentage: 50
  });

  const [loyaltyCampaigns] = useState<LoyaltyCampaign[]>([
    {
      id: 1,
      name: 'Promoção de Verão',
      description: 'Ganhe pontos extras em todas as reservas',
      points_multiplier: 1.5,
      bonus_points: 500,
      start_date: '2025-01-01',
      end_date: '2025-03-31',
      is_active: true,
      applicable_tiers: ['Bronze', 'Prata', 'Ouro', 'Platina']
    },
    {
      id: 2,
      name: 'Black Friday',
      description: 'Pontos duplos em compras',
      points_multiplier: 2.0,
      bonus_points: 1000,
      start_date: '2025-11-20',
      end_date: '2025-11-30',
      is_active: false,
      applicable_tiers: ['Ouro', 'Platina']
    }
  ]);

  const [stats] = useState({
    total_users: 15420,
    active_users: 12350,
    total_points_distributed: 2500000,
    average_points_per_user: 162,
    top_tier_users: 1250,
    conversion_rate: 78.5
  });

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const filteredTiers = loyaltyTiers.filter(tier =>
    tier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tier.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCampaigns = loyaltyCampaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={handleBackToDashboard}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ← Voltar
                </button>
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sistema de Fidelidade</h1>
                    <p className="text-sm text-gray-500">Gerencie programas de fidelidade e recompensas</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Campanha
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Visão Geral', icon: '📊' },
                { id: 'tiers', name: 'Níveis', icon: '🏆' },
                { id: 'campaigns', name: 'Campanhas', icon: '🎯' },
                { id: 'users', name: 'Usuários', icon: '👥' },
                { id: 'reports', name: 'Relatórios', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total_users.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Usuários Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.active_users.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Pontos Distribuídos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total_points_distributed.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.conversion_rate}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Loyalty Status */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Seu Status de Fidelidade</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full ${userLoyalty.tier_color} mr-4`}>
                        <span className="text-2xl">{userLoyalty.tier_icon}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{userLoyalty.tier_name}</h4>
                        <p className="text-gray-500">Nível atual</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{userLoyalty.points_balance.toLocaleString()}</p>
                      <p className="text-gray-500">Pontos atuais</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progresso para próximo nível</span>
                      <span>{userLoyalty.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${userLoyalty.progress_percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Faltam {userLoyalty.next_tier_points.toLocaleString()} pontos para o próximo nível
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Atividade Recente</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { action: 'Reserva realizada', points: '+150', date: 'Hoje, 14:30' },
                      { action: 'Avaliação enviada', points: '+50', date: 'Ontem, 16:45' },
                      { action: 'Check-in antecipado', points: '+25', date: '2 dias atrás' },
                      { action: 'Compra de pacote', points: '+300', date: '1 semana atrás' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.date}</p>
                          </div>
                        </div>
                        <span className="text-green-600 font-semibold">{activity.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tiers' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar níveis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos os níveis</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Nível
                </button>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTiers.map((tier) => (
                  <div key={tier.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className={`p-6 ${tier.color} rounded-t-lg`}>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{tier.icon}</span>
                        <div className="flex space-x-2">
                          <button className="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors">
                            <Edit className="h-4 w-4 text-white" />
                          </button>
                          <button className="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors">
                            <Trash className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-4">{tier.name}</h3>
                      <p className="text-white/80 text-sm mt-1">{tier.description}</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pontos necessários:</span>
                          <span className="font-semibold">{tier.min_points.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Desconto:</span>
                          <span className="font-semibold text-green-600">{tier.discount_percentage}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Benefícios:</span>
                          <ul className="mt-2 space-y-1">
                            {tier.benefits.map((benefit, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <div className="w-1 h-1 bg-purple-500 rounded-full mr-2"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar campanhas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Campanha
                </button>
              </div>

              {/* Campaigns List */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Campanhas Ativas</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="text-lg font-medium text-gray-900">{campaign.name}</h4>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              campaign.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.is_active ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>
                          <p className="text-gray-500 mt-1">{campaign.description}</p>
                          <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600">
                            <span>Multiplicador: {campaign.points_multiplier}x</span>
                            <span>Bônus: +{campaign.bonus_points} pontos</span>
                            <span>Válida até: {new Date(campaign.end_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Usuários do Programa de Fidelidade</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Relatórios de Fidelidade</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { useToast } from '../components/ToastContainer';

interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
  userBehavior: {
    pageViews: number;
    sessions: number;
    uniqueUsers: number;
    returningUsers: number;
  };
  trafficSources: {
    organic: number;
    direct: number;
    social: number;
    email: number;
    referral: number;
    paid: number;
  };
  deviceUsage: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topPages: Array<{
    url: string;
    title: string;
    views: number;
    uniqueViews: number;
    bounceRate: number;
    avgTimeOnPage: number;
  }>;
  userJourney: Array<{
    step: string;
    users: number;
    conversionRate: number;
    dropoffRate: number;
  }>;
  geographicData: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  realTimeData: {
    currentUsers: number;
    activeSessions: number;
    pageViewsLastHour: number;
    topCurrentPages: Array<{
      page: string;
      users: number;
    }>;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    userGrowth: 0,
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    averageSessionDuration: 0,
    userBehavior: {
      pageViews: 0,
      sessions: 0,
      uniqueUsers: 0,
      returningUsers: 0
    },
    trafficSources: {
      organic: 0,
      direct: 0,
      social: 0,
      email: 0,
      referral: 0,
      paid: 0
    },
    deviceUsage: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    },
    topPages: [],
    userJourney: [],
    geographicData: [],
    realTimeData: {
      currentUsers: 0,
      activeSessions: 0,
      pageViewsLastHour: 0,
      topCurrentPages: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [view, setView] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange, view]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // Simular dados de analytics (em produção, viria da API)
      const mockData: AnalyticsMetrics = {
        totalUsers: 125000,
        activeUsers: 8500,
        newUsers: 1250,
        userGrowth: 15.8,
        pageViews: 450000,
        uniqueVisitors: 25000,
        bounceRate: 42.5,
        averageSessionDuration: 185,
        userBehavior: {
          pageViews: 450000,
          sessions: 85000,
          uniqueUsers: 25000,
          returningUsers: 15000
        },
        trafficSources: {
          organic: 45,
          direct: 25,
          social: 15,
          email: 8,
          referral: 5,
          paid: 2
        },
        deviceUsage: {
          desktop: 55,
          mobile: 40,
          tablet: 5
        },
        topPages: [
          {
            url: '/',
            title: 'Página Inicial',
            views: 85000,
            uniqueViews: 25000,
            bounceRate: 35,
            avgTimeOnPage: 120
          },
          {
            url: '/disney',
            title: 'Pacotes Disney',
            views: 65000,
            uniqueViews: 18000,
            bounceRate: 28,
            avgTimeOnPage: 180
          },
          {
            url: '/universal',
            title: 'Universal Studios',
            views: 45000,
            uniqueViews: 12000,
            bounceRate: 32,
            avgTimeOnPage: 150
          },
          {
            url: '/miami',
            title: 'Destinos Miami',
            views: 35000,
            uniqueViews: 9500,
            bounceRate: 38,
            avgTimeOnPage: 140
          },
          {
            url: '/contato',
            title: 'Contato',
            views: 25000,
            uniqueViews: 8000,
            bounceRate: 45,
            avgTimeOnPage: 90
          }
        ],
        userJourney: [
          {
            step: 'Página Inicial',
            users: 25000,
            conversionRate: 100,
            dropoffRate: 0
          },
          {
            step: 'Exploração de Produtos',
            users: 18000,
            conversionRate: 72,
            dropoffRate: 28
          },
          {
            step: 'Adição ao Carrinho',
            users: 8500,
            conversionRate: 34,
            dropoffRate: 38
          },
          {
            step: 'Checkout',
            users: 4250,
            conversionRate: 17,
            dropoffRate: 17
          },
          {
            step: 'Compra Finalizada',
            users: 3400,
            conversionRate: 13.6,
            dropoffRate: 3.4
          }
        ],
        geographicData: [
          { country: 'Brasil', users: 20000, percentage: 80 },
          { country: 'Estados Unidos', users: 2500, percentage: 10 },
          { country: 'Argentina', users: 1250, percentage: 5 },
          { country: 'Chile', users: 750, percentage: 3 },
          { country: 'Outros', users: 500, percentage: 2 }
        ],
        realTimeData: {
          currentUsers: 125,
          activeSessions: 85,
          pageViewsLastHour: 1250,
          topCurrentPages: [
            { page: 'Página Inicial', users: 45 },
            { page: 'Pacotes Disney', users: 25 },
            { page: 'Universal Studios', users: 20 },
            { page: 'Destinos Miami', users: 15 },
            { page: 'Contato', users: 10 }
          ]
        }
      };
      
      setMetrics(mockData);
      showSuccess('Sucesso', 'Dados de analytics carregados com sucesso');
    } catch (error) {
      showError('Erro', 'Falha ao carregar dados de analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando dados de analytics...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Analytics</h1>
          <p className="text-gray-600">Análise de comportamento do usuário e insights de dados</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="overview">Visão Geral</option>
            <option value="realtime">Tempo Real</option>
            <option value="behavior">Comportamento</option>
            <option value="traffic">Tráfego</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1d">Último dia</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          <button
            onClick={loadAnalyticsData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.activeUsers)}</p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(metrics.userGrowth)}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(metrics.userGrowth)}`}>
                  {formatPercentage(metrics.userGrowth)}
                </span>
              </div>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.pageViews)}</p>
              <p className="text-sm text-gray-500 mt-1">Total de páginas</p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Rejeição</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.bounceRate)}</p>
              <p className="text-sm text-gray-500 mt-1">Usuários que saíram</p>
            </div>
            <MousePointer className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(metrics.averageSessionDuration)}</p>
              <p className="text-sm text-gray-500 mt-1">Por sessão</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Dados em Tempo Real */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados em Tempo Real</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 rounded-lg p-4">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{metrics.realTimeData.currentUsers}</p>
              <p className="text-sm font-medium text-gray-700">Usuários Ativos</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-4">
              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{metrics.realTimeData.activeSessions}</p>
              <p className="text-sm font-medium text-gray-700">Sessões Ativas</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-lg p-4">
              <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{formatNumber(metrics.realTimeData.pageViewsLastHour)}</p>
              <p className="text-sm font-medium text-gray-700">Páginas/Hora</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fontes de Tráfego */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fontes de Tráfego</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(metrics.trafficSources).map(([source, percentage]) => (
            <div key={source} className="text-center">
              <div className="bg-blue-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
                <div className="text-sm font-medium text-gray-700 capitalize mt-1">
                  {source.replace('_', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uso de Dispositivos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Uso de Dispositivos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-4">
              <Monitor className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{metrics.deviceUsage.desktop}%</p>
              <p className="text-sm font-medium text-gray-700">Desktop</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-lg p-4">
              <Smartphone className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{metrics.deviceUsage.mobile}%</p>
              <p className="text-sm font-medium text-gray-700">Mobile</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-lg p-4">
              <Monitor className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{metrics.deviceUsage.tablet}%</p>
              <p className="text-sm font-medium text-gray-700">Tablet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Páginas Mais Visitadas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Páginas Mais Visitadas</h3>
        <div className="space-y-4">
          {metrics.topPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{page.title}</h4>
                  <p className="text-xs text-gray-500">{page.url}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-semibold text-gray-900">{formatNumber(page.views)} visualizações</p>
                <p className="text-xs text-gray-500">{formatTime(page.avgTimeOnPage)} tempo médio</p>
                <p className="text-xs text-gray-500">{formatPercentage(page.bounceRate)} taxa de rejeição</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jornada do Usuário */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Jornada do Usuário</h3>
        <div className="space-y-4">
          {metrics.userJourney.map((step, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{step.step}</h4>
                  <p className="text-xs text-gray-500">{formatNumber(step.users)} usuários</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-semibold text-green-600">{formatPercentage(step.conversionRate)} conversão</p>
                <p className="text-xs text-red-500">{formatPercentage(step.dropoffRate)} abandono</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dados Geográficos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição Geográfica</h3>
        <div className="space-y-3">
          {metrics.geographicData.map((location, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">{location.country}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${location.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900">{location.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Páginas em Tempo Real */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Páginas Mais Ativas (Tempo Real)</h3>
        <div className="space-y-3">
          {metrics.realTimeData.topCurrentPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">{index + 1}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{page.page}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{page.users} usuários</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <BarChart3 className="h-4 w-4" />
            <span>Relatório Detalhado</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Download className="h-4 w-4" />
            <span>Exportar Dados</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            <Search className="h-4 w-4" />
            <span>Análise Avançada</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Activity className="h-4 w-4" />
            <span>Monitoramento</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 
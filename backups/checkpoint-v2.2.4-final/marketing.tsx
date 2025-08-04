import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';

interface Campaign {
    id: number;
    name: string;
    type: 'email' | 'social' | 'ads' | 'content';
    status: 'active' | 'paused' | 'completed' | 'draft';
    budget: number;
    spent: number;
    impressions: number;
    clicks: number;
    conversions: number;
    start_date: string;
    end_date: string;
    target_audience: string;
    description: string;
}

interface MarketingCategory {
    name: string;
    icon: string;
    color: string;
    description: string;
    count: number;
    metric: string;
}

export default function Marketing() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    // Categorias de marketing
    const categories: MarketingCategory[] = [
        {
            name: 'Campanhas Ativas',
            icon: '📈',
            color: 'green',
            description: 'Campanhas em execução',
            count: 8,
            metric: 'Conversões'
        },
        {
            name: 'Email Marketing',
            icon: '📧',
            color: 'blue',
            description: 'Campanhas de email',
            count: 12,
            metric: 'Taxa de Abertura'
        },
        {
            name: 'Redes Sociais',
            icon: '📱',
            color: 'purple',
            description: 'Marketing em redes sociais',
            count: 15,
            metric: 'Engajamento'
        },
        {
            name: 'Anúncios',
            icon: '💰',
            color: 'orange',
            description: 'Campanhas pagas',
            count: 6,
            metric: 'ROI'
        }
    ];

    // Dados mock de campanhas
    const mockCampaigns: Campaign[] = [
        {
            id: 1,
            name: 'Black Friday 2024',
            type: 'email',
            status: 'active',
            budget: 5000.00,
            spent: 3200.00,
            impressions: 45000,
            clicks: 2300,
            conversions: 156,
            start_date: '2024-11-20',
            end_date: '2024-11-30',
            target_audience: 'Clientes existentes',
            description: 'Campanha de Black Friday com ofertas especiais'
        },
        {
            id: 2,
            name: 'Instagram Stories',
            type: 'social',
            status: 'active',
            budget: 2000.00,
            spent: 1800.00,
            impressions: 25000,
            clicks: 1200,
            conversions: 89,
            start_date: '2024-11-15',
            end_date: '2024-12-15',
            target_audience: 'Jovens 18-35',
            description: 'Campanha de stories no Instagram'
        },
        {
            id: 3,
            name: 'Google Ads - Viagens',
            type: 'ads',
            status: 'active',
            budget: 8000.00,
            spent: 4500.00,
            impressions: 120000,
            clicks: 3400,
            conversions: 234,
            start_date: '2024-11-01',
            end_date: '2024-12-31',
            target_audience: 'Interessados em viagens',
            description: 'Campanha de anúncios no Google'
        }
    ];

    useEffect(() => {
        // Simular carregamento de dados
        setTimeout(() => {
            setCampaigns(mockCampaigns);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'email': return 'bg-blue-100 text-blue-800';
            case 'social': return 'bg-purple-100 text-purple-800';
            case 'ads': return 'bg-orange-100 text-orange-800';
            case 'content': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('pt-BR').format(value);
    };

    const calculateROI = (spent: number, conversions: number) => {
        if (spent === 0) return 0;
        return ((conversions * 100 - spent) / spent * 100).toFixed(2);
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📢 Marketing</h1>
                        <p className="text-gray-600 mt-2">Gestão de campanhas e estratégias de marketing</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Voltar ao Dashboard
                    </button>
                </div>

                {/* Estatísticas Gerais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total de Campanhas</p>
                                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Orçamento Total</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(campaigns.reduce((sum, c) => sum + c.budget, 0))}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Impressões Totais</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(campaigns.reduce((sum, c) => sum + c.impressions, 0))}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Conversões</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(campaigns.reduce((sum, c) => sum + c.conversions, 0))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categorias de Marketing */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {categories.map((category) => (
                        <div key={category.name} className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">{category.icon}</span>
                                        <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {selectedCategory === category.name ? '▼' : '▶'}
                                    </button>
                                </div>
                                
                                <p className="text-gray-600 mb-4">{category.description}</p>
                                
                                {selectedCategory === category.name && (
                                    <div className="space-y-3">
                                        {campaigns.filter(campaign => {
                                            switch (category.name) {
                                                case 'Campanhas Ativas': return campaign.status === 'active';
                                                case 'Email Marketing': return campaign.type === 'email';
                                                case 'Redes Sociais': return campaign.type === 'social';
                                                case 'Anúncios': return campaign.type === 'ads';
                                                default: return true;
                                            }
                                        }).map((campaign) => (
                                            <div key={campaign.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                        {campaign.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-2">{campaign.description}</p>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Orçamento:</span>
                                                        <span className="ml-1 font-medium">{formatCurrency(campaign.budget)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Gasto:</span>
                                                        <span className="ml-1 font-medium">{formatCurrency(campaign.spent)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Impressões:</span>
                                                        <span className="ml-1 font-medium">{formatNumber(campaign.impressions)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Conversões:</span>
                                                        <span className="ml-1 font-medium">{campaign.conversions}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        {category.count} campanhas nesta categoria
                                    </span>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Ver Todas →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lista de Campanhas */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">📋 Todas as Campanhas</h2>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                + Nova Campanha
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Campanha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Orçamento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gasto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Impressões
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Conversões
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ROI
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {campaigns.map((campaign) => (
                                        <tr key={campaign.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                                                    <div className="text-sm text-gray-500">{campaign.target_audience}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(campaign.type)}`}>
                                                    {campaign.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(campaign.budget)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(campaign.spent)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatNumber(campaign.impressions)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {campaign.conversions}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {calculateROI(campaign.spent, campaign.conversions)}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                    {campaign.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                                <button className="text-red-600 hover:text-red-900">Pausar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Ações Rápidas */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">⚡ Ações Rápidas</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center">
                                <div className="text-2xl mb-2">📧</div>
                                <p className="text-sm font-medium">Email Marketing</p>
                            </button>
                            
                            <button className="p-4 border rounded-lg hover:bg-purple-50 transition-colors text-center">
                                <div className="text-2xl mb-2">📱</div>
                                <p className="text-sm font-medium">Redes Sociais</p>
                            </button>
                            
                            <button className="p-4 border rounded-lg hover:bg-orange-50 transition-colors text-center">
                                <div className="text-2xl mb-2">💰</div>
                                <p className="text-sm font-medium">Anúncios</p>
                            </button>
                            
                            <button className="p-4 border rounded-lg hover:bg-green-50 transition-colors text-center">
                                <div className="text-2xl mb-2">📊</div>
                                <p className="text-sm font-medium">Analytics</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';

interface ServiceStatus {
  name: string;
  port: number;
  status: 'online' | 'offline' | 'warning';
  icon: string;
  description: string;
}

interface Category {
  name: string;
  icon: string;
  color: string;
  services: ServiceStatus[];
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Categorias e serviços organizados
    const categories: Category[] = [
        {
            name: 'Turismo',
            icon: '✈️',
            color: 'blue',
            services: [
                { name: 'Viagens', port: 5001, status: 'online', icon: '🌍', description: 'Gestão de viagens e reservas' },
                { name: 'Atrações', port: 5002, status: 'online', icon: '🎡', description: 'Atrações turísticas' },
                { name: 'Parques', port: 5003, status: 'online', icon: '🎢', description: 'Parques e entretenimento' },
                { name: 'Ingressos', port: 5004, status: 'online', icon: '🎫', description: 'Venda de ingressos' }
            ]
        },
        {
            name: 'Marketing',
            icon: '📢',
            color: 'purple',
            services: [
                { name: 'Campanhas', port: 5005, status: 'online', icon: '📈', description: 'Campanhas de marketing' },
                { name: 'Analytics', port: 5006, status: 'online', icon: '📊', description: 'Análises e relatórios' },
                { name: 'SEO', port: 5007, status: 'online', icon: '🔍', description: 'Otimização para motores de busca' },
                { name: 'Recomendações', port: 5008, status: 'online', icon: '💡', description: 'Sistema de recomendações' }
            ]
        },
        {
            name: 'Fidelização',
            icon: '🎁',
            color: 'green',
            services: [
                { name: 'Fidelidade', port: 5009, status: 'online', icon: '⭐', description: 'Programa de fidelidade' },
                { name: 'Recompensas', port: 5010, status: 'online', icon: '🏆', description: 'Sistema de recompensas' },
                { name: 'Cupons', port: 5011, status: 'online', icon: '🎫', description: 'Gestão de cupons' },
                { name: 'Cartões Presente', port: 5012, status: 'online', icon: '💳', description: 'Cartões presente' }
            ]
        },
        {
            name: 'E-commerce',
            icon: '🛒',
            color: 'orange',
            services: [
                { name: 'Vendas', port: 5013, status: 'online', icon: '💰', description: 'Gestão de vendas' },
                { name: 'Produtos', port: 5014, status: 'online', icon: '📦', description: 'Produtos e estoque' },
                { name: 'Estoque', port: 5015, status: 'online', icon: '📋', description: 'Controle de estoque' },
                { name: 'E-commerce', port: 5016, status: 'online', icon: '🛍️', description: 'Comércio eletrônico' }
            ]
        },
        {
            name: 'Financeiro',
            icon: '💼',
            color: 'yellow',
            services: [
                { name: 'Finanças', port: 5017, status: 'online', icon: '📊', description: 'Gestão financeira' },
                { name: 'Relatórios', port: 5018, status: 'online', icon: '📈', description: 'Relatórios financeiros' }
            ]
        },
        {
            name: 'Conteúdo',
            icon: '📷',
            color: 'pink',
            services: [
                { name: 'Fotos', port: 5019, status: 'online', icon: '📸', description: 'Gestão de fotos' },
                { name: 'Vídeos', port: 5020, status: 'online', icon: '🎥', description: 'Gestão de vídeos' },
                { name: 'Avaliações', port: 5021, status: 'online', icon: '⭐', description: 'Sistema de avaliações' },
                { name: 'Multilíngue', port: 5022, status: 'online', icon: '🌐', description: 'Suporte multilíngue' }
            ]
        },
        {
            name: 'Automação',
            icon: '🤖',
            color: 'indigo',
            services: [
                { name: 'Chatbots', port: 5023, status: 'online', icon: '💬', description: 'Chatbots inteligentes' },
                { name: 'Notificações', port: 5024, status: 'online', icon: '🔔', description: 'Sistema de notificações' }
            ]
        }
    ];

    const handleLogout = () => {
        logout();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-100 text-green-800';
            case 'offline': return 'bg-red-100 text-red-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (color: string) => {
        const colors = {
            blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
            purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
            green: 'bg-green-50 border-green-200 hover:bg-green-100',
            orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
            yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
            pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
            indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const totalServices = categories.reduce((acc, cat) => acc + cat.services.length, 0);
    const onlineServices = categories.reduce((acc, cat) => 
        acc + cat.services.filter(s => s.status === 'online').length, 0
    );

    return (
        <ProtectedRoute>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 Dashboard</h1>
                        <p className="text-gray-600 mt-2">Visão geral do sistema Onion RSV 360</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            Olá, {user?.full_name || user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>

                {/* Estatísticas Gerais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-2xl">🏗️</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total de Serviços</p>
                                <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Serviços Online</p>
                                <p className="text-2xl font-bold text-gray-900">{onlineServices}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Categorias</p>
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Uptime</p>
                                <p className="text-2xl font-bold text-gray-900">99.9%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categorias e Serviços */}
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
                                
                                {selectedCategory === category.name && (
                                    <div className="space-y-3">
                                        {category.services.map((service) => (
                                            <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center">
                                                    <span className="text-lg mr-3">{service.icon}</span>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{service.name}</p>
                                                        <p className="text-sm text-gray-600">{service.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                                                        {service.status}
                                                    </span>
                                                    <span className="text-xs text-gray-500">Porta {service.port}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        {category.services.filter(s => s.status === 'online').length} de {category.services.length} serviços online
                                    </span>
                                    <button
                                        onClick={() => router.push(`/${category.name.toLowerCase().replace(' ', '')}`)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Ver Detalhes →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Informações do Usuário */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">👤 Informações do Perfil</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                <p className="mt-1 text-sm text-gray-900">{user?.full_name || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 text-sm text-gray-900">{user?.email || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Permissões</label>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {user?.permissions?.map((permission, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {permission === 'admin' ? 'Administrador' : 
                                             permission === 'usuario' ? 'Usuário' : permission}
                                        </span>
                                    )) || <span className="text-gray-500">Nenhuma permissão definida</span>}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Ativo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ações Rápidas */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">⚡ Ações Rápidas</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button
                                onClick={() => router.push('/travel')}
                                className="p-4 border rounded-lg hover:bg-blue-50 transition-colors text-center"
                            >
                                <div className="text-2xl mb-2">✈️</div>
                                <p className="text-sm font-medium">Nova Viagem</p>
                            </button>
                            
                            <button
                                onClick={() => router.push('/marketing')}
                                className="p-4 border rounded-lg hover:bg-purple-50 transition-colors text-center"
                            >
                                <div className="text-2xl mb-2">📢</div>
                                <p className="text-sm font-medium">Nova Campanha</p>
                            </button>
                            
                            <button
                                onClick={() => router.push('/analytics')}
                                className="p-4 border rounded-lg hover:bg-green-50 transition-colors text-center"
                            >
                                <div className="text-2xl mb-2">📊</div>
                                <p className="text-sm font-medium">Ver Relatórios</p>
                            </button>
                            
                            <button
                                onClick={() => router.push('/coupons')}
                                className="p-4 border rounded-lg hover:bg-yellow-50 transition-colors text-center"
                            >
                                <div className="text-2xl mb-2">🎫</div>
                                <p className="text-sm font-medium">Criar Cupom</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
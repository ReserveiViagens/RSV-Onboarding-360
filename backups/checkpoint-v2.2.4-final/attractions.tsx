import React, { useState, useEffect } from 'react';
import { Mountain, MapPin, Star, Clock, DollarSign, Users } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

interface Attraction {
    id: number;
    name: string;
    location: string;
    description: string;
    rating: number;
    price: number;
    duration: string;
    visitors: number;
    image?: string;
}

export default function AttractionsPage() {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState(true);

    // Dados mockados para atrações
    const mockAttractions: Attraction[] = [
        {
            id: 1,
            name: "Cristo Redentor",
            location: "Rio de Janeiro, RJ",
            description: "Monumento art déco de Jesus Cristo no topo do Corcovado, oferecendo vistas panorâmicas da cidade.",
            rating: 4.8,
            price: 85.00,
            duration: "2-3 horas",
            visitors: 2500000
        },
        {
            id: 2,
            name: "Pão de Açúcar",
            location: "Rio de Janeiro, RJ",
            description: "Complexo de bondinhos que leva ao topo do Pão de Açúcar, com vistas espetaculares da Baía de Guanabara.",
            rating: 4.7,
            price: 120.00,
            duration: "3-4 horas",
            visitors: 1800000
        },
        {
            id: 3,
            name: "Cataratas do Iguaçu",
            location: "Foz do Iguaçu, PR",
            description: "Uma das maiores cachoeiras do mundo, com 275 quedas d'água em meio à Mata Atlântica.",
            rating: 4.9,
            price: 95.00,
            duration: "4-5 horas",
            visitors: 1500000
        },
        {
            id: 4,
            name: "Pelourinho",
            location: "Salvador, BA",
            description: "Centro histórico de Salvador com arquitetura colonial, igrejas barrocas e cultura afro-brasileira.",
            rating: 4.6,
            price: 45.00,
            duration: "3-4 horas",
            visitors: 800000
        },
        {
            id: 5,
            name: "Lençóis Maranhenses",
            location: "Barreirinhas, MA",
            description: "Parque nacional com dunas de areia branca e lagoas cristalinas, um cenário único no mundo.",
            rating: 4.8,
            price: 150.00,
            duration: "6-8 horas",
            visitors: 300000
        },
        {
            id: 6,
            name: "Fernando de Noronha",
            location: "Fernando de Noronha, PE",
            description: "Arquipélago paradisíaco com praias de areia branca, águas cristalinas e vida marinha abundante.",
            rating: 4.9,
            price: 200.00,
            duration: "1-3 dias",
            visitors: 60000
        }
    ];

    useEffect(() => {
        // Simular carregamento de dados
        const loadAttractions = async () => {
            setLoading(true);
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAttractions(mockAttractions);
            setLoading(false);
        };

        loadAttractions();
    }, []);

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Mountain className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900">Carregando atrações...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Atrações Turísticas</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Descubra os melhores pontos turísticos do Brasil
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <Mountain className="h-5 w-5 inline mr-2" />
                                    Nova Atração
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
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Mountain className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total de Atrações</p>
                                    <p className="text-2xl font-bold text-gray-900">{attractions.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Visitantes/Ano</p>
                                    <p className="text-2xl font-bold text-gray-900">7.5M</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Star className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Receita Média</p>
                                    <p className="text-2xl font-bold text-gray-900">R$ 115</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attractions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {attractions.map(attraction => (
                            <div key={attraction.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                                    <Mountain className="h-16 w-16 text-white" />
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">{attraction.name}</h3>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-sm font-medium text-gray-600">{attraction.rating}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600 mb-3">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{attraction.location}</span>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{attraction.description}</p>
                                    
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            <span>{attraction.duration}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            <span>{attraction.visitors.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-green-600">
                                            R$ {attraction.price.toFixed(2)}
                                        </span>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 
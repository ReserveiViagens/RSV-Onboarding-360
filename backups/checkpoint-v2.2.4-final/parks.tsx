import React, { useState, useEffect } from 'react';
import { MapPin, TreePine, Star, Clock, DollarSign, Users, Mountain } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

interface Park {
    id: number;
    name: string;
    location: string;
    description: string;
    type: 'nacional' | 'estadual' | 'municipal' | 'privado';
    rating: number;
    price: number;
    duration: string;
    visitors: number;
    area: string;
}

export default function ParksPage() {
    const [parks, setParks] = useState<Park[]>([]);
    const [loading, setLoading] = useState(true);

    // Dados mockados para parques
    const mockParks: Park[] = [
        {
            id: 1,
            name: "Parque Nacional da Tijuca",
            location: "Rio de Janeiro, RJ",
            description: "Maior floresta urbana do mundo, abrigando o Cristo Redentor e trilhas espetaculares.",
            type: "nacional",
            rating: 4.8,
            price: 0,
            duration: "4-6 horas",
            visitors: 2000000,
            area: "3.953 km²"
        },
        {
            id: 2,
            name: "Parque Nacional do Iguaçu",
            location: "Foz do Iguaçu, PR",
            description: "Patrimônio Natural da Humanidade, abriga as Cataratas do Iguaçu e rica biodiversidade.",
            type: "nacional",
            rating: 4.9,
            price: 95.00,
            duration: "6-8 horas",
            visitors: 1500000,
            area: "1.852 km²"
        },
        {
            id: 3,
            name: "Parque Nacional dos Lençóis Maranhenses",
            location: "Barreirinhas, MA",
            description: "Paisagem única com dunas de areia branca e lagoas cristalinas intercaladas.",
            type: "nacional",
            rating: 4.8,
            price: 150.00,
            duration: "1-2 dias",
            visitors: 300000,
            area: "1.550 km²"
        },
        {
            id: 4,
            name: "Parque Nacional da Chapada Diamantina",
            location: "Lençóis, BA",
            description: "Serras, cachoeiras, grutas e vales esculpidos em quartzito, ideal para ecoturismo.",
            type: "nacional",
            rating: 4.7,
            price: 80.00,
            duration: "3-5 dias",
            visitors: 250000,
            area: "1.520 km²"
        },
        {
            id: 5,
            name: "Parque Nacional de Fernando de Noronha",
            location: "Fernando de Noronha, PE",
            description: "Arquipélago vulcânico com praias paradisíacas e vida marinha abundante.",
            type: "nacional",
            rating: 4.9,
            price: 200.00,
            duration: "3-7 dias",
            visitors: 60000,
            area: "26 km²"
        },
        {
            id: 6,
            name: "Parque Nacional da Serra dos Órgãos",
            location: "Teresópolis, RJ",
            description: "Montanhas imponentes com trilhas desafiadoras e vistas panorâmicas espetaculares.",
            type: "nacional",
            rating: 4.6,
            price: 45.00,
            duration: "4-8 horas",
            visitors: 180000,
            area: "204 km²"
        }
    ];

    useEffect(() => {
        // Simular carregamento de dados
        const loadParks = async () => {
            setLoading(true);
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setParks(mockParks);
            setLoading(false);
        };

        loadParks();
    }, []);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'nacional': return 'bg-green-100 text-green-800';
            case 'estadual': return 'bg-blue-100 text-blue-800';
            case 'municipal': return 'bg-purple-100 text-purple-800';
            case 'privado': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <TreePine className="h-12 w-12 text-green-600 animate-pulse mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900">Carregando parques...</p>
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
                                <h1 className="text-3xl font-bold text-gray-900">Parques Nacionais</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Explore as maravilhas naturais do Brasil
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                    <TreePine className="h-5 w-5 inline mr-2" />
                                    Novo Parque
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
                                    <TreePine className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total de Parques</p>
                                    <p className="text-2xl font-bold text-gray-900">{parks.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Visitantes/Ano</p>
                                    <p className="text-2xl font-bold text-gray-900">4.2M</p>
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
                                    <Mountain className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Área Total</p>
                                    <p className="text-2xl font-bold text-gray-900">9.1k km²</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {parks.map(park => (
                            <div key={park.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
                                    <TreePine className="h-16 w-16 text-white" />
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">{park.name}</h3>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-sm font-medium text-gray-600">{park.rating}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span className="text-sm">{park.location}</span>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(park.type)}`}>
                                            {park.type.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{park.description}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            <span>{park.duration}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            <span>{park.visitors.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Mountain className="h-4 w-4 mr-1" />
                                            <span>{park.area}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <DollarSign className="h-4 w-4 mr-1" />
                                            <span>{park.price === 0 ? 'Gratuito' : `R$ ${park.price.toFixed(2)}`}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            Área: {park.area}
                                        </span>
                                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
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
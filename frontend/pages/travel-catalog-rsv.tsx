import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign,
  Star,
  Heart,
  Share2,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Plane,
  Car,
  Bus,
  Train,
  Ship,
  Bike,
  Footprints,
  Clock,
  Users,
  Award,
  Globe,
  Building,
  Mountain,
  Beach,
  TreePine,
  Palette,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Filter as FilterIcon,
  Grid,
  List,
  Sliders
} from 'lucide-react';

interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  country: string;
  region: string;
  description: string;
  shortDescription: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  category: 'beach' | 'mountain' | 'city' | 'adventure' | 'romantic' | 'family' | 'cultural' | 'nature';
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  groupSize: 'individual' | 'couple' | 'small' | 'large';
  bestTime: string[];
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  isNew: boolean;
  isDiscounted: boolean;
  availability: {
    startDate: string;
    endDate: string;
    maxTravelers: number;
    currentBookings: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface FilterOptions {
  category: string[];
  priceRange: [number, number];
  duration: string[];
  difficulty: string[];
  groupSize: string[];
  rating: number;
  destination: string[];
  bestTime: string[];
}

export default function TravelCatalogRSV() {
  const { user } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [showPackageModal, setShowPackageModal] = useState(false);

  // Filtros
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: [0, 10000],
    duration: [],
    difficulty: [],
    groupSize: [],
    rating: 0,
    destination: [],
    bestTime: []
  });

  // Dados simulados - em produção viriam da API
  useEffect(() => {
    const mockPackages: TravelPackage[] = [
      {
        id: '1',
        name: 'Pacote Família Caldas Novas',
        destination: 'Caldas Novas',
        country: 'Brasil',
        region: 'Goiás',
        description: 'Aproveite as águas termais de Caldas Novas com toda a família. Hospedagem em resort familiar com parque aquático, spa e atividades para todas as idades.',
        shortDescription: 'Águas termais e diversão para toda família',
        duration: '3 dias / 2 noites',
        price: 1500,
        originalPrice: 1800,
        discount: 17,
        images: ['/images/caldas-novas-1.jpg', '/images/caldas-novas-2.jpg'],
        highlights: ['Águas termais', 'Parque aquático', 'Hospedagem familiar', 'SPA completo'],
        included: ['Hospedagem em resort 4 estrelas', 'Café da manhã', 'Transfer aeroporto', 'Acesso ao parque aquático'],
        notIncluded: ['Passagens aéreas', 'Almoço e jantar', 'Passeios opcionais', 'Seguro viagem'],
        category: 'family',
        difficulty: 'easy',
        groupSize: 'large',
        bestTime: ['Janeiro', 'Fevereiro', 'Março', 'Julho', 'Agosto', 'Dezembro'],
        rating: 4.8,
        reviewCount: 127,
        isPopular: true,
        isNew: false,
        isDiscounted: true,
        availability: {
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          maxTravelers: 50,
          currentBookings: 23
        },
        tags: ['Águas termais', 'Família', 'Resort', 'Parque aquático', 'SPA'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Pacote Romântico Porto de Galinhas',
        destination: 'Porto de Galinhas',
        country: 'Brasil',
        region: 'Pernambuco',
        description: 'Romance e praia em um dos destinos mais bonitos do Brasil. Hospedagem em pousada romântica com vista para o mar, passeios de jangada e jantares à beira-mar.',
        shortDescription: 'Romance e praias paradisíacas',
        duration: '5 dias / 4 noites',
        price: 2200,
        images: ['/images/porto-galinhas-1.jpg', '/images/porto-galinhas-2.jpg'],
        highlights: ['Praias paradisíacas', 'Hospedagem romântica', 'Passeios de jangada', 'Jantares à beira-mar'],
        included: ['Hospedagem em pousada romântica', 'Café da manhã', 'Passeio de jangada', 'Jantar romântico'],
        notIncluded: ['Passagens aéreas', 'Almoço', 'Passeios opcionais', 'Seguro viagem'],
        category: 'romantic',
        difficulty: 'easy',
        groupSize: 'couple',
        bestTime: ['Janeiro', 'Fevereiro', 'Março', 'Julho', 'Agosto', 'Setembro'],
        rating: 4.9,
        reviewCount: 89,
        isPopular: true,
        isNew: false,
        isDiscounted: false,
        availability: {
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          maxTravelers: 20,
          currentBookings: 15
        },
        tags: ['Romance', 'Praia', 'Pousada', 'Jangada', 'Mar'],
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2025-01-16T00:00:00Z'
      },
      {
        id: '3',
        name: 'Aventura Fernando de Noronha',
        destination: 'Fernando de Noronha',
        country: 'Brasil',
        region: 'Pernambuco',
        description: 'Aventure-se em um dos destinos mais exóticos do Brasil. Mergulho com tartarugas, trilhas pela ilha, praias intocadas e experiência única de ecoturismo.',
        shortDescription: 'Aventura e natureza intocada',
        duration: '7 dias / 6 noites',
        price: 4500,
        images: ['/images/noronha-1.jpg', '/images/noronha-2.jpg'],
        highlights: ['Mergulho com tartarugas', 'Trilhas pela ilha', 'Praias intocadas', 'Ecoturismo'],
        included: ['Hospedagem em pousada ecológica', 'Café da manhã', 'Transfer aeroporto', 'Guia local'],
        notIncluded: ['Passagens aéreas', 'Refeições', 'Atividades opcionais', 'Seguro viagem'],
        category: 'adventure',
        difficulty: 'moderate',
        groupSize: 'small',
        bestTime: ['Janeiro', 'Fevereiro', 'Março', 'Julho', 'Agosto', 'Setembro'],
        rating: 4.7,
        reviewCount: 56,
        isPopular: false,
        isNew: true,
        isDiscounted: false,
        availability: {
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          maxTravelers: 15,
          currentBookings: 8
        },
        tags: ['Aventura', 'Mergulho', 'Trilhas', 'Natureza', 'Ecoturismo'],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-17T00:00:00Z'
      },
      {
        id: '4',
        name: 'Cultura e História Europa',
        destination: 'Paris, Roma, Barcelona',
        country: 'França, Itália, Espanha',
        region: 'Europa',
        description: 'Imersão completa na cultura e história europeia. Visite os principais museus, monumentos históricos e experimente a gastronomia local.',
        shortDescription: 'Cultura e história europeia',
        duration: '12 dias / 11 noites',
        price: 8500,
        images: ['/images/europa-1.jpg', '/images/europa-2.jpg'],
        highlights: ['Museus famosos', 'Monumentos históricos', 'Gastronomia local', 'Arquitetura clássica'],
        included: ['Hospedagem em hotéis 4 estrelas', 'Café da manhã', 'Guia local', 'Transporte entre cidades'],
        notIncluded: ['Passagens aéreas', 'Refeições', 'Ingressos para atrações', 'Seguro viagem'],
        category: 'cultural',
        difficulty: 'easy',
        groupSize: 'small',
        bestTime: ['Março', 'Abril', 'Maio', 'Setembro', 'Outubro', 'Novembro'],
        rating: 4.6,
        reviewCount: 34,
        isPopular: false,
        isNew: false,
        isDiscounted: false,
        availability: {
          startDate: '2025-03-01',
          endDate: '2025-11-30',
          maxTravelers: 25,
          currentBookings: 12
        },
        tags: ['Cultura', 'História', 'Museus', 'Arquitetura', 'Gastronomia'],
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: '2025-01-18T00:00:00Z'
      }
    ];

    setPackages(mockPackages);
    setFilteredPackages(mockPackages);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = packages.filter(pkg => {
      // Busca por texto
      const matchesSearch = 
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtros de categoria
      const matchesCategory = filters.category.length === 0 || filters.category.includes(pkg.category);
      
      // Filtros de preço
      const matchesPrice = pkg.price >= filters.priceRange[0] && pkg.price <= filters.priceRange[1];
      
      // Filtros de duração
      const matchesDuration = filters.duration.length === 0 || filters.duration.includes(pkg.duration);
      
      // Filtros de dificuldade
      const matchesDifficulty = filters.difficulty.length === 0 || filters.difficulty.includes(pkg.difficulty);
      
      // Filtros de grupo
      const matchesGroupSize = filters.groupSize.length === 0 || filters.groupSize.includes(pkg.groupSize);
      
      // Filtros de rating
      const matchesRating = pkg.rating >= filters.rating;
      
      // Filtros de destino
      const matchesDestination = filters.destination.length === 0 || filters.destination.includes(pkg.destination);
      
      // Filtros de melhor época
      const matchesBestTime = filters.bestTime.length === 0 || 
        pkg.bestTime.some(time => filters.bestTime.includes(time));
      
      return matchesSearch && matchesCategory && matchesPrice && matchesDuration && 
             matchesDifficulty && matchesGroupSize && matchesRating && matchesDestination && matchesBestTime;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof TravelPackage];
      let bValue: any = b[sortBy as keyof TravelPackage];

      if (sortBy === 'price' || sortBy === 'rating' || sortBy === 'reviewCount') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPackages(filtered);
  }, [packages, searchTerm, filters, sortBy, sortOrder]);

  const toggleFavorite = (packageId: string) => {
    setFavorites(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'beach': return <Beach className="w-5 h-5" />;
      case 'mountain': return <Mountain className="w-5 h-5" />;
      case 'city': return <Building className="w-5 h-5" />;
      case 'adventure': return <Zap className="w-5 h-5" />;
      case 'romantic': return <Heart className="w-5 h-5" />;
      case 'family': return <Users className="w-5 h-5" />;
      case 'cultural': return <Palette className="w-5 h-5" />;
      case 'nature': return <TreePine className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beach': return 'bg-blue-100 text-blue-800';
      case 'mountain': return 'bg-gray-100 text-gray-800';
      case 'city': return 'bg-purple-100 text-purple-800';
      case 'adventure': return 'bg-orange-100 text-orange-800';
      case 'romantic': return 'bg-pink-100 text-pink-800';
      case 'family': return 'bg-green-100 text-green-800';
      case 'cultural': return 'bg-yellow-100 text-yellow-800';
      case 'nature': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'beach': return 'Praia';
      case 'mountain': return 'Montanha';
      case 'city': return 'Cidade';
      case 'adventure': return 'Aventura';
      case 'romantic': return 'Romântico';
      case 'family': return 'Família';
      case 'cultural': return 'Cultural';
      case 'nature': return 'Natureza';
      default: return category;
    }
  };

  const handleViewPackage = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setShowPackageModal(true);
  };

  const handleBookPackage = (pkg: TravelPackage) => {
    router.push(`/reservations-rsv?package=${pkg.id}`);
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
                  <h1 className="text-2xl font-bold text-gray-900">Catálogo de Viagens</h1>
                  <p className="text-sm text-gray-500">Descubra os melhores destinos da Reservei Viagens</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FilterIcon className="w-5 h-5 mr-2" />
                  Filtros
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Barra de Busca e Controles */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar destinos, categorias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                    />
                  </div>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Nome</option>
                    <option value="price">Preço</option>
                    <option value="rating">Avaliação</option>
                    <option value="reviewCount">Número de Reviews</option>
                    <option value="createdAt">Data de Criação</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        viewMode === 'grid' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        viewMode === 'list' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {filteredPackages.length} de {packages.length} pacotes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros Avançados */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Categorias */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Categorias</h3>
                    <div className="space-y-2">
                      {['beach', 'mountain', 'city', 'adventure', 'romantic', 'family', 'cultural', 'nature'].map(category => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.category.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, category: [...prev.category, category] }));
                              } else {
                                setFilters(prev => ({ ...prev, category: prev.category.filter(c => c !== category) }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{getCategoryText(category)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Faixa de Preço */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Faixa de Preço</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">R$ {filters.priceRange[0]}</span>
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          step="100"
                          value={filters.priceRange[0]}
                          onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">R$ {filters.priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Dificuldade */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Dificuldade</h3>
                    <div className="space-y-2">
                      {['easy', 'moderate', 'challenging', 'expert'].map(difficulty => (
                        <label key={difficulty} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.difficulty.includes(difficulty)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, difficulty: [...prev.difficulty, difficulty] }));
                              } else {
                                setFilters(prev => ({ ...prev, difficulty: prev.difficulty.filter(d => d !== difficulty) }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {difficulty === 'easy' ? 'Fácil' : 
                             difficulty === 'moderate' ? 'Moderado' : 
                             difficulty === 'challenging' ? 'Desafiador' : 'Expert'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Avaliação Mínima</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={filters.rating}
                        onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">{filters.rating}+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Pacotes */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  {/* Imagem */}
                  <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      {pkg.isNew && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Novo</span>
                      )}
                      {pkg.isPopular && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                      )}
                      {pkg.isDiscounted && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{pkg.discount}%</span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(pkg.category)}`}>
                        {getCategoryIcon(pkg.category)}
                        <span className="ml-1">{getCategoryText(pkg.category)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                      <button
                        onClick={() => toggleFavorite(pkg.id)}
                        className={`p-1 rounded-full ${
                          favorites.includes(pkg.id) 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(pkg.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {pkg.destination}, {pkg.country}
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{pkg.shortDescription}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{pkg.rating}</span>
                        <span className="text-sm text-gray-500">({pkg.reviewCount})</span>
                      </div>
                      <div className="text-right">
                        {pkg.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">R$ {pkg.originalPrice.toLocaleString()}</div>
                        )}
                        <div className="text-lg font-bold text-gray-900">R$ {pkg.price.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {pkg.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {pkg.groupSize === 'individual' ? 'Individual' : 
                         pkg.groupSize === 'couple' ? 'Casal' : 
                         pkg.groupSize === 'small' ? 'Pequeno grupo' : 'Grande grupo'}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPackage(pkg)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => handleBookPackage(pkg)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Visualização em Lista */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pacote
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destino
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duração
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avaliação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              {getCategoryIcon(pkg.category)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                              <div className="text-sm text-gray-500">{pkg.shortDescription}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pkg.destination}</div>
                          <div className="text-sm text-gray-500">{pkg.country}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(pkg.category)}`}>
                            {getCategoryIcon(pkg.category)}
                            <span className="ml-1">{getCategoryText(pkg.category)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pkg.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">R$ {pkg.price.toLocaleString()}</div>
                          {pkg.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">R$ {pkg.originalPrice.toLocaleString()}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium text-gray-900">{pkg.rating}</span>
                          </div>
                          <div className="text-sm text-gray-500">({pkg.reviewCount} reviews)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewPackage(pkg)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver Detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleBookPackage(pkg)}
                              className="text-green-600 hover:text-green-900"
                              title="Reservar"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => toggleFavorite(pkg.id)}
                              className={`${
                                favorites.includes(pkg.id) 
                                  ? 'text-red-500 hover:text-red-600' 
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                              title="Favoritar"
                            >
                              <Heart className={`w-4 h-4 ${favorites.includes(pkg.id) ? 'fill-current' : ''}`} />
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
        </div>

        {/* Modal de Detalhes do Pacote */}
        {showPackageModal && selectedPackage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedPackage.name}</h3>
                  <button
                    onClick={() => {
                      setShowPackageModal(false);
                      setSelectedPackage(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="text-center py-8">
                  <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Detalhes do Pacote</h3>
                  <p className="text-gray-500">Detalhes completos serão implementados em breve</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

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
  MapPin,
  X,
  Save,
  BarChart3,
  TrendingUp,
  Activity,
  FileText
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
  provider: string;
  contact: string;
  terms: string;
  restrictions: string;
  includedServices: string[];
  notIncludedServices: string[];
  cancellationPolicy: string;
  refundPolicy: string;
  salesHistory: {
    date: string;
    quantity: number;
    revenue: number;
  }[];
}

interface TicketFormProps {
  onSubmit: (data: Partial<TicketData>) => void;
  onCancel: () => void;
  isEditing: boolean;
  initialData?: TicketData;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, onCancel, isEditing, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    type: initialData?.type || 'attraction' as const,
    price: initialData?.price || 0,
    quantity: initialData?.quantity || 0,
    available: initialData?.available || 0,
    status: initialData?.status || 'active' as const,
    validFrom: initialData?.validFrom || '',
    validUntil: initialData?.validUntil || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    provider: initialData?.provider || '',
    contact: initialData?.contact || '',
    terms: initialData?.terms || '',
    restrictions: initialData?.restrictions || '',
    includedServices: initialData?.includedServices.join(', ') || '',
    notIncludedServices: initialData?.notIncludedServices.join(', ') || '',
    cancellationPolicy: initialData?.cancellationPolicy || '',
    refundPolicy: initialData?.refundPolicy || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      includedServices: formData.includedServices.split(',').map(s => s.trim()).filter(s => s),
      notIncludedServices: formData.notIncludedServices.split(',').map(s => s.trim()).filter(s => s)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título *</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destino *</label>
          <input 
            type="text" 
            id="destination" 
            name="destination" 
            value={formData.destination}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo *</label>
          <select 
            id="type" 
            name="type" 
            value={formData.type}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="attraction">Atração</option>
            <option value="park">Parque</option>
            <option value="show">Show</option>
            <option value="transport">Transporte</option>
          </select>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço *</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade Total *</label>
          <input 
            type="number" 
            id="quantity" 
            name="quantity" 
            value={formData.quantity}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="available" className="block text-sm font-medium text-gray-700">Disponíveis *</label>
          <input 
            type="number" 
            id="available" 
            name="available" 
            value={formData.available}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
          <select 
            id="status" 
            name="status" 
            value={formData.status}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="active">Ativo</option>
            <option value="sold_out">Esgotado</option>
            <option value="expired">Expirado</option>
            <option value="upcoming">Próximo</option>
          </select>
        </div>
        <div>
          <label htmlFor="validFrom" className="block text-sm font-medium text-gray-700">Válido de *</label>
          <input 
            type="date" 
            id="validFrom" 
            name="validFrom" 
            value={formData.validFrom}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700">Válido até *</label>
          <input 
            type="date" 
            id="validUntil" 
            name="validUntil" 
            value={formData.validUntil}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria *</label>
          <input 
            type="text" 
            id="category" 
            name="category" 
            value={formData.category}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Fornecedor *</label>
          <input 
            type="text" 
            id="provider" 
            name="provider" 
            value={formData.provider}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contato *</label>
          <input 
            type="text" 
            id="contact" 
            name="contact" 
            value={formData.contact}
            onChange={handleChange}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição *</label>
        <textarea 
          id="description" 
          name="description" 
          rows={3} 
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="terms" className="block text-sm font-medium text-gray-700">Termos e Condições</label>
          <textarea 
            id="terms" 
            name="terms" 
            rows={3} 
            value={formData.terms}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="restrictions" className="block text-sm font-medium text-gray-700">Restrições</label>
          <textarea 
            id="restrictions" 
            name="restrictions" 
            rows={3} 
            value={formData.restrictions}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="includedServices" className="block text-sm font-medium text-gray-700">Serviços Incluídos (separados por vírgula)</label>
          <input 
            type="text" 
            id="includedServices" 
            name="includedServices" 
            value={formData.includedServices}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="notIncludedServices" className="block text-sm font-medium text-gray-700">Serviços Não Incluídos (separados por vírgula)</label>
          <input 
            type="text" 
            id="notIncludedServices" 
            name="notIncludedServices" 
            value={formData.notIncludedServices}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700">Política de Cancelamento</label>
          <textarea 
            id="cancellationPolicy" 
            name="cancellationPolicy" 
            rows={3} 
            value={formData.cancellationPolicy}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="refundPolicy" className="block text-sm font-medium text-gray-700">Política de Reembolso</label>
          <textarea 
            id="refundPolicy" 
            name="refundPolicy" 
            rows={3} 
            value={formData.refundPolicy}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? 'Salvar Alterações' : 'Criar Ingresso'}
        </button>
      </div>
    </form>
  );
};

export default function TicketsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [showStatsDetails, setShowStatsDetails] = useState(false);
  const [selectedStatsType, setSelectedStatsType] = useState<string>('');
  const [statsSearchTerm, setStatsSearchTerm] = useState('');
  const [statsFilter, setStatsFilter] = useState('all');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showEditTicketModal, setShowEditTicketModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketData | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [exportPeriod, setExportPeriod] = useState<'all' | 'active' | 'sold_out' | 'expired' | 'upcoming'>('all');
  const [exportGenerating, setExportGenerating] = useState(false);
  const [importProcessing, setImportProcessing] = useState(false);

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
      category: 'Parques Temáticos',
      provider: 'Disney World',
      contact: 'reservas@disneyworld.com',
      terms: 'Todos os ingressos são válidos para um dia de uso.',
      restrictions: 'Ingressos não podem ser resgatados antes da data de validade.',
      includedServices: ['Acesso ao parque', 'Guia turístico', 'Transporte para o parque'],
      notIncludedServices: ['Alimentação', 'Compras no parque'],
      cancellationPolicy: 'Ingressos não podem ser cancelados.',
      refundPolicy: 'Ingressos não podem ser reembolsados.',
      salesHistory: [
        { date: '2024-07-20', quantity: 10, revenue: 4500 },
        { date: '2024-07-21', quantity: 8, revenue: 3600 },
        { date: '2024-07-22', quantity: 12, revenue: 5400 },
      ]
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
      category: 'Atrações Turísticas',
      provider: 'Tour Paris',
      contact: 'info@tourparis.com',
      terms: 'Ingresso válido para um dia de uso.',
      restrictions: 'Ingressos devem ser resgatados até 2 horas antes do horário.',
      includedServices: ['Acesso à torre', 'Guia turístico', 'Transporte para a torre'],
      notIncludedServices: ['Alimentação', 'Compras no local'],
      cancellationPolicy: 'Ingressos não podem ser cancelados.',
      refundPolicy: 'Ingressos não podem ser reembolsados.',
      salesHistory: [
        { date: '2024-08-10', quantity: 5, revenue: 445 },
        { date: '2024-08-11', quantity: 4, revenue: 356 },
        { date: '2024-08-12', quantity: 6, revenue: 534 },
      ]
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
      category: 'Shows e Espetáculos',
      provider: 'Cirque du Soleil',
      contact: 'reservas@cirquedusoleil.com',
      terms: 'Ingresso válido para um dia de uso.',
      restrictions: 'Ingressos devem ser resgatados até 1 hora antes do horário.',
      includedServices: ['Acesso ao espetáculo', 'Guia turístico', 'Transporte para o local'],
      notIncludedServices: ['Alimentação', 'Compras no local'],
      cancellationPolicy: 'Ingressos não podem ser cancelados.',
      refundPolicy: 'Ingressos não podem ser reembolsados.',
      salesHistory: [
        { date: '2024-09-05', quantity: 10, revenue: 1800 },
        { date: '2024-09-06', quantity: 8, revenue: 1440 },
        { date: '2024-09-07', quantity: 12, revenue: 2160 },
      ]
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
      category: 'Transporte Público',
      provider: 'Metro de Nova York',
      contact: 'info@metrony.com',
      terms: 'Passe válido para 7 dias de uso.',
      restrictions: 'Passe deve ser resgatado no local.',
      includedServices: ['Acesso ao metrô', 'Transporte ilimitado', 'Guia turístico'],
      notIncludedServices: ['Alimentação', 'Compras no local'],
      cancellationPolicy: 'Passe não pode ser cancelado.',
      refundPolicy: 'Passe não pode ser reembolsado.',
      salesHistory: [
        { date: '2024-08-01', quantity: 50, revenue: 1650 },
        { date: '2024-08-02', quantity: 40, revenue: 1320 },
        { date: '2024-08-03', quantity: 55, revenue: 1815 },
      ]
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
      category: 'Parques Temáticos',
      provider: 'Universal Studios',
      contact: 'reservas@universalstudios.com',
      terms: 'Ingresso válido para um dia de uso.',
      restrictions: 'Ingressos devem ser resgatados até 30 minutos antes do horário.',
      includedServices: ['Acesso expresso às atrações', 'Guia turístico', 'Transporte para o parque'],
      notIncludedServices: ['Alimentação', 'Compras no parque'],
      cancellationPolicy: 'Ingressos não podem ser cancelados.',
      refundPolicy: 'Ingressos não podem ser reembolsados.',
      salesHistory: [
        { date: '2024-08-01', quantity: 10, revenue: 1800 },
        { date: '2024-08-02', quantity: 8, revenue: 1440 },
        { date: '2024-08-03', quantity: 12, revenue: 2160 },
      ]
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
    setShowNewTicketModal(true);
  };

  const handleEditTicket = (ticket: TicketData) => {
    setEditingTicket(ticket);
    setShowEditTicketModal(true);
  };

  const handleDeleteTicket = (ticketId: number) => {
    if (confirm('Tem certeza que deseja excluir este ingresso?')) {
      console.log('Ingresso excluído:', ticketId);
      // Aqui seria feita a chamada para a API para excluir o ingresso
      alert('Ingresso excluído com sucesso!');
    }
  };

  const handleTicketClick = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const handleStatsClick = (statsType: string) => {
    setSelectedStatsType(statsType);
    setShowStatsDetails(true);
  };

  const handleImportTickets = () => {
    setShowImportModal(true);
  };

  const handleExportTickets = () => {
    setShowExportModal(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      alert('Por favor, selecione um arquivo para importar.');
      return;
    }

    setImportProcessing(true);
    
    // Simular processamento de importação
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Arquivo importado:', importFile.name);
    alert(`Arquivo "${importFile.name}" importado com sucesso! 15 ingressos adicionados.`);
    
    setImportProcessing(false);
    setShowImportModal(false);
    setImportFile(null);
  };

  const handleExportSubmit = async () => {
    setExportGenerating(true);
    
    // Simular geração de relatório
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const periodText = {
      all: 'Todos',
      active: 'Ativos',
      sold_out: 'Esgotados',
      expired: 'Expirados',
      upcoming: 'Próximos'
    }[exportPeriod];
    
    const fileName = `relatorio_ingressos_${periodText.toLowerCase()}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    
    // Simular download do arquivo
    const link = document.createElement('a');
    link.href = `data:text/${exportFormat};charset=utf-8,${encodeURIComponent('Dados dos ingressos')}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Relatório exportado:', fileName);
    alert(`Relatório exportado com sucesso: ${fileName}`);
    
    setExportGenerating(false);
    setShowExportModal(false);
  };

  const handleSaveTicket = (ticketData: Partial<TicketData>) => {
    if (editingTicket) {
      // Editar ingresso existente
      console.log('Editando ingresso:', { ...editingTicket, ...ticketData });
      alert('Ingresso editado com sucesso!');
      setShowEditTicketModal(false);
      setEditingTicket(null);
    } else {
      // Criar novo ingresso
      const newTicket: TicketData = {
        id: Math.max(...mockTickets.map(t => t.id)) + 1,
        title: ticketData.title || '',
        destination: ticketData.destination || '',
        type: ticketData.type || 'attraction',
        price: ticketData.price || 0,
        quantity: ticketData.quantity || 0,
        available: ticketData.available || ticketData.quantity || 0,
        status: ticketData.status || 'active',
        validFrom: ticketData.validFrom || '',
        validUntil: ticketData.validUntil || '',
        description: ticketData.description || '',
        category: ticketData.category || '',
        provider: ticketData.provider || '',
        contact: ticketData.contact || '',
        terms: ticketData.terms || '',
        restrictions: ticketData.restrictions || '',
        includedServices: ticketData.includedServices || [],
        notIncludedServices: ticketData.notIncludedServices || [],
        cancellationPolicy: ticketData.cancellationPolicy || '',
        refundPolicy: ticketData.refundPolicy || '',
        salesHistory: []
      };
      
      console.log('Novo ingresso criado:', newTicket);
      alert('Ingresso criado com sucesso!');
      setShowNewTicketModal(false);
    }
  };

  const getStatsTitle = (statsType: string) => {
    switch (statsType) {
      case 'revenue': return 'Receita Total';
      case 'total': return 'Total de Ingressos';
      case 'sold': return 'Vendidos';
      case 'active': return 'Ativos';
      default: return 'Estatísticas';
    }
  };

  const getStatsIcon = (statsType: string) => {
    switch (statsType) {
      case 'revenue': return <DollarSign className="h-6 w-6 text-green-600" />;
      case 'total': return <Ticket className="h-6 w-6 text-blue-600" />;
      case 'sold': return <CheckCircle className="h-6 w-6 text-purple-600" />;
      case 'active': return <Clock className="h-6 w-6 text-orange-600" />;
      default: return <BarChart3 className="h-6 w-6 text-gray-600" />;
    }
  };

  const getFilteredStatsData = () => {
    let filteredTickets = mockTickets;

    if (statsSearchTerm) {
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(statsSearchTerm.toLowerCase()) ||
        ticket.destination.toLowerCase().includes(statsSearchTerm.toLowerCase()) ||
        ticket.category.toLowerCase().includes(statsSearchTerm.toLowerCase()) ||
        ticket.provider.toLowerCase().includes(statsSearchTerm.toLowerCase())
      );
    }

    if (statsFilter !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === statsFilter);
    }

    return filteredTickets;
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
            <div 
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleStatsClick('revenue')}
            >
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

            <div 
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleStatsClick('total')}
            >
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

            <div 
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleStatsClick('sold')}
            >
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

            <div 
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleStatsClick('active')}
            >
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
              <div 
                key={ticket.id} 
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
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
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTicketClick(ticket);
                        }}
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        Ver
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTicket(ticket);
                        }}
                      >
                        <Edit className="h-4 w-4 inline mr-1" />
                        Editar
                      </button>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTicket(ticket.id);
                      }}
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

        {/* Ticket Details Modal */}
        {showTicketDetails && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Ticket className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedTicket.title}</h3>
                      <p className="text-sm text-gray-600">{selectedTicket.destination}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTicketDetails(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Informações Básicas</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Preço</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(selectedTicket.price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Disponíveis</p>
                        <p className="font-semibold text-gray-900">{selectedTicket.available}/{selectedTicket.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Categoria</p>
                        <p className="font-semibold text-gray-900">{selectedTicket.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tipo</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedTicket.type)}`}>
                          {selectedTicket.type === 'park' ? 'Parque' :
                           selectedTicket.type === 'attraction' ? 'Atração' :
                           selectedTicket.type === 'show' ? 'Show' : 'Transporte'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Descrição</p>
                      <p className="text-gray-900">{selectedTicket.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Válido de</p>
                        <p className="font-semibold text-gray-900">{formatDate(selectedTicket.validFrom)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Válido até</p>
                        <p className="font-semibold text-gray-900">{formatDate(selectedTicket.validUntil)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Fornecedor */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Informações do Fornecedor</h4>
                    
                    <div>
                      <p className="text-sm text-gray-600">Fornecedor</p>
                      <p className="font-semibold text-gray-900">{selectedTicket.provider}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Contato</p>
                      <p className="font-semibold text-gray-900">{selectedTicket.contact}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Termos e Condições</p>
                      <p className="text-gray-900">{selectedTicket.terms}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Restrições</p>
                      <p className="text-gray-900">{selectedTicket.restrictions}</p>
                    </div>
                  </div>
                </div>

                {/* Serviços Incluídos e Não Incluídos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Serviços Incluídos</h4>
                    <ul className="space-y-2">
                      {selectedTicket.includedServices.map((service, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Serviços Não Incluídos</h4>
                    <ul className="space-y-2">
                      {selectedTicket.notIncludedServices.map((service, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Políticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Política de Cancelamento</h4>
                    <p className="text-sm text-gray-700">{selectedTicket.cancellationPolicy}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Política de Reembolso</h4>
                    <p className="text-sm text-gray-700">{selectedTicket.refundPolicy}</p>
                  </div>
                </div>

                {/* Histórico de Vendas */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Histórico de Vendas</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedTicket.salesHistory.map((sale, index) => (
                        <div key={index} className="bg-white rounded-lg p-3">
                          <p className="text-sm text-gray-600">{formatDate(sale.date)}</p>
                          <p className="font-semibold text-gray-900">{sale.quantity} vendidos</p>
                          <p className="text-sm text-green-600">{formatCurrency(sale.revenue)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setShowTicketDetails(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Fechar
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Ingresso
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Details Modal */}
        {showStatsDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getStatsIcon(selectedStatsType)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{getStatsTitle(selectedStatsType)}</h3>
                      <p className="text-sm text-gray-600">Detalhamento dos ingressos</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStatsDetails(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por título, destino, categoria ou fornecedor..."
                        value={statsSearchTerm}
                        onChange={(e) => setStatsSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <select
                    value={statsFilter}
                    onChange={(e) => setStatsFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="sold_out">Esgotados</option>
                    <option value="expired">Expirados</option>
                    <option value="upcoming">Próximos</option>
                  </select>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total de Ingressos</p>
                    <p className="text-lg font-semibold">{getFilteredStatsData().length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Receita Total</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(getFilteredStatsData().reduce((sum, ticket) => 
                        sum + (ticket.price * (ticket.quantity - ticket.available)), 0
                      ))}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Vendidos</p>
                    <p className="text-lg font-semibold">
                      {getFilteredStatsData().reduce((sum, ticket) => 
                        sum + (ticket.quantity - ticket.available), 0
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Disponíveis</p>
                    <p className="text-lg font-semibold">
                      {getFilteredStatsData().reduce((sum, ticket) => 
                        sum + ticket.available, 0
                      )}
                    </p>
                  </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Ingressos</h4>
                  {getFilteredStatsData().map(ticket => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{ticket.title}</h5>
                          <p className="text-sm text-gray-600">{ticket.destination}</p>
                          <div className="flex items-center space-x-2 mt-1">
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
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(ticket.price)}</p>
                          <p className="text-sm text-gray-600">{ticket.available}/{ticket.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setShowStatsDetails(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Fechar
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Relatório
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Ticket Modal */}
        {showNewTicketModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Plus className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Novo Ingresso</h3>
                      <p className="text-sm text-gray-600">Criar novo ingresso</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNewTicketModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <TicketForm 
                  onSubmit={handleSaveTicket}
                  onCancel={() => setShowNewTicketModal(false)}
                  isEditing={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Ticket Modal */}
        {showEditTicketModal && editingTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Edit className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Editar Ingresso</h3>
                      <p className="text-sm text-gray-600">{editingTicket.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditTicketModal(false);
                      setEditingTicket(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <TicketForm 
                  onSubmit={handleSaveTicket}
                  onCancel={() => {
                    setShowEditTicketModal(false);
                    setEditingTicket(null);
                  }}
                  isEditing={true}
                  initialData={editingTicket}
                />
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">Importar Ingressos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Selecione um arquivo CSV, Excel ou PDF para importar dados de ingressos.
                  O arquivo deve conter colunas como "Título", "Destino", "Preço", "Quantidade", "Disponíveis", "Status", etc.
                </p>
                <input type="file" accept=".csv, .xlsx, .xls, .pdf" onChange={handleFileUpload} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {importFile && (
                  <p className="mt-2 text-sm text-gray-600">Arquivo selecionado: {importFile.name}</p>
                )}
                {importProcessing && (
                  <p className="mt-2 text-sm text-gray-600">Processando arquivo...</p>
                )}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleImportSubmit}
                    disabled={!importFile || importProcessing}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {importProcessing ? 'Importando...' : 'Importar Arquivo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">Exportar Ingressos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Escolha o formato e o período para exportar os dados dos ingressos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700">Formato</label>
                    <select
                      id="exportFormat"
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf' | 'excel')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="csv">CSV</option>
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel (XLSX)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="exportPeriod" className="block text-sm font-medium text-gray-700">Período</label>
                    <select
                      id="exportPeriod"
                      value={exportPeriod}
                      onChange={(e) => setExportPeriod(e.target.value as 'all' | 'active' | 'sold_out' | 'expired' | 'upcoming')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="all">Todos os Ingressos</option>
                      <option value="active">Ingressos Ativos</option>
                      <option value="sold_out">Ingressos Esgotados</option>
                      <option value="expired">Ingressos Expirados</option>
                      <option value="upcoming">Ingressos Próximos</option>
                    </select>
                  </div>
                </div>
                {exportGenerating && (
                  <p className="mt-2 text-sm text-gray-600">Gerando relatório...</p>
                )}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleExportSubmit}
                    disabled={exportGenerating}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {exportGenerating ? 'Exportando...' : 'Exportar Relatório'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 
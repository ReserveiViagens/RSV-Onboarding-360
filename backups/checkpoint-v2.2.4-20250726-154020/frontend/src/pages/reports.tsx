import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';
import {
  BarChart3,
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Plane,
  FileText,
  PieChart,
  Activity,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Search,
  Filter
} from 'lucide-react';

interface ReportMetrics {
  period: string;
  totalRevenue: number;
  totalBookings: number;
  averagePrice: number;
  topDestination: string;
  growthRate: number;
}

interface CheckpointData {
  id: string;
  name: string;
  date: string;
  status: 'success' | 'error' | 'pending';
  size: string;
  description: string;
}

interface MetricDetail {
  period: string;
  value: number;
  growth: number;
  breakdown: {
    category: string;
    value: number;
    percentage: number;
  }[];
}

interface MetricDetails {
  revenue: MetricDetail[];
  bookings: MetricDetail[];
  averagePrice: MetricDetail[];
  destinations: {
    name: string;
    bookings: number;
    revenue: number;
    percentage: number;
  }[];
}

interface ChartData {
  month: string;
  revenue: number;
  bookings: number;
  growth: number;
}

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'performance' | 'customer';
  data: {
    period: string;
    revenue: number;
    costs: number;
    profit: number;
    bookings: number;
    conversion: number;
    customers: number;
    satisfaction: number;
  };
  details: {
    category: string;
    value: number;
    percentage: number;
  }[];
}

interface ChartDetails {
  revenueChart: ChartData[];
  destinationsChart: {
    name: string;
    bookings: number;
    revenue: number;
    percentage: number;
  }[];
  reports: ReportData[];
}

interface ActivityItem {
  id: string;
  type: 'booking' | 'payment' | 'cancellation';
  title: string;
  destination: string;
  amount: number;
  timeAgo: string;
  status: 'success' | 'pending' | 'cancelled';
  hotel: string;
  guest: string;
  broker: string;
  consultant: string;
  bookingCode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  paymentMethod: string;
  cardHolder: string;
  cardLastDigits: string;
  reservationHolder: string;
}

interface ActivityDetails {
  daily: ActivityItem[];
  weekly: ActivityItem[];
  monthly: ActivityItem[];
  yearly: ActivityItem[];
}

export default function ReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showCheckpointModal, setShowCheckpointModal] = useState(false);
  const [checkpointName, setCheckpointName] = useState('');
  const [isCreatingCheckpoint, setIsCreatingCheckpoint] = useState(false);
  const [checkpoints, setCheckpoints] = useState<CheckpointData[]>([]);
  const [showMetricDetails, setShowMetricDetails] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [metricDetails, setMetricDetails] = useState<MetricDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showChartDetails, setShowChartDetails] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string>('');
  const [chartDetails, setChartDetails] = useState<ChartDetails | null>(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [selectedChartItem, setSelectedChartItem] = useState<string>('');
  const [highlightedChartItem, setHighlightedChartItem] = useState<string>('');
  const [showActivityDetails, setShowActivityDetails] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [activityDetails, setActivityDetails] = useState<ActivityDetails | null>(null);
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [pdfPeriod, setPdfPeriod] = useState<string>('daily');
  const [pdfCategory, setPdfCategory] = useState<string>('all');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfStartDate, setPdfStartDate] = useState<string>('');
  const [pdfEndDate, setPdfEndDate] = useState<string>('');
  const [pdfSearchTerm, setPdfSearchTerm] = useState<string>('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [exportGenerating, setExportGenerating] = useState(false);
  const [exportType, setExportType] = useState<string>('');
  const [exportPeriod, setExportPeriod] = useState<string>('all');
  const [exportCategory, setExportCategory] = useState<string>('all');

  // Dados mockados de relatórios por período
  const getReportData = (period: string): ReportMetrics => {
    const dataMap: { [key: string]: ReportMetrics } = {
      daily: {
        period: 'Hoje',
        totalRevenue: 8500,
        totalBookings: 3,
        averagePrice: 2833.33,
        topDestination: 'São Paulo, Brasil',
        growthRate: 15.2
      },
      week: {
        period: 'Última Semana',
        totalRevenue: 45000,
        totalBookings: 12,
        averagePrice: 3750.00,
        topDestination: 'Rio de Janeiro, Brasil',
        growthRate: 8.5
      },
      month: {
        period: 'Último Mês',
        totalRevenue: 125000,
        totalBookings: 45,
        averagePrice: 2777.78,
        topDestination: 'Paris, França',
        growthRate: 12.5
      },
      quarter: {
        period: 'Último Trimestre',
        totalRevenue: 380000,
        totalBookings: 120,
        averagePrice: 3166.67,
        topDestination: 'Orlando, EUA',
        growthRate: 18.3
      },
      year: {
        period: 'Último Ano',
        totalRevenue: 1250000,
        totalBookings: 450,
        averagePrice: 2777.78,
        topDestination: 'Paris, França',
        growthRate: 22.1
      }
    };
    return dataMap[period] || dataMap.month;
  };

  const mockReportData = getReportData(selectedPeriod);

  // Dados mockados de checkpoints
  useEffect(() => {
    setCheckpoints([
      {
        id: '1',
        name: 'Checkpoint V2.2.4 Final',
        date: '25/07/2025 14:00',
        status: 'success',
        size: '2.5 MB',
        description: 'Ponto de restauração completo com todas as funcionalidades'
      },
      {
        id: '2',
        name: 'Backup Semanal',
        date: '24/07/2025 10:30',
        status: 'success',
        size: '1.8 MB',
        description: 'Backup automático semanal do sistema'
      },
      {
        id: '3',
        name: 'Checkpoint V2.2.3',
        date: '23/07/2025 16:45',
        status: 'success',
        size: '2.1 MB',
        description: 'Versão anterior estável do sistema'
      }
    ]);

    // Dados mockados para detalhes das métricas
    setMetricDetails({
      revenue: [
        {
          period: 'Diário',
          value: 8500,
          growth: 15.2,
          breakdown: [
            { category: 'Viagens Nacionais', value: 5100, percentage: 60 },
            { category: 'Viagens Internacionais', value: 3400, percentage: 40 }
          ]
        },
        {
          period: 'Semanal',
          value: 45000,
          growth: 8.5,
          breakdown: [
            { category: 'Viagens Nacionais', value: 27000, percentage: 60 },
            { category: 'Viagens Internacionais', value: 18000, percentage: 40 }
          ]
        },
        {
          period: 'Mensal',
          value: 125000,
          growth: 12.5,
          breakdown: [
            { category: 'Viagens Nacionais', value: 75000, percentage: 60 },
            { category: 'Viagens Internacionais', value: 50000, percentage: 40 }
          ]
        },
        {
          period: 'Anual',
          value: 1250000,
          growth: 22.1,
          breakdown: [
            { category: 'Viagens Nacionais', value: 750000, percentage: 60 },
            { category: 'Viagens Internacionais', value: 500000, percentage: 40 }
          ]
        }
      ],
      bookings: [
        {
          period: 'Diário',
          value: 3,
          growth: 15.2,
          breakdown: [
            { category: 'Viagens Nacionais', value: 2, percentage: 67 },
            { category: 'Viagens Internacionais', value: 1, percentage: 33 }
          ]
        },
        {
          period: 'Semanal',
          value: 12,
          growth: 8.5,
          breakdown: [
            { category: 'Viagens Nacionais', value: 8, percentage: 67 },
            { category: 'Viagens Internacionais', value: 4, percentage: 33 }
          ]
        },
        {
          period: 'Mensal',
          value: 45,
          growth: 12.5,
          breakdown: [
            { category: 'Viagens Nacionais', value: 30, percentage: 67 },
            { category: 'Viagens Internacionais', value: 15, percentage: 33 }
          ]
        },
        {
          period: 'Anual',
          value: 450,
          growth: 22.1,
          breakdown: [
            { category: 'Viagens Nacionais', value: 300, percentage: 67 },
            { category: 'Viagens Internacionais', value: 150, percentage: 33 }
          ]
        }
      ],
      averagePrice: [
        {
          period: 'Diário',
          value: 2833.33,
          growth: 15.2,
          breakdown: [
            { category: 'Viagens Nacionais', value: 2550, percentage: 90 },
            { category: 'Viagens Internacionais', value: 3400, percentage: 120 }
          ]
        },
        {
          period: 'Semanal',
          value: 3750.00,
          growth: 8.5,
          breakdown: [
            { category: 'Viagens Nacionais', value: 3375, percentage: 90 },
            { category: 'Viagens Internacionais', value: 4500, percentage: 120 }
          ]
        },
        {
          period: 'Mensal',
          value: 2777.78,
          growth: 12.5,
          breakdown: [
            { category: 'Viagens Nacionais', value: 2500, percentage: 90 },
            { category: 'Viagens Internacionais', value: 3333, percentage: 120 }
          ]
        },
        {
          period: 'Anual',
          value: 2777.78,
          growth: 22.1,
          breakdown: [
            { category: 'Viagens Nacionais', value: 2500, percentage: 90 },
            { category: 'Viagens Internacionais', value: 3333, percentage: 120 }
          ]
        }
      ],
      destinations: [
        { name: 'Paris, França', bookings: 15, revenue: 67500, percentage: 18 },
        { name: 'São Paulo, Brasil', bookings: 12, revenue: 36000, percentage: 15 },
        { name: 'Rio de Janeiro, Brasil', bookings: 10, revenue: 30000, percentage: 12 },
        { name: 'Orlando, EUA', bookings: 8, revenue: 68000, percentage: 10 },
        { name: 'Nova York, EUA', bookings: 6, revenue: 48000, percentage: 8 },
        { name: 'Londres, Reino Unido', bookings: 5, revenue: 45000, percentage: 7 },
        { name: 'Barcelona, Espanha', bookings: 4, revenue: 32000, percentage: 6 },
        { name: 'Tóquio, Japão', bookings: 3, revenue: 36000, percentage: 5 }
      ]
    });

    // Dados mockados para gráficos e relatórios
    setChartDetails({
      revenueChart: [
        { month: 'Jan', revenue: 85000, bookings: 25, growth: 12.5 },
        { month: 'Fev', revenue: 92000, bookings: 28, growth: 8.2 },
        { month: 'Mar', revenue: 105000, bookings: 32, growth: 14.1 },
        { month: 'Abr', revenue: 98000, bookings: 30, growth: -6.7 },
        { month: 'Mai', revenue: 115000, bookings: 35, growth: 17.3 },
        { month: 'Jun', revenue: 125000, bookings: 38, growth: 8.7 },
        { month: 'Jul', revenue: 135000, bookings: 42, growth: 8.0 },
        { month: 'Ago', revenue: 145000, bookings: 45, growth: 7.4 },
        { month: 'Set', revenue: 155000, bookings: 48, growth: 6.9 },
        { month: 'Out', revenue: 165000, bookings: 52, growth: 6.5 },
        { month: 'Nov', revenue: 175000, bookings: 55, growth: 6.1 },
        { month: 'Dez', revenue: 185000, bookings: 58, growth: 5.7 }
      ],
      destinationsChart: [
        { name: 'Paris, França', bookings: 15, revenue: 67500, percentage: 18 },
        { name: 'São Paulo, Brasil', bookings: 12, revenue: 36000, percentage: 15 },
        { name: 'Rio de Janeiro, Brasil', bookings: 10, revenue: 30000, percentage: 12 },
        { name: 'Orlando, EUA', bookings: 8, revenue: 68000, percentage: 10 },
        { name: 'Nova York, EUA', bookings: 6, revenue: 48000, percentage: 8 },
        { name: 'Londres, Reino Unido', bookings: 5, revenue: 45000, percentage: 7 },
        { name: 'Barcelona, Espanha', bookings: 4, revenue: 32000, percentage: 6 },
        { name: 'Tóquio, Japão', bookings: 3, revenue: 36000, percentage: 5 },
        { name: 'Miami, EUA', bookings: 3, revenue: 42000, percentage: 4 },
        { name: 'Roma, Itália', bookings: 2, revenue: 28000, percentage: 3 },
        { name: 'Amsterdã, Holanda', bookings: 2, revenue: 26000, percentage: 3 },
        { name: 'Outros', bookings: 9, revenue: 54000, percentage: 9 }
      ],
      reports: [
        {
          id: 'financial',
          title: 'Relatório Financeiro',
          description: 'Análise completa de receitas, custos e lucros',
          type: 'financial',
          data: {
            period: 'Último Mês',
            revenue: 125000,
            costs: 75000,
            profit: 50000,
            bookings: 45,
            conversion: 15.2,
            customers: 38,
            satisfaction: 4.8
          },
          details: [
            { category: 'Receita Bruta', value: 125000, percentage: 100 },
            { category: 'Custos Operacionais', value: 45000, percentage: 36 },
            { category: 'Custos de Marketing', value: 20000, percentage: 16 },
            { category: 'Custos Administrativos', value: 10000, percentage: 8 },
            { category: 'Lucro Líquido', value: 50000, percentage: 40 }
          ]
        },
        {
          id: 'performance',
          title: 'Relatório de Performance',
          description: 'Métricas de vendas e conversão',
          type: 'performance',
          data: {
            period: 'Último Mês',
            revenue: 125000,
            costs: 75000,
            profit: 50000,
            bookings: 45,
            conversion: 15.2,
            customers: 38,
            satisfaction: 4.8
          },
          details: [
            { category: 'Taxa de Conversão', value: 15.2, percentage: 15.2 },
            { category: 'Ticket Médio', value: 2777.78, percentage: 100 },
            { category: 'Tempo de Conversão', value: 3.2, percentage: 100 },
            { category: 'Taxa de Abandono', value: 8.5, percentage: 8.5 },
            { category: 'Satisfação do Cliente', value: 4.8, percentage: 96 }
          ]
        },
        {
          id: 'customer',
          title: 'Relatório de Clientes',
          description: 'Análise de comportamento e preferências',
          type: 'customer',
          data: {
            period: 'Último Mês',
            revenue: 125000,
            costs: 75000,
            profit: 50000,
            bookings: 45,
            conversion: 15.2,
            customers: 38,
            satisfaction: 4.8
          },
          details: [
            { category: 'Clientes Novos', value: 25, percentage: 66 },
            { category: 'Clientes Recorrentes', value: 13, percentage: 34 },
            { category: 'Satisfação Geral', value: 4.8, percentage: 96 },
            { category: 'Tempo de Resposta', value: 2.1, percentage: 100 },
            { category: 'Taxa de Retenção', value: 78.5, percentage: 78.5 }
          ]
        }
      ]
    });

    // Dados mockados para atividade recente
    setActivityDetails({
      daily: [
        {
          id: '1',
          type: 'booking',
          title: 'Nova reserva confirmada',
          destination: 'Paris, França',
          amount: 4500,
          timeAgo: '2 min atrás',
          status: 'success',
          hotel: 'Hotel Paris',
          guest: 'John Doe',
          broker: 'Broker Paris',
          consultant: 'Consultor Paris',
          bookingCode: 'PAR12345',
          checkIn: '2025-07-25',
          checkOut: '2025-07-27',
          guests: 2,
          roomType: 'Single',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'John Doe',
          cardLastDigits: '1234',
          reservationHolder: 'John Doe'
        },
        {
          id: '2',
          type: 'payment',
          title: 'Pagamento processado',
          destination: 'Orlando, EUA',
          amount: 8500,
          timeAgo: '15 min atrás',
          status: 'success',
          hotel: 'Hotel Orlando',
          guest: 'Jane Smith',
          broker: 'Broker Orlando',
          consultant: 'Consultor Orlando',
          bookingCode: 'ORL45678',
          checkIn: '2025-07-24',
          checkOut: '2025-07-26',
          guests: 3,
          roomType: 'Double',
          paymentMethod: 'PIX',
          cardHolder: 'Jane Smith',
          cardLastDigits: '5678',
          reservationHolder: 'Jane Smith'
        },
        {
          id: '3',
          type: 'cancellation',
          title: 'Agendamento cancelado',
          destination: 'São Paulo, Brasil',
          amount: 1200,
          timeAgo: '1 hora atrás',
          status: 'cancelled',
          hotel: 'Hotel São Paulo',
          guest: 'Carlos Oliveira',
          broker: 'Broker São Paulo',
          consultant: 'Consultor São Paulo',
          bookingCode: 'SPO78901',
          checkIn: '2025-07-23',
          checkOut: '2025-07-25',
          guests: 1,
          roomType: 'Single',
          paymentMethod: 'Boleto Bancário',
          cardHolder: 'Carlos Oliveira',
          cardLastDigits: '9012',
          reservationHolder: 'Carlos Oliveira'
        },
        {
          id: '4',
          type: 'booking',
          title: 'Reserva confirmada',
          destination: 'Rio de Janeiro, Brasil',
          amount: 3200,
          timeAgo: '2 horas atrás',
          status: 'success',
          hotel: 'Hotel Rio de Janeiro',
          guest: 'Ana Maria',
          broker: 'Broker Rio de Janeiro',
          consultant: 'Consultor Rio de Janeiro',
          bookingCode: 'RIO10112',
          checkIn: '2025-07-22',
          checkOut: '2025-07-24',
          guests: 2,
          roomType: 'Double',
          paymentMethod: 'Cartão de Débito',
          cardHolder: 'Ana Maria',
          cardLastDigits: '1123',
          reservationHolder: 'Ana Maria'
        },
        {
          id: '5',
          type: 'payment',
          title: 'Pagamento aprovado',
          destination: 'Nova York, EUA',
          amount: 6800,
          timeAgo: '3 horas atrás',
          status: 'success',
          hotel: 'Hotel New York',
          guest: 'Michael Johnson',
          broker: 'Broker New York',
          consultant: 'Consultor New York',
          bookingCode: 'NYC131415',
          checkIn: '2025-07-21',
          checkOut: '2025-07-23',
          guests: 1,
          roomType: 'Single',
          paymentMethod: 'Transferência Bancária',
          cardHolder: 'Michael Johnson',
          cardLastDigits: '3415',
          reservationHolder: 'Michael Johnson'
        }
      ],
      weekly: [
        {
          id: '6',
          type: 'booking',
          title: 'Reserva de grupo confirmada',
          destination: 'Londres, Reino Unido',
          amount: 12500,
          timeAgo: '1 dia atrás',
          status: 'success',
          hotel: 'Hotel Londres',
          guest: 'Group London',
          broker: 'Broker Londres',
          consultant: 'Consultor Londres',
          bookingCode: 'LON161718',
          checkIn: '2025-07-19',
          checkOut: '2025-07-21',
          guests: 4,
          roomType: 'Suite',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Group London',
          cardLastDigits: '6718',
          reservationHolder: 'Group London'
        },
        {
          id: '7',
          type: 'payment',
          title: 'Pagamento processado',
          destination: 'Barcelona, Espanha',
          amount: 4200,
          timeAgo: '2 dias atrás',
          status: 'success',
          hotel: 'Hotel Barcelona',
          guest: 'Team Barcelona',
          broker: 'Broker Barcelona',
          consultant: 'Consultor Barcelona',
          bookingCode: 'BAR202122',
          checkIn: '2025-07-18',
          checkOut: '2025-07-20',
          guests: 3,
          roomType: 'Double',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Team Barcelona',
          cardLastDigits: '2234',
          reservationHolder: 'Team Barcelona'
        },
        {
          id: '8',
          type: 'cancellation',
          title: 'Reserva cancelada',
          destination: 'Tóquio, Japão',
          amount: 8900,
          timeAgo: '3 dias atrás',
          status: 'cancelled',
          hotel: 'Hotel Tóquio',
          guest: 'Tokyo Group',
          broker: 'Broker Tóquio',
          consultant: 'Consultor Tóquio',
          bookingCode: 'TOK232425',
          checkIn: '2025-07-17',
          checkOut: '2025-07-19',
          guests: 5,
          roomType: 'Suite',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Tokyo Group',
          cardLastDigits: '2545',
          reservationHolder: 'Tokyo Group'
        },
        {
          id: '9',
          type: 'booking',
          title: 'Reserva corporativa',
          destination: 'Miami, EUA',
          amount: 5600,
          timeAgo: '4 dias atrás',
          status: 'success',
          hotel: 'Hotel Miami',
          guest: 'Corporate Miami',
          broker: 'Broker Miami',
          consultant: 'Consultor Miami',
          bookingCode: 'MIA262728',
          checkIn: '2025-07-16',
          checkOut: '2025-07-18',
          guests: 2,
          roomType: 'Double',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Corporate Miami',
          cardLastDigits: '2728',
          reservationHolder: 'Corporate Miami'
        },
        {
          id: '10',
          type: 'payment',
          title: 'Pagamento antecipado',
          destination: 'Roma, Itália',
          amount: 3800,
          timeAgo: '5 dias atrás',
          status: 'success',
          hotel: 'Hotel Roma',
          guest: 'Rome Group',
          broker: 'Broker Roma',
          consultant: 'Consultor Roma',
          bookingCode: 'ROM293031',
          checkIn: '2025-07-15',
          checkOut: '2025-07-17',
          guests: 1,
          roomType: 'Single',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Rome Group',
          cardLastDigits: '3145',
          reservationHolder: 'Rome Group'
        }
      ],
      monthly: [
        {
          id: '11',
          type: 'booking',
          title: 'Pacote de férias confirmado',
          destination: 'Amsterdã, Holanda',
          amount: 7800,
          timeAgo: '1 semana atrás',
          status: 'success',
          hotel: 'Hotel Amsterdã',
          guest: 'Amsterdam Group',
          broker: 'Broker Amsterdã',
          consultant: 'Consultor Amsterdã',
          bookingCode: 'AMS323334',
          checkIn: '2025-07-12',
          checkOut: '2025-07-14',
          guests: 3,
          roomType: 'Double',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Amsterdam Group',
          cardLastDigits: '3334',
          reservationHolder: 'Amsterdam Group'
        },
        {
          id: '12',
          type: 'payment',
          title: 'Pagamento parcelado',
          destination: 'Vancouver, Canadá',
          amount: 9200,
          timeAgo: '2 semanas atrás',
          status: 'success',
          hotel: 'Hotel Vancouver',
          guest: 'Vancouver Group',
          broker: 'Broker Vancouver',
          consultant: 'Consultor Vancouver',
          bookingCode: 'VAN353637',
          checkIn: '2025-07-10',
          checkOut: '2025-07-12',
          guests: 2,
          roomType: 'Single',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Vancouver Group',
          cardLastDigits: '3637',
          reservationHolder: 'Vancouver Group'
        },
        {
          id: '13',
          type: 'cancellation',
          title: 'Reserva cancelada por cliente',
          destination: 'Sydney, Austrália',
          amount: 11500,
          timeAgo: '3 semanas atrás',
          status: 'cancelled',
          hotel: 'Hotel Sydney',
          guest: 'Sydney Group',
          broker: 'Broker Sydney',
          consultant: 'Consultor Sydney',
          bookingCode: 'SYD383940',
          checkIn: '2025-07-08',
          checkOut: '2025-07-10',
          guests: 4,
          roomType: 'Double',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Sydney Group',
          cardLastDigits: '3940',
          reservationHolder: 'Sydney Group'
        },
        {
          id: '14',
          type: 'booking',
          title: 'Reserva de lua de mel',
          destination: 'Santorini, Grécia',
          amount: 15800,
          timeAgo: '4 semanas atrás',
          status: 'success',
          hotel: 'Hotel Santorini',
          guest: 'Santorini Group',
          broker: 'Broker Santorini',
          consultant: 'Consultor Santorini',
          bookingCode: 'SNT414243',
          checkIn: '2025-07-05',
          checkOut: '2025-07-07',
          guests: 2,
          roomType: 'Single',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Santorini Group',
          cardLastDigits: '4243',
          reservationHolder: 'Santorini Group'
        },
        {
          id: '15',
          type: 'payment',
          title: 'Pagamento completo',
          destination: 'Dubai, Emirados Árabes',
          amount: 22000,
          timeAgo: '1 mês atrás',
          status: 'success',
          hotel: 'Hotel Dubai',
          guest: 'Dubai Group',
          broker: 'Broker Dubai',
          consultant: 'Consultor Dubai',
          bookingCode: 'DBI444546',
          checkIn: '2025-06-25',
          checkOut: '2025-06-27',
          guests: 3,
          roomType: 'Double',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Dubai Group',
          cardLastDigits: '4446',
          reservationHolder: 'Dubai Group'
        }
      ],
      yearly: [
        {
          id: '16',
          type: 'booking',
          title: 'Pacote anual confirmado',
          destination: 'Múltiplos destinos',
          amount: 45000,
          timeAgo: '2 meses atrás',
          status: 'success',
          hotel: 'Múltiplos destinos',
          guest: 'Multi-destination Group',
          broker: 'Broker Multi-destination',
          consultant: 'Consultor Multi-destination',
          bookingCode: 'MULTI474849',
          checkIn: '2025-05-20',
          checkOut: '2025-05-22',
          guests: 5,
          roomType: 'Suite',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Multi-destination Group',
          cardLastDigits: '4749',
          reservationHolder: 'Multi-destination Group'
        },
        {
          id: '17',
          type: 'payment',
          title: 'Pagamento corporativo',
          destination: 'São Francisco, EUA',
          amount: 32000,
          timeAgo: '3 meses atrás',
          status: 'success',
          hotel: 'Hotel São Francisco',
          guest: 'Corporate San Francisco',
          broker: 'Broker San Francisco',
          consultant: 'Consultor San Francisco',
          bookingCode: 'SF454647',
          checkIn: '2025-04-15',
          checkOut: '2025-04-17',
          guests: 2,
          roomType: 'Double',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Corporate San Francisco',
          cardLastDigits: '4647',
          reservationHolder: 'Corporate San Francisco'
        },
        {
          id: '18',
          type: 'cancellation',
          title: 'Cancelamento de pacote',
          destination: 'Hong Kong, China',
          amount: 28000,
          timeAgo: '4 meses atrás',
          status: 'cancelled',
          hotel: 'Hotel Hong Kong',
          guest: 'Hong Kong Group',
          broker: 'Broker Hong Kong',
          consultant: 'Consultor Hong Kong',
          bookingCode: 'HK484950',
          checkIn: '2025-03-10',
          checkOut: '2025-03-12',
          guests: 3,
          roomType: 'Double',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Hong Kong Group',
          cardLastDigits: '4950',
          reservationHolder: 'Hong Kong Group'
        },
        {
          id: '19',
          type: 'booking',
          title: 'Reserva de grupo grande',
          destination: 'Berlim, Alemanha',
          amount: 35000,
          timeAgo: '6 meses atrás',
          status: 'success',
          hotel: 'Hotel Berlim',
          guest: 'Berlin Group',
          broker: 'Broker Berlim',
          consultant: 'Consultor Berlim',
          bookingCode: 'BER515253',
          checkIn: '2025-01-25',
          checkOut: '2025-01-27',
          guests: 6,
          roomType: 'Suite',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Berlin Group',
          cardLastDigits: '5253',
          reservationHolder: 'Berlin Group'
        },
        {
          id: '20',
          type: 'payment',
          title: 'Pagamento de seguro',
          destination: 'Singapura',
          amount: 18000,
          timeAgo: '8 meses atrás',
          status: 'success',
          hotel: 'Hotel Singapura',
          guest: 'Singapore Group',
          broker: 'Broker Singapura',
          consultant: 'Consultor Singapura',
          bookingCode: 'SGP545556',
          checkIn: '2024-12-10',
          checkOut: '2024-12-12',
          guests: 2,
          roomType: 'Double',
          paymentMethod: 'Cartão de Crédito',
          cardHolder: 'Singapore Group',
          cardLastDigits: '5556',
          reservationHolder: 'Singapore Group'
        }
      ]
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const handleDownloadReport = (type: string) => {
    // Simular geração de PDF com opções
    const reportTypes = {
      financial: 'Relatório Financeiro',
      performance: 'Relatório de Performance', 
      customer: 'Relatório de Clientes'
    };
    
    const reportName = reportTypes[type as keyof typeof reportTypes] || 'Relatório';
    
    // Criar modal de opções de PDF
    setShowPdfOptions(true);
    setSelectedReportType(type);
  };

  const handleGeneratePdf = async () => {
    setPdfGenerating(true);
    
    // Simular geração de PDF
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const periodText = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
      annual: 'Anual'
    }[pdfPeriod as keyof typeof periodText] || 'Geral';
    
    const categoryText = pdfCategory === 'all' ? 'Todas as Categorias' : pdfCategory;
    const searchText = pdfSearchTerm ? `_${pdfSearchTerm.replace(/[^a-zA-Z0-9]/g, '')}` : '';
    const dateText = pdfStartDate && pdfEndDate ? `_${pdfStartDate}_${pdfEndDate}` : '';
    
    const fileName = `relatorio_${selectedReportType}_${periodText.toLowerCase()}_${categoryText.toLowerCase()}${searchText}${dateText}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Simular download do PDF
    const link = document.createElement('a');
    link.href = `data:application/pdf;charset=utf-8,${encodeURIComponent('Relatório gerado com sucesso')}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('PDF gerado:', fileName);
    alert(`PDF gerado com sucesso: ${fileName}`);
    
    setPdfGenerating(false);
    setShowPdfOptions(false);
  };

  const handleCreateCheckpoint = async () => {
    if (!checkpointName.trim()) {
      alert('Por favor, insira um nome para o checkpoint');
      return;
    }

    setIsCreatingCheckpoint(true);
    
    // Simular criação de checkpoint
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCheckpoint: CheckpointData = {
      id: Date.now().toString(),
      name: checkpointName,
      date: new Date().toLocaleString('pt-BR'),
      status: 'success',
      size: '2.3 MB',
      description: `Checkpoint criado em ${selectedPeriod}`
    };

    setCheckpoints(prev => [newCheckpoint, ...prev]);
    setCheckpointName('');
    setShowCheckpointModal(false);
    setIsCreatingCheckpoint(false);
    
    alert('Checkpoint criado com sucesso!');
  };

  const handleRestoreCheckpoint = (checkpoint: CheckpointData) => {
    if (confirm(`Deseja restaurar o checkpoint "${checkpoint.name}"?`)) {
      alert(`Restaurando checkpoint: ${checkpoint.name}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleMetricClick = (metricType: string) => {
    setSelectedMetric(metricType);
    setShowMetricDetails(true);
    setSearchTerm('');
    setFilterPeriod('all');
  };

  const getMetricTitle = (metricType: string) => {
    switch (metricType) {
      case 'revenue':
        return 'Receita Total';
      case 'bookings':
        return 'Total de Reservas';
      case 'averagePrice':
        return 'Ticket Médio';
      case 'destinations':
        return 'Destinos Top';
      default:
        return 'Detalhes da Métrica';
    }
  };

  const getMetricIcon = (metricType: string) => {
    switch (metricType) {
      case 'revenue':
        return <DollarSign className="h-6 w-6 text-green-600" />;
      case 'bookings':
        return <Plane className="h-6 w-6 text-blue-600" />;
      case 'averagePrice':
        return <Users className="h-6 w-6 text-purple-600" />;
      case 'destinations':
        return <Calendar className="h-6 w-6 text-orange-600" />;
      default:
        return <Activity className="h-6 w-6 text-gray-600" />;
    }
  };

  const getFilteredData = () => {
    if (!metricDetails) return [];

    if (selectedMetric === 'destinations') {
      let filtered = metricDetails.destinations;
      
      if (searchTerm) {
        filtered = filtered.filter(dest => 
          dest.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      return filtered;
    } else {
      const data = metricDetails[selectedMetric as keyof MetricDetails] as MetricDetail[];
      let filtered = data;
      
      if (filterPeriod !== 'all') {
        filtered = filtered.filter(item => 
          item.period.toLowerCase().includes(filterPeriod.toLowerCase())
        );
      }
      
      return filtered;
    }
  };

  const handleChartClick = (chartType: string) => {
    setSelectedChart(chartType);
    setShowChartDetails(true);
    setSearchTerm('');
  };

  const handleReportClick = (reportType: string) => {
    setSelectedReport(reportType);
    setShowReportDetails(true);
    setSearchTerm('');
  };

  const getChartTitle = (chartType: string) => {
    switch (chartType) {
      case 'revenue':
        return 'Receita por Mês';
      case 'destinations':
        return 'Destinos Mais Populares';
      default:
        return 'Detalhes do Gráfico';
    }
  };

  const getChartIcon = (chartType: string) => {
    switch (chartType) {
      case 'revenue':
        return <BarChart3 className="h-6 w-6 text-green-600" />;
      case 'destinations':
        return <PieChart className="h-6 w-6 text-blue-600" />;
      default:
        return <Activity className="h-6 w-6 text-gray-600" />;
    }
  };

  const getReportTitle = (reportType: string) => {
    switch (reportType) {
      case 'financial':
        return 'Relatório Financeiro';
      case 'performance':
        return 'Relatório de Performance';
      case 'customer':
        return 'Relatório de Clientes';
      default:
        return 'Detalhes do Relatório';
    }
  };

  const getReportIcon = (reportType: string) => {
    switch (reportType) {
      case 'financial':
        return <DollarSign className="h-6 w-6 text-green-600" />;
      case 'performance':
        return <Activity className="h-6 w-6 text-blue-600" />;
      case 'customer':
        return <Users className="h-6 w-6 text-purple-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const getFilteredChartData = () => {
    if (!chartDetails) return [];

    if (selectedChart === 'revenue') {
      let filtered = chartDetails.revenueChart;
      
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.month.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      return filtered;
    } else if (selectedChart === 'destinations') {
      let filtered = chartDetails.destinationsChart;
      
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      return filtered;
    }
    
    return [];
  };

  const getFilteredReportData = () => {
    if (!chartDetails) return null;

    const report = chartDetails.reports.find(r => r.id === selectedReport);
    return report || null;
  };

  const handleChartItemClick = (item: any) => {
    if (selectedChart === 'revenue') {
      setSelectedChartItem(item.month);
      setHighlightedChartItem(item.month);
    } else if (selectedChart === 'destinations') {
      setSelectedChartItem(item.name);
      setHighlightedChartItem(item.name);
    }
  };

  const getChartItemStyle = (item: any) => {
    const isHighlighted = selectedChart === 'revenue' 
      ? highlightedChartItem === item.month 
      : highlightedChartItem === item.name;
    
    return isHighlighted 
      ? 'border-2 border-blue-500 bg-blue-50 shadow-lg' 
      : 'border hover:bg-gray-50';
  };

  const getChartVisualization = () => {
    if (!chartDetails) return null;

    if (selectedChart === 'revenue') {
      const selectedData = chartDetails.revenueChart.find(item => item.month === selectedChartItem);
      if (!selectedData) return null;

      return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Visualização: {selectedData.month}</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Receita:</span>
              <span className="font-semibold text-green-600">{formatCurrency(selectedData.revenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reservas:</span>
              <span className="font-semibold">{selectedData.bookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Crescimento:</span>
              <div className="flex items-center">
                {selectedData.growth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`font-semibold ${selectedData.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(Math.abs(selectedData.growth))}
                </span>
              </div>
            </div>
            {/* Barra de progresso visual */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progresso</span>
                <span className="text-sm font-semibold">{formatCurrency(selectedData.revenue)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(selectedData.revenue / 185000) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (selectedChart === 'destinations') {
      const selectedData = chartDetails.destinationsChart.find(item => item.name === selectedChartItem);
      if (!selectedData) return null;

      return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Visualização: {selectedData.name}</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Receita:</span>
              <span className="font-semibold text-blue-600">{formatCurrency(selectedData.revenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reservas:</span>
              <span className="font-semibold">{selectedData.bookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Participação:</span>
              <span className="font-semibold text-blue-600">{selectedData.percentage}%</span>
            </div>
            {/* Gráfico de pizza visual */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Distribuição</span>
                <span className="text-sm font-semibold">{selectedData.percentage}% do total</span>
              </div>
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                <div 
                  className="absolute inset-0 w-32 h-32 rounded-full border-8 border-blue-500"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (selectedData.percentage * 3.6)}% 0%, ${50 + (selectedData.percentage * 3.6)}% 50%)` 
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold">{selectedData.percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const handleActivityClick = (activityType: string) => {
    setSelectedActivity(activityType);
    setShowActivityDetails(true);
    setSearchTerm('');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Plane className="h-4 w-4 text-green-600" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'cancellation':
        return <Calendar className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getFilteredActivityData = () => {
    if (!activityDetails) return [];

    let allActivities: ActivityItem[] = [];
    
    if (selectedActivity === 'all' || selectedActivity === '') {
      allActivities = [
        ...activityDetails.daily,
        ...activityDetails.weekly,
        ...activityDetails.monthly,
        ...activityDetails.yearly
      ];
    } else if (selectedActivity === 'daily') {
      allActivities = activityDetails.daily;
    } else if (selectedActivity === 'weekly') {
      allActivities = activityDetails.weekly;
    } else if (selectedActivity === 'monthly') {
      allActivities = activityDetails.monthly;
    } else if (selectedActivity === 'yearly') {
      allActivities = activityDetails.yearly;
    }

    if (searchTerm) {
      allActivities = allActivities.filter(activity => 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.broker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.consultant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.cardHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.reservationHolder.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allActivities;
  };

  const handleExportReport = (type: string) => {
    setExportType(type);
    setShowExportModal(true);
  };

  const handleExportSubmit = async () => {
    setExportGenerating(true);
    
    // Simular geração de relatório
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const periodText = {
      all: 'Geral',
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
      annual: 'Anual'
    }[exportPeriod] || 'Geral';
    
    const categoryText = exportCategory === 'all' ? 'Todas as Categorias' : exportCategory;
    const typeText = exportType === 'all' ? 'Completo' : exportType;
    
    const fileName = `relatorio_${typeText.toLowerCase()}_${periodText.toLowerCase()}_${categoryText.toLowerCase()}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    
    // Simular download do arquivo
    const link = document.createElement('a');
    link.href = `data:text/${exportFormat};charset=utf-8,${encodeURIComponent('Dados do relatório')}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Relatório exportado:', fileName);
    alert(`Relatório exportado com sucesso: ${fileName}`);
    
    setExportGenerating(false);
    setShowExportModal(false);
  };

  const getExportTitle = (type: string) => {
    switch (type) {
      case 'all': return 'Relatório Completo';
      case 'financial': return 'Relatório Financeiro';
      case 'performance': return 'Relatório de Performance';
      case 'customer': return 'Relatório de Clientes';
      case 'revenue': return 'Relatório de Receita';
      case 'bookings': return 'Relatório de Reservas';
      case 'destinations': return 'Relatório de Destinos';
      case 'activity': return 'Relatório de Atividade';
      default: return 'Relatório';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">📊 Relatórios e Analytics</h1>
                <p className="text-gray-600 mt-2">Análise completa de dados e performance</p>
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
          {/* Period Selector */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Período de Análise</h2>
                  <p className="text-sm text-gray-600">Selecione o período para os relatórios</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Diário</option>
                    <option value="week">Última Semana</option>
                    <option value="month">Último Mês</option>
                    <option value="quarter">Último Trimestre</option>
                    <option value="year">Último Ano</option>
                  </select>
                  <button
                    onClick={() => setShowCheckpointModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Criar Checkpoint
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div 
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleMetricClick('revenue')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockReportData.totalRevenue)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{formatPercentage(mockReportData.growthRate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleMetricClick('bookings')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">{mockReportData.totalBookings}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.2%</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleMetricClick('averagePrice')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockReportData.averagePrice)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+4.1%</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleMetricClick('destinations')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Destino Top</p>
                  <p className="text-lg font-bold text-gray-900">{mockReportData.topDestination}</p>
                  <p className="text-sm text-gray-600">15 reservas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div 
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleChartClick('revenue')}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Receita por Mês</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportReport('revenue');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </button>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Gráfico de Receita</p>
                    <p className="text-sm text-gray-400">Dados dos últimos 12 meses</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Destinations Chart */}
            <div 
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleChartClick('destinations')}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Destinos Mais Populares</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportReport('destinations');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </button>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Gráfico de Destinos</p>
                    <p className="text-sm text-gray-400">Distribuição por localização</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Reports */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Relatórios Detalhados</h2>
                <button
                  onClick={() => handleDownloadReport('complete')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Relatório Completo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Financial Report */}
                <div 
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleReportClick('financial')}
                >
                  <div className="flex items-center mb-3">
                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold">Relatório Financeiro</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Análise completa de receitas, custos e lucros
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadReport('financial');
                    }}
                    className="w-full bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-200"
                  >
                    Baixar PDF
                  </button>
                </div>

                {/* Performance Report */}
                <div 
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleReportClick('performance')}
                >
                  <div className="flex items-center mb-3">
                    <Activity className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold">Relatório de Performance</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Métricas de vendas e conversão
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadReport('performance');
                    }}
                    className="w-full bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-200"
                  >
                    Baixar PDF
                  </button>
                </div>

                {/* Customer Report */}
                <div 
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleReportClick('customer')}
                >
                  <div className="flex items-center mb-3">
                    <Users className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold">Relatório de Clientes</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Análise de comportamento e preferências
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadReport('customer');
                    }}
                    className="w-full bg-purple-100 text-purple-700 px-3 py-2 rounded text-sm font-medium hover:bg-purple-200"
                  >
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow mt-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Atividade Recente</h2>
                <button
                  onClick={() => handleActivityClick('all')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Ver Todas
                </button>
              </div>
              <div className="space-y-3">
                <div 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleActivityClick('daily')}
                >
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Plane className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nova reserva confirmada</p>
                    <p className="text-xs text-gray-600">Paris, França - R$ 4.500,00</p>
                    <p className="text-xs text-gray-500">Hotel Paris • John Doe • PAR12345</p>
                    <p className="text-xs text-blue-600">Cartão de Crédito • ****1234</p>
                  </div>
                  <span className="text-xs text-gray-500">2 min atrás</span>
                </div>

                <div 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleActivityClick('daily')}
                >
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pagamento processado</p>
                    <p className="text-xs text-gray-600">Orlando, EUA - R$ 8.500,00</p>
                    <p className="text-xs text-gray-500">Hotel Orlando • Jane Smith • ORL45678</p>
                    <p className="text-xs text-green-600">PIX • ****5678</p>
                  </div>
                  <span className="text-xs text-gray-500">15 min atrás</span>
                </div>

                <div 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleActivityClick('daily')}
                >
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Agendamento cancelado</p>
                    <p className="text-xs text-gray-600">São Paulo, Brasil - R$ 1.200,00</p>
                    <p className="text-xs text-gray-500">Hotel São Paulo • Carlos Oliveira • SPO78901</p>
                    <p className="text-xs text-orange-600">Boleto Bancário • ****9012</p>
                  </div>
                  <span className="text-xs text-gray-500">1 hora atrás</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkpoint and Backup Section */}
          <div className="bg-white rounded-lg shadow mt-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Checkpoint e Backup</h2>
                  <p className="text-sm text-gray-600">Gerencie pontos de restauração do sistema</p>
                </div>
                <button
                  onClick={() => setShowCheckpointModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Novo Checkpoint
                </button>
              </div>

              <div className="space-y-4">
                {checkpoints.map((checkpoint) => (
                  <div key={checkpoint.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(checkpoint.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(checkpoint.status)}`}>
                            {checkpoint.status === 'success' ? 'Sucesso' : 
                             checkpoint.status === 'error' ? 'Erro' : 'Pendente'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{checkpoint.name}</h3>
                          <p className="text-sm text-gray-600">{checkpoint.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">{checkpoint.date}</span>
                            <span className="text-xs text-gray-500">{checkpoint.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRestoreCheckpoint(checkpoint)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium hover:bg-blue-200 flex items-center"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Restaurar
                        </button>
                        <button
                          onClick={() => handleDownloadReport('checkpoint')}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-200 flex items-center"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Baixar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Checkpoint Modal */}
        {showCheckpointModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Criar Novo Checkpoint</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Checkpoint
                    </label>
                    <input
                      type="text"
                      value={checkpointName}
                      onChange={(e) => setCheckpointName(e.target.value)}
                      placeholder="Ex: Checkpoint V2.2.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Período Atual
                    </label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg">
                      <span className="text-sm text-gray-600">
                        {selectedPeriod === 'daily' ? 'Diário' :
                         selectedPeriod === 'week' ? 'Última Semana' :
                         selectedPeriod === 'month' ? 'Último Mês' :
                         selectedPeriod === 'quarter' ? 'Último Trimestre' : 'Último Ano'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowCheckpointModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateCheckpoint}
                      disabled={isCreatingCheckpoint}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50"
                    >
                      {isCreatingCheckpoint ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Criar Checkpoint
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metric Details Modal */}
        {showMetricDetails && metricDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getMetricIcon(selectedMetric)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{getMetricTitle(selectedMetric)}</h3>
                      <p className="text-sm text-gray-600">Detalhes completos por período e categoria</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMetricDetails(false)}
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
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {selectedMetric !== 'destinations' && (
                    <select
                      value={filterPeriod}
                      onChange={(e) => setFilterPeriod(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todos os Períodos</option>
                      <option value="diário">Diário</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                  )}
                  <button
                    onClick={() => handleDownloadReport(`${selectedMetric}-details`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </button>
                </div>

                {/* Data Display */}
                <div className="space-y-6">
                  {selectedMetric === 'destinations' ? (
                    // Destinations List
                    <div className="space-y-4">
                      {getFilteredData().map((dest: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{dest.name}</h4>
                                <p className="text-sm text-gray-600">{dest.bookings} reservas</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatCurrency(dest.revenue)}</p>
                              <p className="text-sm text-gray-600">{dest.percentage}% do total</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Period Data
                    <div className="space-y-6">
                      {getFilteredData().map((item: any, index: number) => (
                        <div key={index} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{item.period}</h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <p className="text-2xl font-bold text-gray-900">
                                  {selectedMetric === 'revenue' || selectedMetric === 'averagePrice' 
                                    ? formatCurrency(item.value) 
                                    : item.value}
                                </p>
                                <div className="flex items-center">
                                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                  <span className="text-sm text-green-600">{formatPercentage(item.growth)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Breakdown by Category */}
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-3">Detalhamento por Categoria</h5>
                            <div className="space-y-3">
                              {item.breakdown.map((cat: any, catIndex: number) => (
                                <div key={catIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-gray-900">{cat.category}</p>
                                    <p className="text-sm text-gray-600">{cat.percentage}% do total</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                      {selectedMetric === 'revenue' || selectedMetric === 'averagePrice' 
                                        ? formatCurrency(cat.value) 
                                        : cat.value}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setShowMetricDetails(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      setShowMetricDetails(false);
                      setShowCheckpointModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Criar Checkpoint
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart Details Modal */}
        {showChartDetails && chartDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getChartIcon(selectedChart)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{getChartTitle(selectedChart)}</h3>
                      <p className="text-sm text-gray-600">Dados detalhados do gráfico</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChartDetails(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Search */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(`${selectedChart}-chart`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </button>
                </div>

                {/* Chart Data Display */}
                <div className="space-y-4">
                  {selectedChart === 'revenue' ? (
                    // Revenue Chart Data
                    getFilteredChartData().map((item: any, index: number) => (
                      <div 
                        key={index} 
                        className={`rounded-lg p-4 transition-all duration-200 cursor-pointer ${getChartItemStyle(item)}`}
                        onClick={() => handleChartItemClick(item)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.month}</h4>
                              <p className="text-sm text-gray-600">{item.bookings} reservas</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                            <div className="flex items-center justify-end">
                              {item.growth >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className={`text-sm ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercentage(Math.abs(item.growth))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Destinations Chart Data
                    getFilteredChartData().map((item: any, index: number) => (
                      <div 
                        key={index} 
                        className={`rounded-lg p-4 transition-all duration-200 cursor-pointer ${getChartItemStyle(item)}`}
                        onClick={() => handleChartItemClick(item)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">{item.bookings} reservas</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                            <p className="text-sm text-gray-600">{item.percentage}% do total</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chart Visualization */}
                {selectedChartItem && (
                  <div className="mt-6 pt-6 border-t">
                    {getChartVisualization()}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setShowChartDetails(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Details Modal */}
        {showReportDetails && chartDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {(() => {
                  const report = getFilteredReportData();
                  if (!report) return null;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getReportIcon(selectedReport)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{report.title}</h3>
                            <p className="text-sm text-gray-600">{report.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowReportDetails(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      {/* Report Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Receita</p>
                          <p className="text-lg font-semibold">{formatCurrency(report.data.revenue)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Custos</p>
                          <p className="text-lg font-semibold">{formatCurrency(report.data.costs)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Lucro</p>
                          <p className="text-lg font-semibold text-green-600">{formatCurrency(report.data.profit)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Reservas</p>
                          <p className="text-lg font-semibold">{report.data.bookings}</p>
                        </div>
                      </div>

                      {/* Report Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Detalhamento</h4>
                        {report.details.map((detail: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{detail.category}</p>
                                <p className="text-sm text-gray-600">{detail.percentage}% do total</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {selectedReport === 'financial' || selectedReport === 'performance' 
                                    ? formatCurrency(detail.value)
                                    : detail.value}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                        <button
                          onClick={() => setShowReportDetails(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Fechar
                        </button>
                        <button
                          onClick={() => handleDownloadReport(selectedReport)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Baixar PDF
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Activity Details Modal */}
        {showActivityDetails && activityDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Atividade Recente</h3>
                      <p className="text-sm text-gray-600">Detalhamento por período</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowActivityDetails(false)}
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
                        placeholder="Buscar por título, destino, hotel, hóspede, corretor, consultor, código, pagamento ou titular..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos os Períodos</option>
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                  <button
                    onClick={() => handleDownloadReport('activity-details')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </button>
                </div>

                {/* Activity Data Display */}
                <div className="space-y-4">
                  {getFilteredActivityData().map((activity, index) => (
                    <div key={activity.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityStatusColor(activity.status)}`}>
                                {getActivityStatusText(activity.status)}
                              </span>
                            </div>
                            
                            {/* Informações Principais */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Destino</p>
                                <p className="font-medium text-gray-900">{activity.destination}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Valor</p>
                                <p className="font-semibold text-green-600">{formatCurrency(activity.amount)}</p>
                              </div>
                            </div>

                            {/* Informações do Hotel */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Hotel/Resort</p>
                                <p className="font-medium text-gray-900">{activity.hotel}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Código da Reserva</p>
                                <p className="font-medium text-blue-600">{activity.bookingCode}</p>
                              </div>
                            </div>

                            {/* Informações do Hóspede */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Hóspede</p>
                                <p className="font-medium text-gray-900">{activity.guest}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Número de Hóspedes</p>
                                <p className="font-medium text-gray-900">{activity.guests} pessoa(s)</p>
                              </div>
                            </div>

                            {/* Informações de Check-in/Check-out */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Check-in</p>
                                <p className="font-medium text-gray-900">{activity.checkIn}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Check-out</p>
                                <p className="font-medium text-gray-900">{activity.checkOut}</p>
                              </div>
                            </div>

                            {/* Informações da Equipe */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Corretor/Proprietário</p>
                                <p className="font-medium text-gray-900">{activity.broker}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Consultor de Férias</p>
                                <p className="font-medium text-gray-900">{activity.consultant}</p>
                              </div>
                            </div>

                            {/* Informações de Pagamento */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Forma de Pagamento</p>
                                <p className="font-medium text-gray-900">{activity.paymentMethod}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Titular do Cartão</p>
                                <p className="font-medium text-gray-900">{activity.cardHolder}</p>
                              </div>
                            </div>

                            {/* Informações do Cartão */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Últimos Dígitos</p>
                                <p className="font-medium text-blue-600">****{activity.cardLastDigits}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Titular da Reserva</p>
                                <p className="font-medium text-gray-900">{activity.reservationHolder}</p>
                              </div>
                            </div>

                            {/* Tipo de Quarto */}
                            <div>
                              <p className="text-sm text-gray-600">Tipo de Quarto</p>
                              <p className="font-medium text-gray-900">{activity.roomType}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">{activity.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity Summary */}
                {getFilteredActivityData().length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-4">Resumo da Atividade</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Plane className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Reservas</p>
                            <p className="text-lg font-semibold text-green-600">
                              {getFilteredActivityData().filter(a => a.type === 'booking').length}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Pagamentos</p>
                            <p className="text-lg font-semibold text-blue-600">
                              {getFilteredActivityData().filter(a => a.type === 'payment').length}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-yellow-600 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Cancelamentos</p>
                            <p className="text-lg font-semibold text-yellow-600">
                              {getFilteredActivityData().filter(a => a.type === 'cancellation').length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Valor Total:</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(getFilteredActivityData().reduce((sum, activity) => sum + activity.amount, 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setShowActivityDetails(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Options Modal */}
        {showPdfOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Gerar Relatório PDF</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Relatório
                    </label>
                    <select
                      value={selectedReportType}
                      onChange={(e) => setSelectedReportType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="financial">Relatório Financeiro</option>
                      <option value="performance">Relatório de Performance</option>
                      <option value="customer">Relatório de Clientes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Período
                    </label>
                    <select
                      value={pdfPeriod}
                      onChange={(e) => setPdfPeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                      <option value="annual">Anual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={pdfCategory}
                      onChange={(e) => setPdfCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todas as Categorias</option>
                      <option value="hotels">Hotéis</option>
                      <option value="resorts">Resorts</option>
                      <option value="destinations">Destinos</option>
                      <option value="values">Valores</option>
                      <option value="bookingCodes">Códigos de Reserva</option>
                      <option value="guests">Hóspedes</option>
                      <option value="guestCounts">Número de Hóspedes</option>
                      <option value="checkIn">Check-in</option>
                      <option value="checkOut">Check-out</option>
                      <option value="brokers">Corretor/Proprietário</option>
                      <option value="consultants">Consultor de Férias</option>
                      <option value="cardHolders">Titular do Cartão</option>
                      <option value="reservationHolders">Titular da Reserva</option>
                      <option value="roomTypes">Tipo de Quarto</option>
                    </select>
                  </div>

                  {/* Campos de Data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Inicial
                      </label>
                      <input
                        type="date"
                        value={pdfStartDate}
                        onChange={(e) => setPdfStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Selecione a data inicial"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Final
                      </label>
                      <input
                        type="date"
                        value={pdfEndDate}
                        onChange={(e) => setPdfEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Selecione a data final"
                      />
                    </div>
                  </div>

                  {/* Campo de Pesquisa */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Termo de Pesquisa
                    </label>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={pdfSearchTerm}
                        onChange={(e) => setPdfSearchTerm(e.target.value)}
                        placeholder="Digite um termo para pesquisar no relatório..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Pesquise por hotel, hóspede, destino, código de reserva, etc.
                    </p>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowPdfOptions(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleGeneratePdf}
                      disabled={pdfGenerating}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50"
                    >
                      {pdfGenerating ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Gerar PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Options Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Exportar Relatório</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato
                    </label>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="csv">CSV</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={exportType}
                      onChange={(e) => setExportType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todos</option>
                      <option value="financial">Financeiro</option>
                      <option value="performance">Performance</option>
                      <option value="customer">Clientes</option>
                      <option value="revenue">Receita</option>
                      <option value="bookings">Reservas</option>
                      <option value="destinations">Destinos</option>
                      <option value="activity">Atividade</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Período
                    </label>
                    <select
                      value={exportPeriod}
                      onChange={(e) => setExportPeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Geral</option>
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                      <option value="annual">Anual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={exportCategory}
                      onChange={(e) => setExportCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todas as Categorias</option>
                      <option value="hotels">Hotéis</option>
                      <option value="resorts">Resorts</option>
                      <option value="destinations">Destinos</option>
                      <option value="values">Valores</option>
                      <option value="bookingCodes">Códigos de Reserva</option>
                      <option value="guests">Hóspedes</option>
                      <option value="guestCounts">Número de Hóspedes</option>
                      <option value="checkIn">Check-in</option>
                      <option value="checkOut">Check-out</option>
                      <option value="brokers">Corretor/Proprietário</option>
                      <option value="consultants">Consultor de Férias</option>
                      <option value="cardHolders">Titular do Cartão</option>
                      <option value="reservationHolders">Titular da Reserva</option>
                      <option value="roomTypes">Tipo de Quarto</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowExportModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleExportSubmit}
                      disabled={exportGenerating}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50"
                    >
                      {exportGenerating ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Exportando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Exportar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 
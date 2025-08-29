import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, AlertCircle, Info, Mail, Settings, Trash2, Archive, Filter, Search, MoreHorizontal, Clock, User, Calendar, DollarSign, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectOption } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { cn } from '../../utils/cn';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'booking' | 'payment' | 'customer' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: string[];
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationCenterProps {
  className?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Nova Reserva Confirmada',
    message: 'João Silva confirmou reserva para Caldas Novas - 15-18 Ago',
    timestamp: '2025-08-05T10:30:00Z',
    read: false,
    priority: 'high',
    category: 'reservas',
    actionUrl: '/bookings/123',
    metadata: {
      customerId: '123',
      bookingId: '456',
      destination: 'Caldas Novas',
      checkIn: '2025-08-15',
      checkOut: '2025-08-18',
      value: 1500,
    },
    sender: {
      id: 'sys',
      name: 'Sistema RSV',
    },
  },
  {
    id: '2',
    type: 'payment',
    title: 'Pagamento Aprovado',
    message: 'Pagamento de R$ 2.500 para pacote Rio de Janeiro foi aprovado',
    timestamp: '2025-08-05T09:45:00Z',
    read: false,
    priority: 'medium',
    category: 'pagamentos',
    actionUrl: '/payments/789',
    metadata: {
      amount: 2500,
      method: 'cartão',
      customerId: '456',
    },
  },
  {
    id: '3',
    type: 'customer',
    title: 'Novo Cliente Cadastrado',
    message: 'Maria Santos se cadastrou no sistema',
    timestamp: '2025-08-05T09:15:00Z',
    read: true,
    priority: 'low',
    category: 'clientes',
    actionUrl: '/customers/789',
    sender: {
      id: 'sys',
      name: 'Sistema RSV',
    },
  },
  {
    id: '4',
    type: 'warning',
    title: 'API Indisponível',
    message: 'Conexão com Booking.com API está instável',
    timestamp: '2025-08-05T08:30:00Z',
    read: false,
    priority: 'urgent',
    category: 'sistema',
    metadata: {
      apiName: 'Booking.com',
      errorCode: 'CONNECTION_TIMEOUT',
    },
  },
  {
    id: '5',
    type: 'success',
    title: 'Sincronização Concluída',
    message: 'Dados de hotéis foram sincronizados com sucesso',
    timestamp: '2025-08-05T08:00:00Z',
    read: true,
    priority: 'low',
    category: 'sistema',
    metadata: {
      totalHotels: 45,
      syncDuration: '2m 30s',
    },
  },
  {
    id: '6',
    type: 'info',
    title: 'Manutenção Programada',
    message: 'Sistema ficará indisponível das 02h às 04h para atualizações',
    timestamp: '2025-08-05T07:00:00Z',
    read: false,
    priority: 'medium',
    category: 'sistema',
    metadata: {
      maintenanceStart: '2025-08-06T02:00:00Z',
      maintenanceEnd: '2025-08-06T04:00:00Z',
    },
  },
];

const notificationTypes: SelectOption[] = [
  { value: 'all', label: 'Todas' },
  { value: 'booking', label: 'Reservas' },
  { value: 'payment', label: 'Pagamentos' },
  { value: 'customer', label: 'Clientes' },
  { value: 'system', label: 'Sistema' },
  { value: 'info', label: 'Informações' },
  { value: 'success', label: 'Sucesso' },
  { value: 'warning', label: 'Avisos' },
  { value: 'error', label: 'Erros' },
];

const priorityOptions: SelectOption[] = [
  { value: 'all', label: 'Todas as Prioridades' },
  { value: 'urgent', label: 'Urgente' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
];

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showRead, setShowRead] = useState(true);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    categories: ['reservas', 'pagamentos', 'clientes', 'sistema'],
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'customer':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      case 'info':
        return 'border-l-blue-500';
      case 'booking':
        return 'border-l-purple-500';
      case 'payment':
        return 'border-l-green-500';
      case 'customer':
        return 'border-l-blue-500';
      case 'system':
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleArchiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // Aqui você implementaria a navegação
      console.log('Navegando para:', notification.actionUrl);
    }
  };

  // Filtrar notificações
  useEffect(() => {
    let filtered = notifications;

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    // Filtro por prioridade
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(n => n.priority === priorityFilter);
    }

    // Filtro por leitura
    if (!showRead) {
      filtered = filtered.filter(n => !n.read);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, typeFilter, priorityFilter, showRead, searchTerm]);

  // Simular novas notificações
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular notificação ocasional
      if (Math.random() < 0.1) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'info',
          title: 'Atualização do Sistema',
          message: 'Novas funcionalidades disponíveis no dashboard',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'low',
          category: 'sistema',
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Botão de Notificações */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        {urgentCount > 0 && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </Button>

      {/* Dropdown de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Marcar como lidas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filtros */}
            <div className="space-y-3">
              <Input
                placeholder="Buscar notificações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <div className="flex items-center space-x-2">
                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                  options={notificationTypes}
                  placeholder="Tipo"
                  className="w-32"
                />
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                  options={priorityOptions}
                  placeholder="Prioridade"
                  className="w-32"
                />
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showRead}
                    onChange={(e) => setShowRead(e.target.checked)}
                    className="rounded"
                  />
                  <span>Mostrar lidas</span>
                </label>
              </div>
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma notificação encontrada</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4',
                      getTypeColor(notification.type),
                      !notification.read && 'bg-blue-50'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            'text-sm font-medium',
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          )}>
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="secondary" 
                              className={cn('text-xs', getPriorityColor(notification.priority))}
                            >
                              {notification.priority === 'urgent' && 'Urgente'}
                              {notification.priority === 'high' && 'Alta'}
                              {notification.priority === 'medium' && 'Média'}
                              {notification.priority === 'low' && 'Baixa'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        <p className={cn(
                          'text-sm mt-1',
                          !notification.read ? 'text-gray-800' : 'text-gray-600'
                        )}>
                          {notification.message}
                        </p>
                        
                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            {notification.metadata.customerId && (
                              <span>Cliente: {notification.metadata.customerId}</span>
                            )}
                            {notification.metadata.amount && (
                              <span>Valor: R$ {notification.metadata.amount}</span>
                            )}
                            {notification.metadata.destination && (
                              <span>Destino: {notification.metadata.destination}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Archive className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{filteredNotifications.length} notificação{filteredNotifications.length !== 1 ? 's' : ''}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Ver todas
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configurações */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Configurações de Notificações"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Canais de Notificação</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.checked }))}
                  className="rounded"
                />
                <span>Notificações por Email</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.push}
                  onChange={(e) => setSettings(prev => ({ ...prev, push: e.target.checked }))}
                  className="rounded"
                />
                <span>Notificações Push</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.sms}
                  onChange={(e) => setSettings(prev => ({ ...prev, sms: e.target.checked }))}
                  className="rounded"
                />
                <span>Notificações por SMS</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Categorias</h4>
            <div className="grid grid-cols-2 gap-3">
              {['reservas', 'pagamentos', 'clientes', 'sistema'].map((category) => (
                <label key={category} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings(prev => ({
                          ...prev,
                          categories: [...prev.categories, category]
                        }));
                      } else {
                        setSettings(prev => ({
                          ...prev,
                          categories: prev.categories.filter(c => c !== category)
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Horário Silencioso</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.quietHours.enabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, enabled: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span>Ativar horário silencioso</span>
              </label>
              {settings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Início
                    </label>
                    <Input
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, start: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fim
                    </label>
                    <Input
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setIsSettingsOpen(false)}>
            Salvar Configurações
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export { NotificationCenter };
export type { Notification, NotificationSettings, NotificationCenterProps };

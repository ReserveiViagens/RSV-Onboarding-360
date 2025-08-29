import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Mail, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Stop,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { useUIStore } from '../../stores/useUIStore';

interface ScheduledReport {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string;
  dayOfWeek?: number; // 0-6 (Domingo-Sábado)
  dayOfMonth?: number; // 1-31
  recipients: string[];
  status: 'active' | 'paused' | 'stopped';
  lastRun: string | null;
  nextRun: string;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  createdAt: string;
  createdBy: string;
}

interface ReportSchedulerProps {
  onScheduleCreated?: (schedule: ScheduledReport) => void;
  onScheduleUpdated?: (schedule: ScheduledReport) => void;
}

const ReportScheduler: React.FC<ReportSchedulerProps> = ({ 
  onScheduleCreated,
  onScheduleUpdated 
}) => {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledReport | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  const [newSchedule, setNewSchedule] = useState<Partial<ScheduledReport>>({});
  
  const { showNotification } = useUIStore();

  // Dados mock para demonstração
  const mockScheduledReports: ScheduledReport[] = [
    {
      id: 'schedule-1',
      name: 'Relatório Diário de Vendas',
      templateId: 'sales-performance',
      templateName: 'Performance de Vendas',
      frequency: 'daily',
      time: '08:00',
      recipients: ['gerente@reserveiviagens.com.br', 'vendas@reserveiviagens.com.br'],
      status: 'active',
      lastRun: '2025-01-20T08:00:00Z',
      nextRun: '2025-01-21T08:00:00Z',
      totalRuns: 45,
      successfulRuns: 43,
      failedRuns: 2,
      createdAt: '2025-01-01T00:00:00Z',
      createdBy: 'admin@reserveiviagens.com.br'
    },
    {
      id: 'schedule-2',
      name: 'Relatório Semanal de Clientes',
      templateId: 'customer-segmentation',
      templateName: 'Segmentação de Clientes',
      frequency: 'weekly',
      time: '09:00',
      dayOfWeek: 1, // Segunda-feira
      recipients: ['marketing@reserveiviagens.com.br', 'gerente@reserveiviagens.com.br'],
      status: 'active',
      lastRun: '2025-01-20T09:00:00Z',
      nextRun: '2025-01-27T09:00:00Z',
      totalRuns: 12,
      successfulRuns: 12,
      failedRuns: 0,
      createdAt: '2025-01-01T00:00:00Z',
      createdBy: 'admin@reserveiviagens.com.br'
    },
    {
      id: 'schedule-3',
      name: 'Relatório Mensal Financeiro',
      templateId: 'financial-summary',
      templateName: 'Resumo Financeiro',
      frequency: 'monthly',
      time: '10:00',
      dayOfMonth: 1,
      recipients: ['financeiro@reserveiviagens.com.br', 'gerente@reserveiviagens.com.br', 'diretoria@reserveiviagens.com.br'],
      status: 'paused',
      lastRun: '2025-01-01T10:00:00Z',
      nextRun: '2025-02-01T10:00:00Z',
      totalRuns: 3,
      successfulRuns: 3,
      failedRuns: 0,
      createdAt: '2025-01-01T00:00:00Z',
      createdBy: 'admin@reserveiviagens.com.br'
    },
    {
      id: 'schedule-4',
      name: 'Relatório Trimestral de Destinos',
      templateId: 'destination-popularity',
      templateName: 'Popularidade dos Destinos',
      frequency: 'quarterly',
      time: '14:00',
      dayOfMonth: 1,
      recipients: ['operacional@reserveiviagens.com.br', 'gerente@reserveiviagens.com.br'],
      status: 'active',
      lastRun: '2025-01-01T14:00:00Z',
      nextRun: '2025-04-01T14:00:00Z',
      totalRuns: 1,
      successfulRuns: 1,
      failedRuns: 0,
      createdAt: '2025-01-01T00:00:00Z',
      createdBy: 'admin@reserveiviagens.com.br'
    }
  ];

  useEffect(() => {
    setScheduledReports(mockScheduledReports);
  }, []);

  const handleCreateSchedule = () => {
    if (!newSchedule.name || !newSchedule.frequency || !newSchedule.time || !newSchedule.recipients?.length) {
      showNotification('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    const schedule: ScheduledReport = {
      id: `schedule-${Date.now()}`,
      name: newSchedule.name!,
      templateId: newSchedule.templateId || 'custom',
      templateName: newSchedule.templateName || 'Relatório Customizado',
      frequency: newSchedule.frequency!,
      time: newSchedule.time!,
      dayOfWeek: newSchedule.dayOfWeek,
      dayOfMonth: newSchedule.dayOfMonth,
      recipients: newSchedule.recipients!,
      status: 'active',
      lastRun: null,
      nextRun: calculateNextRun(newSchedule.frequency!, newSchedule.time!, newSchedule.dayOfWeek, newSchedule.dayOfMonth),
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user@reserveiviagens.com.br'
    };

    setScheduledReports(prev => [...prev, schedule]);
    setShowCreateModal(false);
    setNewSchedule({});
    
    if (onScheduleCreated) {
      onScheduleCreated(schedule);
    }
    
    showNotification('Agendamento criado com sucesso!', 'success');
  };

  const calculateNextRun = (frequency: string, time: string, dayOfWeek?: number, dayOfMonth?: number): string => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);
    
    switch (frequency) {
      case 'daily':
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;
      case 'weekly':
        if (dayOfWeek !== undefined) {
          const currentDay = now.getDay();
          const daysUntilNext = (dayOfWeek - currentDay + 7) % 7;
          nextRun.setDate(nextRun.getDate() + daysUntilNext);
        }
        break;
      case 'monthly':
        if (dayOfMonth) {
          nextRun.setDate(dayOfMonth);
          if (nextRun <= now) {
            nextRun.setMonth(nextRun.getMonth() + 1);
          }
        }
        break;
      case 'quarterly':
        if (dayOfMonth) {
          nextRun.setDate(dayOfMonth);
          nextRun.setMonth(Math.floor(nextRun.getMonth() / 3) * 3 + 3);
          if (nextRun <= now) {
            nextRun.setMonth(nextRun.getMonth() + 3);
          }
        }
        break;
      case 'yearly':
        if (dayOfMonth) {
          nextRun.setDate(dayOfMonth);
          nextRun.setMonth(0); // Janeiro
          if (nextRun <= now) {
            nextRun.setFullYear(nextRun.getFullYear() + 1);
          }
        }
        break;
    }
    
    return nextRun.toISOString();
  };

  const handleStatusChange = (scheduleId: string, newStatus: 'active' | 'paused' | 'stopped') => {
    setScheduledReports(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, status: newStatus }
        : schedule
    ));
    
    const statusText = {
      active: 'ativado',
      paused: 'pausado',
      stopped: 'parado'
    };
    
    showNotification(`Agendamento ${statusText[newStatus]} com sucesso!`, 'success');
  };

  const handleEditSchedule = (schedule: ScheduledReport) => {
    setEditingSchedule(schedule);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingSchedule) return;

    setScheduledReports(prev => prev.map(schedule => 
      schedule.id === editingSchedule.id ? editingSchedule : schedule
    ));

    setShowEditModal(false);
    setEditingSchedule(null);
    
    if (onScheduleUpdated) {
      onScheduleUpdated(editingSchedule);
    }
    
    showNotification('Agendamento atualizado com sucesso!', 'success');
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setScheduledReports(prev => prev.filter(schedule => schedule.id !== scheduleId));
    showNotification('Agendamento removido com sucesso!', 'success');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'stopped':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyText = (frequency: string, dayOfWeek?: number, dayOfMonth?: number) => {
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    switch (frequency) {
      case 'daily':
        return 'Diário';
      case 'weekly':
        return `Semanal (${daysOfWeek[dayOfWeek || 0]})`;
      case 'monthly':
        return `Mensal (dia ${dayOfMonth || 1})`;
      case 'quarterly':
        return `Trimestral (dia ${dayOfMonth || 1})`;
      case 'yearly':
        return `Anual (dia ${dayOfMonth || 1} de janeiro)`;
      default:
        return frequency;
    }
  };

  const filteredReports = scheduledReports.filter(report => {
    if (activeTab === 'active') return report.status === 'active';
    if (activeTab === 'paused') return report.status === 'paused';
    if (activeTab === 'stopped') return report.status === 'stopped';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agendamento de Relatórios</h2>
          <p className="text-gray-600">Configure relatórios automáticos e agendados</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Agendados</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledReports.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledReports.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pausados</p>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledReports.filter(s => s.status === 'paused').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Execuções</p>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledReports.reduce((sum, s) => sum + s.totalRuns, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="paused">Pausados</TabsTrigger>
          <TabsTrigger value="stopped">Parados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="space-y-4">
            {filteredReports.map((schedule) => (
              <Card key={schedule.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(schedule.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{schedule.name}</h3>
                      <p className="text-sm text-gray-600">{schedule.templateName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(schedule.status)}>
                      {schedule.status === 'active' ? 'Ativo' : schedule.status === 'paused' ? 'Pausado' : 'Parado'}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditSchedule(schedule)}
                        title="Editar agendamento"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        title="Excluir agendamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Frequência</p>
                    <p className="font-medium">{getFrequencyText(schedule.frequency, schedule.dayOfWeek, schedule.dayOfMonth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Horário</p>
                    <p className="font-medium">{schedule.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Próxima Execução</p>
                    <p className="font-medium">{new Date(schedule.nextRun).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destinatários</p>
                    <p className="font-medium">{schedule.recipients.length} email(s)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total de Execuções</p>
                    <p className="font-medium">{schedule.totalRuns}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Execuções Bem-sucedidas</p>
                    <p className="font-medium text-green-600">{schedule.successfulRuns}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Execuções Falharam</p>
                    <p className="font-medium text-red-600">{schedule.failedRuns}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Criado por {schedule.createdBy} em {new Date(schedule.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex space-x-2">
                    {schedule.status === 'active' ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(schedule.id, 'paused')}
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(schedule.id, 'stopped')}
                        >
                          <Stop className="w-4 h-4 mr-2" />
                          Parar
                        </Button>
                      </>
                    ) : schedule.status === 'paused' ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(schedule.id, 'active')}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Retomar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(schedule.id, 'stopped')}
                        >
                          <Stop className="w-4 h-4 mr-2" />
                          Parar
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(schedule.id, 'active')}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Ativar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'all' ? 'Nenhum agendamento encontrado' : 
                 activeTab === 'active' ? 'Nenhum agendamento ativo' :
                 activeTab === 'paused' ? 'Nenhum agendamento pausado' : 'Nenhum agendamento parado'}
              </h3>
              <p className="text-gray-600">
                {activeTab === 'all' ? 'Crie seu primeiro agendamento de relatório' : 
                 'Os agendamentos aparecerão aqui quando estiverem neste status'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Schedule Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Novo Agendamento"
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Agendamento *
              </label>
              <Input
                value={newSchedule.name || ''}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Relatório Diário de Vendas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template *
              </label>
              <Select
                value={newSchedule.templateId || ''}
                onValueChange={(value) => setNewSchedule(prev => ({ ...prev, templateId: value }))}
              >
                <option value="">Selecione um template</option>
                <option value="sales-performance">Performance de Vendas</option>
                <option value="customer-segmentation">Segmentação de Clientes</option>
                <option value="financial-summary">Resumo Financeiro</option>
                <option value="destination-popularity">Popularidade dos Destinos</option>
                <option value="custom">Relatório Customizado</option>
              </Select>
            </div>
          </div>

          {/* Schedule Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequência *
              </label>
              <Select
                value={newSchedule.frequency || ''}
                onValueChange={(value) => setNewSchedule(prev => ({ ...prev, frequency: value as any }))}
              >
                <option value="">Selecione a frequência</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário *
              </label>
              <Input
                type="time"
                value={newSchedule.time || ''}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          {/* Conditional Fields */}
          {newSchedule.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dia da Semana
              </label>
              <Select
                value={newSchedule.dayOfWeek?.toString() || ''}
                onValueChange={(value) => setNewSchedule(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}
              >
                <option value="0">Domingo</option>
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
                <option value="6">Sábado</option>
              </Select>
            </div>
          )}

          {(newSchedule.frequency === 'monthly' || newSchedule.frequency === 'quarterly' || newSchedule.frequency === 'yearly') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dia do Mês
              </label>
              <Input
                type="number"
                min="1"
                max="31"
                value={newSchedule.dayOfMonth || ''}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                placeholder="1-31"
              />
            </div>
          )}

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destinatários *
            </label>
            <textarea
              value={newSchedule.recipients?.join('\n') || ''}
              onChange={(e) => setNewSchedule(prev => ({ 
                ...prev, 
                recipients: e.target.value.split('\n').filter(email => email.trim()) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Digite um email por linha&#10;exemplo@reserveiviagens.com.br&#10;outro@reserveiviagens.com.br"
            />
            <p className="text-xs text-gray-500 mt-1">
              Digite um endereço de email por linha
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSchedule}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Agendamento
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Agendamento"
        size="lg"
      >
        {editingSchedule && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Agendamento
                </label>
                <Input
                  value={editingSchedule.name}
                  onChange={(e) => setEditingSchedule(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Nome do agendamento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={editingSchedule.status}
                  onValueChange={(value) => setEditingSchedule(prev => prev ? { ...prev, status: value as any } : null)}
                >
                  <option value="active">Ativo</option>
                  <option value="paused">Pausado</option>
                  <option value="stopped">Parado</option>
                </Select>
              </div>
            </div>

            {/* Schedule Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência
                </label>
                <Select
                  value={editingSchedule.frequency}
                  onValueChange={(value) => setEditingSchedule(prev => prev ? { ...prev, frequency: value as any } : null)}
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="yearly">Anual</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário
                </label>
                <Input
                  type="time"
                  value={editingSchedule.time}
                  onChange={(e) => setEditingSchedule(prev => prev ? { ...prev, time: e.target.value } : null)}
                />
              </div>
            </div>

            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinatários
              </label>
              <textarea
                value={editingSchedule.recipients.join('\n')}
                onChange={(e) => setEditingSchedule(prev => prev ? { 
                  ...prev, 
                  recipients: e.target.value.split('\n').filter(email => email.trim()) 
                } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Digite um email por linha"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export { ReportScheduler };
export type { ScheduledReport };

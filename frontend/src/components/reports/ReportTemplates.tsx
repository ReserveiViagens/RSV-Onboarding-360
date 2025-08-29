import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Save
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { useUIStore } from '../../stores/useUIStore';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'table';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastUsed: string;
  usageCount: number;
  isDefault: boolean;
  parameters: {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    required: boolean;
    options?: string[];
    defaultValue?: any;
  }[];
}

interface ReportTemplatesProps {
  onTemplateSelect?: (template: ReportTemplate) => void;
  onTemplateEdit?: (template: ReportTemplate) => void;
}

const ReportTemplates: React.FC<ReportTemplatesProps> = ({ 
  onTemplateSelect,
  onTemplateEdit 
}) => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ReportTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const { showNotification } = useUIStore();

  // Templates padrão do sistema
  const defaultTemplates: ReportTemplate[] = [
    {
      id: 'sales-performance',
      name: 'Performance de Vendas',
      description: 'Análise detalhada do desempenho de vendas por período, agente e destino',
      category: 'Vendas',
      icon: 'BarChart3',
      chartType: 'bar',
      frequency: 'monthly',
      lastUsed: '2025-01-15',
      usageCount: 45,
      isDefault: true,
      parameters: [
        { name: 'Período', type: 'select', required: true, options: ['Diário', 'Semanal', 'Mensal', 'Trimestral', 'Anual'] },
        { name: 'Data Início', type: 'date', required: true },
        { name: 'Data Fim', type: 'date', required: true },
        { name: 'Agrupar por', type: 'select', required: false, options: ['Destino', 'Agente', 'Status', 'Cliente'] }
      ]
    },
    {
      id: 'customer-segmentation',
      name: 'Segmentação de Clientes',
      description: 'Análise comportamental e segmentação dos clientes por valor e frequência',
      category: 'Clientes',
      icon: 'Users',
      chartType: 'pie',
      frequency: 'quarterly',
      lastUsed: '2025-01-10',
      usageCount: 23,
      isDefault: true,
      parameters: [
        { name: 'Segmento', type: 'select', required: false, options: ['Novos', 'Recorrentes', 'VIP', 'Inativos'] },
        { name: 'Mínimo de reservas', type: 'number', required: false, defaultValue: 1 },
        { name: 'Valor mínimo gasto', type: 'number', required: false, defaultValue: 0 },
        { name: 'Período de análise', type: 'select', required: true, options: ['6 meses', '1 ano', '2 anos', 'Todo período'] }
      ]
    },
    {
      id: 'financial-summary',
      name: 'Resumo Financeiro',
      description: 'Visão consolidada das receitas, despesas e lucros da agência',
      category: 'Financeiro',
      icon: 'DollarSign',
      chartType: 'line',
      frequency: 'monthly',
      lastUsed: '2025-01-20',
      usageCount: 67,
      isDefault: true,
      parameters: [
        { name: 'Ano', type: 'select', required: true, options: ['2024', '2025', '2026'] },
        { name: 'Incluir despesas', type: 'boolean', required: false, defaultValue: true },
        { name: 'Agrupar por mês', type: 'boolean', required: false, defaultValue: true },
        { name: 'Mostrar comparação', type: 'boolean', required: false, defaultValue: false }
      ]
    },
    {
      id: 'destination-popularity',
      name: 'Popularidade dos Destinos',
      description: 'Ranking dos destinos mais procurados e tendências de viagem',
      category: 'Destinos',
      icon: 'MapPin',
      chartType: 'bar',
      frequency: 'weekly',
      lastUsed: '2025-01-18',
      usageCount: 34,
      isDefault: true,
      parameters: [
        { name: 'Período de análise', type: 'select', required: true, options: ['Última semana', 'Último mês', 'Último trimestre', 'Último ano'] },
        { name: 'Mínimo de reservas', type: 'number', required: false, defaultValue: 5 },
        { name: 'Incluir tendências', type: 'boolean', required: false, defaultValue: true },
        { name: 'Agrupar por região', type: 'boolean', required: false, defaultValue: false }
      ]
    },
    {
      id: 'agent-performance',
      name: 'Performance dos Agentes',
      description: 'Métricas de produtividade e eficiência dos agentes de viagem',
      category: 'Operacional',
      icon: 'Users',
      chartType: 'bar',
      frequency: 'monthly',
      lastUsed: '2025-01-12',
      usageCount: 28,
      isDefault: true,
      parameters: [
        { name: 'Período', type: 'select', required: true, options: ['Mês atual', 'Último mês', 'Último trimestre', 'Último ano'] },
        { name: 'Métricas', type: 'select', required: true, options: ['Reservas', 'Receita', 'Clientes', 'Combinado'] },
        { name: 'Filtro por agente', type: 'select', required: false, options: ['Todos', 'Ativos', 'Novos'] },
        { name: 'Incluir metas', type: 'boolean', required: false, defaultValue: true }
      ]
    },
    {
      id: 'seasonal-trends',
      name: 'Tendências Sazonais',
      description: 'Análise de sazonalidade e padrões de demanda por período do ano',
      category: 'Marketing',
      icon: 'TrendingUp',
      chartType: 'area',
      frequency: 'quarterly',
      lastUsed: '2025-01-05',
      usageCount: 19,
      isDefault: true,
      parameters: [
        { name: 'Ano de análise', type: 'select', required: true, options: ['2024', '2025', '2026'] },
        { name: 'Destinos', type: 'select', required: false, options: ['Todos', 'Caldas Novas', 'Porto de Galinhas', 'Fernando de Noronha'] },
        { name: 'Tipo de análise', type: 'select', required: true, options: ['Reservas', 'Receita', 'Clientes', 'Ocupação'] },
        { name: 'Incluir previsões', type: 'boolean', required: false, defaultValue: false }
      ]
    }
  ];

  useEffect(() => {
    setTemplates(defaultTemplates);
    setFilteredTemplates(defaultTemplates);
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [selectedCategory, searchTerm, templates]);

  const filterTemplates = () => {
    let filtered = templates;

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
    showNotification(`Template "${template.name}" selecionado`, 'success');
  };

  const handleTemplateEdit = (template: ReportTemplate) => {
    setEditingTemplate(template);
    setShowEditModal(true);
  };

  const handleTemplateCopy = (template: ReportTemplate) => {
    const copiedTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Cópia)`,
      isDefault: false,
      usageCount: 0,
      lastUsed: new Date().toISOString().split('T')[0]
    };

    setTemplates(prev => [...prev, copiedTemplate]);
    showNotification('Template copiado com sucesso!', 'success');
  };

  const handleTemplateDelete = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      showNotification('Não é possível excluir templates padrão do sistema', 'error');
      return;
    }

    setTemplates(prev => prev.filter(t => t.id !== templateId));
    showNotification('Template removido com sucesso!', 'success');
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    setTemplates(prev => prev.map(t => 
      t.id === editingTemplate.id ? editingTemplate : t
    ));

    setShowEditModal(false);
    setEditingTemplate(null);
    showNotification('Template atualizado com sucesso!', 'success');
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      BarChart3,
      PieChart,
      TrendingUp,
      Users,
      DollarSign,
      MapPin,
      Clock
    };
    return iconMap[iconName] || FileText;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Vendas': 'blue',
      'Clientes': 'green',
      'Financeiro': 'purple',
      'Destinos': 'orange',
      'Operacional': 'gray',
      'Marketing': 'pink'
    };
    return colorMap[category] || 'gray';
  };

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates de Relatórios</h2>
          <p className="text-gray-600">Templates pré-definidos para relatórios comuns</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setActiveTab('favorites')}>
            <Eye className="w-4 h-4 mr-2" />
            Favoritos
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('recent')}>
            <Clock className="w-4 h-4 mr-2" />
            Recentes
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <option value="all">Todas as categorias</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = getIconComponent(template.icon);
          const categoryColor = getCategoryColor(template.category);
          
          return (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-all duration-200">
              {/* Template Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${categoryColor}-100 text-${categoryColor}-600`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <Badge variant="secondary" className={`bg-${categoryColor}-100 text-${categoryColor}-700`}>
                      {template.category}
                    </Badge>
                    {template.isDefault && (
                      <Badge variant="outline" className="ml-2 text-xs">Padrão</Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTemplateSelect(template)}
                    title="Usar template"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTemplateEdit(template)}
                    title="Editar template"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTemplateCopy(template)}
                    title="Copiar template"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {!template.isDefault && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTemplateDelete(template.id)}
                      title="Excluir template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Template Content */}
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

              {/* Template Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Tipo de gráfico:</span>
                  <span className="font-medium capitalize">{template.chartType}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Frequência:</span>
                  <span className="font-medium capitalize">{template.frequency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Parâmetros:</span>
                  <span className="font-medium">{template.parameters.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Usado:</span>
                  <span className="font-medium">{template.usageCount} vezes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Último uso:</span>
                  <span className="font-medium">{template.lastUsed}</span>
                </div>
              </div>

              {/* Template Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleTemplateSelect(template)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Usar Template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTemplateEdit(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Não há templates disponíveis no momento'
            }
          </p>
        </div>
      )}

      {/* Edit Template Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Template"
        size="lg"
      >
        {editingTemplate && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Template
                </label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Nome do template"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <Select
                  value={editingTemplate.category}
                  onValueChange={(value) => setEditingTemplate(prev => prev ? { ...prev, category: value } : null)}
                >
                  <option value="Vendas">Vendas</option>
                  <option value="Clientes">Clientes</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Destinos">Destinos</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Marketing">Marketing</option>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={editingTemplate.description}
                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descrição do template"
              />
            </div>

            {/* Chart Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Gráfico
              </label>
              <Select
                value={editingTemplate.chartType}
                onValueChange={(value) => setEditingTemplate(prev => prev ? { ...prev, chartType: value as any } : null)}
              >
                <option value="bar">Barras</option>
                <option value="line">Linha</option>
                <option value="pie">Pizza</option>
                <option value="area">Área</option>
                <option value="table">Tabela</option>
              </Select>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequência de Uso
              </label>
              <Select
                value={editingTemplate.frequency}
                onValueChange={(value) => setEditingTemplate(prev => prev ? { ...prev, frequency: value as any } : null)}
              >
                <option value="once">Uma vez</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export { ReportTemplates };
export type { ReportTemplate };

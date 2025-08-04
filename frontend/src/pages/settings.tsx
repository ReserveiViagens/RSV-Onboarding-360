import React, { useState, useEffect } from 'react';
import { 
    Settings, 
    Save, 
    RefreshCw, 
    Database, 
    Shield, 
    Bell, 
    Palette, 
    Globe, 
    CreditCard, 
    Users,
    Building,
    FileText,
    Lock,
    Eye,
    EyeOff,
    Check,
    X,
    AlertCircle,
    Info,
    Trash2,
    Edit,
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    Calendar,
    Clock,
    Star,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';
import NavigationButtons from '../components/NavigationButtons';

interface Setting {
    id: string;
    name: string;
    description: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'textarea';
    value: any;
    category: string;
    required: boolean;
    options?: string[];
}

interface SettingCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    description: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [categories, setCategories] = useState<SettingCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('geral');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [backupGenerating, setBackupGenerating] = useState(false);
    const [restoreProcessing, setRestoreProcessing] = useState(false);

    useEffect(() => {
        loadSettings();
        loadCategories();
    }, []);

    const loadSettings = () => {
        // Simular carregamento de configurações
        const mockSettings: Setting[] = [
            // Configurações Gerais
            {
                id: 'company_name',
                name: 'Nome da Empresa',
                description: 'Nome oficial da empresa',
                type: 'text',
                value: 'Reservei Viagens',
                category: 'geral',
                required: true
            },
            {
                id: 'company_email',
                name: 'Email da Empresa',
                description: 'Email de contato principal',
                type: 'text',
                value: 'contato@reserveiviagens.com',
                category: 'geral',
                required: true
            },
            {
                id: 'company_phone',
                name: 'Telefone da Empresa',
                description: 'Telefone de contato principal',
                type: 'text',
                value: '(11) 99999-9999',
                category: 'geral',
                required: true
            },
            {
                id: 'company_address',
                name: 'Endereço da Empresa',
                description: 'Endereço completo da empresa',
                type: 'textarea',
                value: 'Rua das Viagens, 123 - São Paulo, SP',
                category: 'geral',
                required: true
            },
            {
                id: 'timezone',
                name: 'Fuso Horário',
                description: 'Fuso horário padrão do sistema',
                type: 'select',
                value: 'America/Sao_Paulo',
                category: 'geral',
                required: true,
                options: ['America/Sao_Paulo', 'UTC', 'America/New_York', 'Europe/London']
            },
            {
                id: 'language',
                name: 'Idioma Padrão',
                description: 'Idioma padrão do sistema',
                type: 'select',
                value: 'pt-BR',
                category: 'geral',
                required: true,
                options: ['pt-BR', 'en-US', 'es-ES']
            },

            // Configurações de Segurança
            {
                id: 'password_min_length',
                name: 'Tamanho Mínimo de Senha',
                description: 'Tamanho mínimo para senhas de usuários',
                type: 'number',
                value: 8,
                category: 'seguranca',
                required: true
            },
            {
                id: 'password_require_special',
                name: 'Requer Caracteres Especiais',
                description: 'Senhas devem conter caracteres especiais',
                type: 'boolean',
                value: true,
                category: 'seguranca',
                required: true
            },
            {
                id: 'session_timeout',
                name: 'Timeout de Sessão (minutos)',
                description: 'Tempo de inatividade antes do logout',
                type: 'number',
                value: 30,
                category: 'seguranca',
                required: true
            },
            {
                id: 'two_factor_auth',
                name: 'Autenticação de Dois Fatores',
                description: 'Habilitar 2FA para todos os usuários',
                type: 'boolean',
                value: false,
                category: 'seguranca',
                required: true
            },
            {
                id: 'max_login_attempts',
                name: 'Tentativas Máximas de Login',
                description: 'Número máximo de tentativas de login',
                type: 'number',
                value: 5,
                category: 'seguranca',
                required: true
            },

            // Configurações de Notificações
            {
                id: 'email_notifications',
                name: 'Notificações por Email',
                description: 'Habilitar notificações por email',
                type: 'boolean',
                value: true,
                category: 'notificacoes',
                required: true
            },
            {
                id: 'sms_notifications',
                name: 'Notificações por SMS',
                description: 'Habilitar notificações por SMS',
                type: 'boolean',
                value: false,
                category: 'notificacoes',
                required: true
            },
            {
                id: 'push_notifications',
                name: 'Notificações Push',
                description: 'Habilitar notificações push',
                type: 'boolean',
                value: true,
                category: 'notificacoes',
                required: true
            },
            {
                id: 'notification_sound',
                name: 'Som de Notificação',
                description: 'Reproduzir som nas notificações',
                type: 'boolean',
                value: true,
                category: 'notificacoes',
                required: true
            },

            // Configurações de Pagamento
            {
                id: 'payment_currency',
                name: 'Moeda Padrão',
                description: 'Moeda padrão para pagamentos',
                type: 'select',
                value: 'BRL',
                category: 'pagamento',
                required: true,
                options: ['BRL', 'USD', 'EUR', 'GBP']
            },
            {
                id: 'payment_methods',
                name: 'Métodos de Pagamento',
                description: 'Métodos de pagamento aceitos',
                type: 'select',
                value: 'credit_card',
                category: 'pagamento',
                required: true,
                options: ['credit_card', 'pix', 'bank_transfer', 'all']
            },
            {
                id: 'auto_approve_payments',
                name: 'Aprovação Automática',
                description: 'Aprovar pagamentos automaticamente',
                type: 'boolean',
                value: false,
                category: 'pagamento',
                required: true
            },

            // Configurações de Backup
            {
                id: 'auto_backup',
                name: 'Backup Automático',
                description: 'Realizar backup automático diário',
                type: 'boolean',
                value: true,
                category: 'backup',
                required: true
            },
            {
                id: 'backup_retention_days',
                name: 'Retenção de Backup (dias)',
                description: 'Dias para manter backups',
                type: 'number',
                value: 30,
                category: 'backup',
                required: true
            },
            {
                id: 'backup_encryption',
                name: 'Criptografia de Backup',
                description: 'Criptografar arquivos de backup',
                type: 'boolean',
                value: true,
                category: 'backup',
                required: true
            }
        ];

        setSettings(mockSettings);
    };

    const loadCategories = () => {
        const mockCategories: SettingCategory[] = [
            {
                id: 'geral',
                name: 'Configurações Gerais',
                icon: <Settings className="w-5 h-5" />,
                color: 'bg-blue-100 text-blue-600',
                description: 'Configurações básicas da empresa'
            },
            {
                id: 'seguranca',
                name: 'Segurança',
                icon: <Shield className="w-5 h-5" />,
                color: 'bg-red-100 text-red-600',
                description: 'Configurações de segurança e autenticação'
            },
            {
                id: 'notificacoes',
                name: 'Notificações',
                icon: <Bell className="w-5 h-5" />,
                color: 'bg-yellow-100 text-yellow-600',
                description: 'Configurações de notificações'
            },
            {
                id: 'pagamento',
                name: 'Pagamentos',
                icon: <CreditCard className="w-5 h-5" />,
                color: 'bg-green-100 text-green-600',
                description: 'Configurações de pagamento'
            },
            {
                id: 'backup',
                name: 'Backup',
                icon: <Database className="w-5 h-5" />,
                color: 'bg-purple-100 text-purple-600',
                description: 'Configurações de backup e restauração'
            }
        ];

        setCategories(mockCategories);
    };

    const handleSettingChange = (settingId: string, newValue: any) => {
        setSettings(prev => prev.map(setting => 
            setting.id === settingId 
                ? { ...setting, value: newValue }
                : setting
        ));
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        
        // Simular salvamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        alert('Configurações salvas com sucesso!');
        setShowSaveModal(false);
        setSaving(false);
    };

    const handleResetSettings = async () => {
        setLoading(true);
        
        // Simular reset
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        loadSettings(); // Recarregar configurações padrão
        alert('Configurações resetadas para os valores padrão!');
        setShowResetModal(false);
        setLoading(false);
    };

    const handleCreateBackup = async () => {
        setBackupGenerating(true);
        
        // Simular criação de backup
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const filename = `backup-configuracoes-${new Date().toISOString().split('T')[0]}.json`;
        const content = JSON.stringify(settings, null, 2);
        
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert(`Backup criado com sucesso: ${filename}`);
        setShowBackupModal(false);
        setBackupGenerating(false);
    };

    const handleRestoreBackup = async (file: File) => {
        setRestoreProcessing(true);
        
        try {
            const content = await file.text();
            const restoredSettings = JSON.parse(content);
            
            // Simular processamento
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setSettings(restoredSettings);
            alert('Backup restaurado com sucesso!');
        } catch (error) {
            alert('Erro ao restaurar backup. Verifique se o arquivo é válido.');
        }
        
        setShowRestoreModal(false);
        setRestoreProcessing(false);
    };

    const getFilteredSettings = () => {
        return settings.filter(setting => {
            const matchesCategory = selectedCategory === 'all' || setting.category === selectedCategory;
            const matchesSearch = setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                setting.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    };

    const getCategorySettings = (categoryId: string) => {
        return settings.filter(setting => setting.category === categoryId);
    };

    const renderSettingInput = (setting: Setting) => {
        switch (setting.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={setting.description}
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                    />
                );
            case 'boolean':
                return (
                    <div className="flex items-center">
                        <button
                            onClick={() => handleSettingChange(setting.id, !setting.value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                setting.value ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    setting.value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <span className="ml-2 text-sm text-gray-600">
                            {setting.value ? 'Ativado' : 'Desativado'}
                        </span>
                    </div>
                );
            case 'select':
                return (
                    <select
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {setting.options?.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            case 'textarea':
                return (
                    <textarea
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder={setting.description}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavigationButtons />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
                            <p className="mt-2 text-gray-600">
                                Gerencie todas as configurações do sistema Onion 360
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowBackupModal(true)}
                                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                title="Criar backup das configurações"
                            >
                                <Database className="h-4 w-4 mr-2" />
                                Backup
                            </button>
                            <button
                                onClick={() => setShowRestoreModal(true)}
                                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                title="Restaurar configurações de backup"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Restaurar
                            </button>
                            <button
                                onClick={() => setShowResetModal(true)}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                title="Resetar todas as configurações"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Resetar
                            </button>
                            <button
                                onClick={() => setShowSaveModal(true)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                title="Salvar todas as alterações"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar configurações..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="sm:w-64">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todas as Categorias</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Categorias */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                                selectedCategory === category.id
                                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            <div className="flex items-center mb-4">
                                <div className={`p-2 rounded-lg ${category.color}`}>
                                    {category.icon}
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {getCategorySettings(category.id).length} configurações
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{category.description}</p>
                            
                            {/* Indicador de seleção */}
                            {selectedCategory === category.id && (
                                <div className="mt-3 flex items-center text-blue-600">
                                    <Check className="h-4 w-4 mr-2" />
                                    <span className="text-sm font-medium">Selecionado</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Configurações */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {selectedCategory === 'all' ? 'Todas as Configurações' : 
                                 categories.find(c => c.id === selectedCategory)?.name}
                            </h2>
                            {selectedCategory !== 'all' && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {getCategorySettings(selectedCategory).length} configurações
                                    </span>
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Ver todas
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-8">
                                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Carregando configurações...</p>
                            </div>
                        ) : getFilteredSettings().length === 0 ? (
                            <div className="text-center py-8">
                                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Nenhuma configuração encontrada</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Tente ajustar os filtros ou selecione outra categoria
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {getFilteredSettings().map(setting => (
                                    <div key={setting.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-1">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {setting.name}
                                                    </h3>
                                                    {setting.required && (
                                                        <span className="ml-2 text-red-500">*</span>
                                                    )}
                                                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                                        {setting.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{setting.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Categoria: {setting.category}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleSettingChange(setting.id, setting.value)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Resetar valor"
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            {renderSettingInput(setting)}
                                        </div>
                                        
                                        {/* Status da configuração */}
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                                    setting.required 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {setting.required ? 'Obrigatório' : 'Opcional'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    ID: {setting.id}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        // Simular aplicação da configuração
                                                        alert(`Configuração "${setting.name}" aplicada com sucesso!`);
                                                    }}
                                                    className="text-xs text-green-600 hover:text-green-800 transition-colors"
                                                >
                                                    Aplicar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Salvar */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <Save className="h-6 w-6 text-blue-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Salvar Configurações</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Tem certeza que deseja salvar todas as alterações nas configurações?
                        </p>
                        
                        {/* Lista de configurações alteradas */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Configurações que serão salvas:</h4>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                                {settings.slice(0, 5).map(setting => (
                                    <div key={setting.id} className="flex items-center text-sm">
                                        <Check className="h-3 w-3 text-green-600 mr-2" />
                                        <span className="text-gray-600">{setting.name}</span>
                                    </div>
                                ))}
                                {settings.length > 5 && (
                                    <div className="text-xs text-gray-500">
                                        ... e mais {settings.length - 5} configurações
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                disabled={saving}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? (
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Reset */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Resetar Configurações</h3>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600 mb-3">
                                Tem certeza que deseja resetar todas as configurações para os valores padrão?
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center">
                                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                                    <span className="text-sm text-red-800 font-medium">Atenção!</span>
                                </div>
                                <p className="text-sm text-red-700 mt-1">
                                    Esta ação não pode ser desfeita e afetará todas as configurações do sistema.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleResetSettings}
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4 mr-2" />
                                )}
                                {loading ? 'Resetando...' : 'Resetar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Backup */}
            {showBackupModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <Database className="h-6 w-6 text-purple-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Criar Backup</h3>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600 mb-3">
                                Criar um backup de todas as configurações atuais do sistema?
                            </p>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <div className="flex items-center">
                                    <Info className="h-4 w-4 text-purple-600 mr-2" />
                                    <span className="text-sm text-purple-800 font-medium">Informação</span>
                                </div>
                                <p className="text-sm text-purple-700 mt-1">
                                    O backup incluirá todas as configurações atuais e será salvo como arquivo JSON.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowBackupModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateBackup}
                                disabled={backupGenerating}
                                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {backupGenerating ? (
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4 mr-2" />
                                )}
                                {backupGenerating ? 'Criando...' : 'Criar Backup'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Restaurar */}
            {showRestoreModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <RefreshCw className="h-6 w-6 text-orange-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Restaurar Backup</h3>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600 mb-3">
                                Selecione um arquivo de backup para restaurar as configurações:
                            </p>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <div className="flex items-center">
                                    <AlertCircle className="h-4 w-4 text-orange-600 mr-2" />
                                    <span className="text-sm text-orange-800 font-medium">Atenção!</span>
                                </div>
                                <p className="text-sm text-orange-700 mt-1">
                                    Esta ação substituirá todas as configurações atuais pelas do backup.
                                </p>
                            </div>
                        </div>
                        
                        <input
                            type="file"
                            accept=".json"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleRestoreBackup(file);
                                }
                            }}
                            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRestoreModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={restoreProcessing}
                                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                            >
                                {restoreProcessing ? (
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Upload className="h-4 w-4 mr-2" />
                                )}
                                {restoreProcessing ? 'Restaurando...' : 'Restaurar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 
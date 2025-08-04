import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
    const { login, isLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const success = await login(email, password);
            if (success) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            setError('Credenciais inválidas. Tente novamente.');
        }
    };

    const handleDemoLogin = async () => {
        try {
            // Login de demonstração sem backend
            const success = await login('demo@onionrsv.com', 'demo123');
            if (success) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Erro no login demo:', error);
            setError('Erro ao acessar demo. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                        <span className="text-2xl">🚀</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Onion RSV 360
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sistema de Gestão Turística
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Senha"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            🎯 Acessar Demo (Sem Backend)
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">
                        <strong>Credenciais de demonstração:</strong>
                    </p>
                    <div className="bg-gray-50 rounded-md p-3 text-xs text-gray-600">
                        <p><strong>Demo:</strong> demo@onionrsv.com / demo123</p>
                        <p><strong>Admin:</strong> admin@onionrsv.com / admin123</p>
                        <p><strong>Teste:</strong> test@onion360.com / test123</p>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Sistema Onion RSV 360 v2.2.18
                    </p>
                </div>
            </div>
        </div>
    );
} 
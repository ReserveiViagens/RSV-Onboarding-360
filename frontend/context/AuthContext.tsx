import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  permissions: string[];
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  accessToken: string | null;
  refreshToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  // Verificar se há token salvo no localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setAccessToken(savedToken);
        setRefreshToken(localStorage.getItem('refresh_token'));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Modo DEMO - Autenticação local
      let userData: User;
      
      if (email === 'admin@onion360.com' && password === 'admin123') {
        userData = {
          id: 1,
          email: 'admin@onion360.com',
          full_name: 'Administrador Onion 360',
          is_active: true,
          permissions: ['admin', 'user'],
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        };
      } else if (email === 'demo@onionrsv.com' && password === 'demo123') {
        userData = {
          id: 2,
          email: 'demo@onionrsv.com',
          full_name: 'Usuário Demo',
          is_active: true,
          permissions: ['admin'],
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        };
      } else {
        throw new Error('Credenciais inválidas');
      }

      // Salvar dados no localStorage
      const token = `demo-token-${Date.now()}`;
      const refreshToken = `demo-refresh-${Date.now()}`;
      
      localStorage.setItem('access_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setAccessToken(token);
      setRefreshToken(refreshToken);
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    accessToken,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 
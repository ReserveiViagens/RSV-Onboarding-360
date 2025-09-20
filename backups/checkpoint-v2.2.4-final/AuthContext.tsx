import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, full_name: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Verificar token armazenado ao inicializar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');
        
        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          
          // Verificar se o token ainda é válido
          const isValid = await verifyToken(storedAccessToken);
          if (isValid) {
            await fetchUserData(storedAccessToken);
          } else {
            // Tentar renovar o token
            await refreshAccessToken(storedRefreshToken);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Renovação automática de token
  useEffect(() => {
    if (!accessToken) return;

    const tokenRefreshInterval = setInterval(async () => {
      try {
        if (refreshToken) {
          await refreshAccessToken(refreshToken);
        }
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        logout();
      }
    }, 25 * 60 * 1000); // Renovar 5 minutos antes da expiração (30 min - 5 min)

    return () => clearInterval(tokenRefreshInterval);
  }, [accessToken, refreshToken]);

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/core/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error('Falha ao buscar dados do usuário');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  };

  const refreshAccessToken = async (refreshTokenValue: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/core/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshTokenValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Buscar dados atualizados do usuário
        await fetchUserData(data.access_token);
      } else {
        throw new Error('Falha ao renovar token');
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/core/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Buscar dados do usuário
        await fetchUserData(data.access_token);
        
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha no login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, full_name: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, full_name, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha no registro');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!accessToken) throw new Error('Token não disponível');

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao atualizar usuário');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!accessToken) throw new Error('Token não disponível');

      const response = await fetch(`${API_BASE_URL}/api/users/me/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao alterar senha');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    isAuthenticated: !!user,
    refreshToken: () => refreshToken ? refreshAccessToken(refreshToken) : Promise.resolve(),
    updateUser,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 
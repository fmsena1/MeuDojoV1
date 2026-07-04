import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  login: (dto: any) => Promise<void>;
  registerTenant: (dto: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = localStorage.getItem('@MeuDojo:user');
      const storagedToken = localStorage.getItem('@MeuDojo:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        // Opcional: Validar token com chamada para /auth/me se necessário
        try {
          const response = await api.get('/auth/me');
          // Atualiza dados caso tenham mudado
          const updatedUser = {
            ...JSON.parse(storagedUser),
            ...response.data,
          };
          setUser(updatedUser);
          localStorage.setItem('@MeuDojo:user', JSON.stringify(updatedUser));
        } catch (error) {
          // Token inválido/expirou no backend, desloga
          logout();
        }
      }
      setIsInitialLoading(false);
    }

    loadStorageData();
  }, []);

  const login = async (dto: any) => {
    const response = await api.post('/auth/login', dto);
    const { access_token, user: loggedUser } = response.data;

    localStorage.setItem('@MeuDojo:token', access_token);
    localStorage.setItem('@MeuDojo:user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const registerTenant = async (dto: any) => {
    const response = await api.post('/auth/register', dto);
    const { access_token, user: loggedUser } = response.data;

    localStorage.setItem('@MeuDojo:token', access_token);
    localStorage.setItem('@MeuDojo:user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem('@MeuDojo:token');
    localStorage.removeItem('@MeuDojo:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitialLoading,
        login,
        registerTenant,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

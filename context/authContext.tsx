// context/authContext.tsx
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userToken: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Cargar el token al iniciar la aplicación
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error("Error cargando el token", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // 2. Función para iniciar sesión
  const login = async (token: string) => {
    try {
      await SecureStore.setItemAsync('user_token', token);
      setUserToken(token);
    } catch (e) {
      console.error("Error guardando el token", e);
    }
  };

  // 3. Función para cerrar sesión
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
      setUserToken(null);
    } catch (e) {
      console.error("Error eliminando el token", e);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!userToken, 
      isLoading, 
      userToken, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
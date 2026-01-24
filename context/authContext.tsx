// context/authContext.tsx
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  userToken: string | null;
  isNewUser: boolean;
  isLoading: boolean;
  setToken: (token: string) => Promise<void>;
  login: (token: string, isNew: boolean) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 👈 Importante para evitar parpadeos

  useEffect(() => {
    // Función para cargar el token desde el almacenamiento persistente
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error("Error cargando el token", e);
      } finally {
        setIsLoading(false); // Terminamos de buscar, sea que lo encontró o no
      }
    };

    loadToken();
  }, []);

  const login = async (token: string, isNew: boolean) => {
    await SecureStore.setItemAsync('userToken', String(token));
    console.log("Token guardado:", token);
    setUserToken(token);
    setIsNewUser(isNew);
  };
const setToken = async (token: string) => {
    await SecureStore.setItemAsync('userToken', String(token));
    console.log("Token guardado:", token);
    setUserToken(token);
  }
const logout = async () => {
  await SecureStore.deleteItemAsync('userToken'); // Borra de la memoria física
  setUserToken(null); // Borra del estado global (esto disparará la navegación al Login)
};

  const completeOnboarding = () => setIsNewUser(false);

  return (
    <AuthContext.Provider value={{ isLoading, userToken, isNewUser, login, setToken, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
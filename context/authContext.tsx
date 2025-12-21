// context/authContext.tsx
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  userToken: string | null;
  isNewUser: boolean;
  login: (token: string, isNew: boolean) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const login = async (token: string, isNew: boolean) => {
    await SecureStore.setItemAsync('userToken', String(token));
    console.log("Token guardado:", token);
    setUserToken(token);
    setIsNewUser(isNew);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUserToken(null);
  };

  const completeOnboarding = () => setIsNewUser(false);

  return (
    <AuthContext.Provider value={{ userToken, isNewUser, login, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
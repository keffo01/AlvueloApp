// context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth'; // Importamos tu hook


interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    signIn: () => void; // Función para iniciar sesión (usaremos la de Google)
    signOut: () => void;
    isLoading: boolean; // 💡 Nuevo estado para indicar si se está cargando
}

// Valores por defecto
const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 💡 Usamos tu lógica de Google Auth
    const { userToken, signInWithGoogle } = useGoogleAuth(); 
    const [isLoading, setIsLoading] = useState(true); // 💡 NUEVO ESTADO DE CARGA
    
    // Estado real del token, lo inicializamos con el token de Google (o con AsyncStorage)
    const [token, setToken] = useState<string | null>(null); 
    const isAuthenticated = !!token;

    useEffect(() => {
        // Simulación de carga (Aquí leerías AsyncStorage)
        const loadToken = async () => {
            // const storedToken = await AsyncStorage.getItem('user_token');
            // setToken(storedToken);
            // setToken(userToken); // Si lo tienes sincronizado con Google Auth
            setIsLoading(false); // 💡 ESTO DEBE SER LLAMADO SIEMPRE AL FINAL
        };
        loadToken();
    }, []);

    const signIn = () => {
        // Inicia el proceso de Google
        signInWithGoogle(); 
    };

    const signOut = () => {
        // Lógica de cierre de sesión: limpiar token, AsyncStorage, etc.
        setToken(null); 
        // Lógica de desautenticación de Google si es necesaria
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
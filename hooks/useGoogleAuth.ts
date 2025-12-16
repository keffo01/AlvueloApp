// hooks/useGoogleAuth.ts

import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// 🚨 REEMPLAZA ESTO CON TUS IDS DE CLIENTE REALES
// Puedes usar el mismo Web Client ID para todos en desarrollo con Expo Go
const GOOGLE_WEB_CLIENT_ID = '1078282422673-d5dqhf0gc9f7k05vcbmq2oghk7vpsm7t.apps.googleusercontent.com';
// 💡 NECESITAS ESTE ID PARA ANDROID
const GOOGLE_ANDROID_CLIENT_ID = '1078282422673-c3nsfarsog4f19u6ajk09rjfkokjbnrl.apps.googleusercontent.com';
export const useGoogleAuth = () => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    
    // Configuración de Google
    const [request, response, promptAsync] = Google.useAuthRequest({
            androidClientId: GOOGLE_ANDROID_CLIENT_ID});

    const redirectUri = makeRedirectUri({ useProxy: true } as any);
    console.log("URI DE REDIRECCIÓN ACTUAL:", redirectUri); // 💡 VERIFICA ESTA SALIDA EN TU CONSOLA DE EXPO

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                // Obtener información del usuario usando el token de acceso
                fetchUserInfo(authentication.accessToken);
            }
        } else if (response?.type === 'error') {
            setIsAuthenticating(false);
            Alert.alert('Error de Autenticación', 'No se pudo completar el inicio de sesión con Google.');
            console.error('Error de autenticación de Google:', response.error);
        }
    }, [response]);

    // Función para obtener los detalles del usuario después de la autenticación
    const fetchUserInfo = async (accessToken: string) => {
        try {
            setIsAuthenticating(true);
            const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userInfo = await userInfoResponse.json();
            
            // 💡 Aquí manejarías la lógica de tu backend:
            // 1. Envías 'userInfo' y 'accessToken' a tu API de backend.
            // 2. Tu API verifica/registra al usuario y devuelve un token JWT propio.
            // 3. Guardas ese token JWT.

            // Simulación: Asignar el nombre del usuario como el token de sesión (solo para prueba)
            console.log("Usuario autenticado:", userInfo);
            setUserToken(userInfo.name); 

        } catch (error) {
            console.error("Error al obtener info del usuario:", error);
            Alert.alert('Error', 'No se pudo obtener la información del usuario.');
        } finally {
            setIsAuthenticating(false);
        }
    };
    
    // Función de Login/Registro
    const signInWithGoogle = () => {
        if (isAuthenticating) return;
        // La función promptAsync es la que inicia el flujo de OAuth
        promptAsync();
    };

    return {
        userToken,
        isAuthenticating,
        signInWithGoogle,
        isGoogleRequestReady: !!request, // Habilita el botón solo si la solicitud está lista
    };
};
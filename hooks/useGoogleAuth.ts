// hooks/useGoogleAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// 💡 TU ID DE CLIENTE (Asegúrate de que sea el correcto)
const GOOGLE_ANDROID_CLIENT_ID = '1078282422673-c3nsfarsog4f19u6ajk09rjfkokjbnrl.apps.googleusercontent.com';
const GOOGLE_WEB_CLIENT_ID = '1078282422673-d5dqhf0gc9f7k05vcbmq2oghk7vpsm7t.apps.googleusercontent.com';
 const redirectUri = 'https://auth.expo.dev/@alvuelo/alvueloapp';
const AWS_API_ENDPOINT = 'https://ax5tvoeyb0.execute-api.us-east-2.amazonaws.com/dev';
export const useGoogleAuth = () => {

    const [userToken, setUserToken] = useState<string | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    
    const [request, response, promptAsync] = Google.useAuthRequest({
        // 2. ⚠️ conectamos al cliente android, tambien se puede al cliente ios si es necesario
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,  
        scopes: ['email', 'profile'],
        });

    useEffect(() => {
        // ... (Tu código del useEffect se mantiene igual)
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                fetchUserInfo(authentication.accessToken);
            }
        } else if (response?.type === 'error') {
            setIsAuthenticating(false);
            Alert.alert('Error', 'Fallo en la autenticación de Google');
            console.error('Auth Error:', response.error);
        }
    }, [response]);

const fetchUserInfo = async (accessToken: string) => {
    try {
        setIsAuthenticating(true);

        // 🚨 1. Llamada a tu endpoint de AWS
        const backendResponse = await fetch(AWS_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Envías el token de Google a tu Lambda
            body: JSON.stringify({
                googleAccessToken: accessToken,
            }),
        });

        const data = await backendResponse.json();

        if (backendResponse.ok && data.sessionToken) {
            // 2. Guardar el token JWT propio en AsyncStorage
            await AsyncStorage.setItem('user_token', data.sessionToken);
            
            // 3. Actualizar el estado para ir al Home
            setUserToken(data.sessionToken); 
            console.log("Login exitoso. Token de sesión guardado.");
        } else {
            // Manejar errores devueltos por la Lambda/API Gateway
            Alert.alert('Error', data.message || 'Fallo en el servidor AWS');
        }

    } catch (error) {
        console.error("Error de red/AWS:", error);
        Alert.alert('Error', 'No se pudo contactar el servicio de login.');
    } finally {
        setIsAuthenticating(false);
    }
};

    const signInWithGoogle = () => {
         // ...
         promptAsync();
    };

    return {
        userToken,
        isAuthenticating,
        signInWithGoogle,
        isGoogleRequestReady: !!request,
    };
};
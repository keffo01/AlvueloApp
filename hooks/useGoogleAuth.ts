import { useAuth } from '@/context/authContext';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_ANDROID_CLIENT_ID = '1078282422673-c3nsfarsog4f19u6ajk09rjfkokjbnrl.apps.googleusercontent.com';
const GOOGLE_WEB_CLIENT_ID = '1078282422673-d5dqhf0gc9f7k05vcbmq2oghk7vpsm7t.apps.googleusercontent.com';

const AWS_API_ENDPOINT = 'https://ax5tvoeyb0.execute-api.us-east-2.amazonaws.com/dev';

export const useGoogleAuth = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const { login } = useAuth();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    });
    console.log("Google Auth Response:", response);

    useEffect(() => {
        // Solo actuamos si hay una respuesta real (success o error)
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                sendTokenToBackend(authentication.accessToken);
            }
        } else if (response?.type === 'error') {
            setIsAuthenticating(false);
            Alert.alert('Error', 'Fallo en la autenticación de Google');
            console.log("Auth Error Details:", response.error);
        }
    }, [response]);

    const sendTokenToBackend = async (googleToken: string) => {
        try {
            setIsAuthenticating(true);

            // 1. Enviamos el token a TU BACKEND en AWS
            const backendResponse = await fetch(AWS_API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ googleAccessToken: googleToken }),
            });

            const data = await backendResponse.json();

            if (backendResponse.ok && data.sessionToken) {
                // 2. Guardamos el token de sesión generado por tu Lambda
                await login(data.sessionToken); 
                console.log("Login exitoso en AWS y DynamoDB");
            } else {
                Alert.alert('Error', data.message || 'Error en el servidor AWS');
            }

        } catch (error) {
            console.error("Error de red/AWS:", error);
            Alert.alert('Error', 'No se pudo conectar con el servidor.');
        } finally {
            setIsAuthenticating(false);
        }
    };

    const signInWithGoogle = () => {
        setIsAuthenticating(true);
        promptAsync();
    };

    return {
        isAuthenticating,
        signInWithGoogle,
        isGoogleRequestReady: !!request,
    };
};
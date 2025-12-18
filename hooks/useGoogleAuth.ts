// hooks/useGoogleAuth.ts
import { useAuth } from '@/context/authContext';
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
    const { login } = useAuth();

    const [request, response, promptAsync] = Google.useAuthRequest({
        // 2. ⚠️ conectamos al cliente android, tambien se puede al cliente ios si es necesario
        webClientId: GOOGLE_WEB_CLIENT_ID,
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,  
        });

    useEffect(() => {
       
        handleLogin();
       
    }, [response]);

const handleLogin = () =>{
     console.log("Google Auth Response:", response);
     if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                fetchUserInfo(authentication.accessToken);
            }
        } else {
            setIsAuthenticating(false);
            Alert.alert('Error', 'Fallo en la autenticación de Google');
          //  console.error('Auth Error:', response.error);
        }
}

const fetchUserInfo = async (accessToken: string) => {
    if(!accessToken) return;
    try {
        setIsAuthenticating(true);
        const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userInfo = await userInfoResponse.json();
            login(userInfo.accessToken);   // 💡 Usar la función login del contexto para guardar el token
            console.log("Info Usuario:", userInfo);

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
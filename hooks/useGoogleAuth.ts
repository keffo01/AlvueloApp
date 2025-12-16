// hooks/useGoogleAuth.ts
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// 💡 TU ID DE CLIENTE (Asegúrate de que sea el correcto)
const GOOGLE_ANDROID_CLIENT_ID = '1078282422673-c3nsfarsog4f19u6ajk09rjfkokjbnrl.apps.googleusercontent.com';
const GOOGLE_WEB_CLIENT_ID = '1078282422673-d5dqhf0gc9f7k05vcbmq2oghk7vpsm7t.apps.googleusercontent.com';
 const redirectUri = 'https://auth.expo.dev/@alvuelo/alvueloapp';

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

    // ... (El resto de tus funciones fetchUserInfo y signInWithGoogle se mantienen igual)
    const fetchUserInfo = async (accessToken: string) => {
        // ... (tu lógica existente)
        try {
            // ...
            const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userInfo = await userInfoResponse.json();
            setUserToken(userInfo.name);
        } catch (e) {
            console.error(e);
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
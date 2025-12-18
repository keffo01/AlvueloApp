// app/AuthScreen.tsx (o app/login/index.tsx)

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

const AuthScreen: React.FC = () => {
    const { userToken, isAuthenticating, signInWithGoogle, isGoogleRequestReady } = useGoogleAuth();
   
    // Reemplaza la llamada a signInWithGoogle con la llamada a signIn del contexto
    const handleGoogleSignIn = () => {
        signInWithGoogle();
    };

    // Redirigir si el usuario se autenticó
    useEffect(() => {
        if (userToken) {
            // Reemplaza la pila para que el usuario no pueda volver al login
            router.replace('/'); 
        }
    }, [userToken]);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false, title: "Iniciar Sesión" }} />

            <View style={styles.header}>
                <Ionicons name="lock-closed" size={100} color={Colors.primary} />
                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>Inicia sesión o regístrate con Google</Text>
            </View>

            {/* Botón de Google */}
            <TouchableOpacity
                style={[styles.googleButton, isAuthenticating || !isGoogleRequestReady ? styles.disabledButton : {}]}
                onPress={signInWithGoogle}
                disabled={isAuthenticating || !isGoogleRequestReady}
            >
                {isAuthenticating ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                    <>
                        <Ionicons name="logo-google" size={24} color={Colors.white} style={styles.googleIcon} />
                        <Text style={styles.buttonText}>Continuar con Google</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Opciones de Registro / Login Manual (para completar) */}
            <TouchableOpacity style={styles.linkButton} 
           onPress={handleGoogleSignIn} // 💡 Usar el handler que llama a signIn()
           >
                <Text style={styles.linkText}>Usar correo electrónico / contraseña</Text>
            </TouchableOpacity>

        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Sizes.largePadding,
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: 'center',
        marginBottom: Sizes.padding * 4,
    },
    title: {
        fontSize: Sizes.header,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: Sizes.padding,
    },
    subtitle: {
        fontSize: Sizes.font,
        color: Colors.lightText,
        marginTop: Sizes.smallPadding,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        paddingVertical: Sizes.padding,
        paddingHorizontal: Sizes.largePadding,
        borderRadius: Sizes.radius * 2,
        width: '100%',
        justifyContent: 'center',
        marginBottom: Sizes.padding,
        elevation: 3,
    },
    disabledButton: {
        opacity: 0.6,
    },
    googleIcon: {
        marginRight: Sizes.smallPadding,
    },
    buttonText: {
        color: Colors.white,
        fontSize: Sizes.subtitle,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: Sizes.padding,
    },
    linkText: {
        color: Colors.primary,
        fontSize: Sizes.font,
        textDecorationLine: 'underline',
    },
});

export default AuthScreen;
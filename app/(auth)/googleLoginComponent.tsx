import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive'],
      webClientId: '1078282422673-cl1gko8t51r5hhig8imkofc6uil97ne9.apps.googleusercontent.com', // Requerido
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      profileImageSize: 120
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      setUserInfo(response?.data?.user);
    } catch (error) {
      if (error === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Usuario canceló el login");
      } else {
        console.error("Error de login:", error);
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View>
          <Text>Bienvenido, {userInfo.name}</Text>
          <Button title="Cerrar Sesión" onPress={signOut} />
        </View>
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
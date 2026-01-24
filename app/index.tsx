import { Redirect } from 'expo-router';

export default function Index() {
  // Simplemente redirigimos al grupo de Auth. 
  // El RootLayout se encargará de cambiarlo a Drawer si ya hay token.
  return <Redirect href="/(auth)" />;
}
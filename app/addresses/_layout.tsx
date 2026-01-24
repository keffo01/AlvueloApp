import colors from '@/constants/colors';
import Sizes from '@/constants/Sizes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function AddressesLayout() {
            {/** Lógica para ir a la pantalla de mapa para agregar una nueva dirección  */}
            
    const handleAddNew = () => {
        // 💡 Ajusta esta ruta a tu componente de mapa (ej: /profile/addresses/map)
        router.push('/addresses/map'); 
    };
  return (
    <Stack>
    <Stack.Screen name="index"
                   options={{
                       title: 'Mis Direcciones',
                       headerStyle: { backgroundColor: colors.white },
                       headerShadowVisible: true,
                       // 💡 FUNCIÓN DE REGRESO USANDO router.back()
                       headerLeft: () => (
                           <TouchableOpacity onPress={() => router.replace('/Profile')} style={{ marginLeft: Sizes.smallPadding / 2 }}>
                               <Ionicons name="arrow-back" size={24} color={colors.text} />
                           </TouchableOpacity>
                       ),
                       // 💡 BOTÓN DE AGREGAR EN EL HEADER DERECHO
                       headerRight: () => (
                           <TouchableOpacity onPress={handleAddNew} style={{ marginRight: Sizes.smallPadding / 2 }}>
                               <Ionicons name="add-circle" size={30} color={colors.secondary} />
                           </TouchableOpacity>
                       ),
                   }}
               />
               <Stack.Screen name="notificaciones"
                options={{
                       title: 'Notificaciones',
                       headerStyle: { backgroundColor: colors.white },
                       headerShadowVisible: true,
                       // 💡 FUNCIÓN DE REGRESO USANDO router.back()
                       headerLeft: () => (
                           <TouchableOpacity onPress={() => router.replace('/Profile')} style={{ marginLeft: Sizes.smallPadding / 2 }}>
                               <Ionicons name="arrow-back" size={24} color={colors.text} />
                           </TouchableOpacity>
                       )
                   }} />
     
    </Stack>
  );
}
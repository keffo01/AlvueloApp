import colors from '@/constants/colors'; // adjust the import path based on your project structure
import Sizes from '@/constants/Sizes';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function HelpLayout() {
    const router = useRouter();
    return (
        <Stack>
        <Stack.Screen name="index"  
        options={{
            title: 'Ayuda y Soporte',
            headerStyle: { backgroundColor: colors.white },
            headerShadowVisible: true,
            // 💡 FUNCIÓN DE REGRESO USANDO router.back()
            headerLeft: () => (
                <TouchableOpacity onPress={() => router.replace('/Profile')} style={{ marginLeft: Sizes.smallPadding / 2 }}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
            )}} />
            </Stack>
        );
    }       
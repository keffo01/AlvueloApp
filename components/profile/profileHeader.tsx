// app/components/ProfileHeader.tsx (o donde tengas tu código)
import { useAuth } from '@/context/authContext';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import { UserService } from '../../services/user.service'; // 💡 Importa tu servicio

function ImagePickerExample() {
  // Inicializamos la imagen local con la que viene del contexto (si existe)
  const { userData, updateUserData } = useAuth(); 
  const [image, setImage] = useState<string | null>(userData?.photoProfile || null);
  const [isUploading, setIsUploading] = useState(false);
  console.log("data inicial del contexto:", userData); // Verifica que el contexto tenga los datos correctos

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // 💡 1:1 es mejor para fotos de perfil redondas
      quality: 0.5,   // 💡 Reducimos calidad para que el base64 no sea gigante
      base64: true,   // 💡 ¡CRUCIAL! Pedimos la imagen en formato texto
    });

    if (!result.canceled && result.assets[0].base64) {
      // 1. Mostrar previsualización inmediata al usuario
      setImage(result.assets[0].uri); 
      
      // 2. Preparar el base64 para enviar
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      const email = userData?.email || '';

      // 3. Subir al servidor
      try {
        setIsUploading(true);
        const response = await UserService.uploadProfilePicture(email, base64Img);
        if (response.profilePic) {
  // 💡 Actualizamos la caché respetando la estructura anidada
        updateUserData({ 
          ...userData,
          photoProfile: response.profilePic, // Solo actualizamos la URL de la foto
          
  });
}
      } catch (error) {
        Alert.alert("Error", "No se pudo subir la imagen.");
        console.error(error);
        // Si falla, revertimos a la imagen anterior
        setImage(userData?.photoProfile || null); 
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <View style={styles.imgcontainer}>
      <TouchableOpacity onPress={pickImage} disabled={isUploading}>
  {/* Contenedor relativo para que el loader absoluto no "se escape" */}
  <View style={{ width: 100, height: 100 }}> 
    <Image
      source={{ uri: image || userData?.photoProfile || 'https://via.placeholder.com/100' }} // Fallback a placeholder
      style={styles.profileImage}
    />

    {isUploading && (
      <View style={styles.loaderOverlay}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )}
  </View>
</TouchableOpacity>
    </View>
  );
}
const ProfileHeader: React.FC = () => {
  const { userData } = useAuth(); // 💡 Accedemos a los datos del usuario desde el contexto
  return (
    <View style={styles.container}>
      {/* Foto de Perfil */}
      <ImagePickerExample />

      {/* Nombre del Usuario */}
      <Text style={styles.userName}>{userData?.name}</Text>

      {/* Email del Usuario */}
      <Text style={styles.userEmail}>{userData?.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderOverlay: {
  // 💡 Esto hace que cubra exactamente el espacio de su contenedor (la foto)
  ...StyleSheet.absoluteFillObject, 
  
  // 💡 Semi-transparente para que se vea la foto de fondo
  backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  
  // 💡 Importante: debe coincidir con el borderRadius de tu profileImage
  borderRadius: 50, 
  
  // 💡 Centra el ActivityIndicator
  justifyContent: 'center',
  alignItems: 'center',
  
  // 💡 Asegura que esté por encima de todo
  zIndex: 1, 
},
  imgcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center', // Centra horizontalmente
    paddingVertical: Sizes.largePadding, // Espacio arriba y abajo
    backgroundColor: '#fff', // O usa Colors.background si prefieres
    borderBottomWidth: 1,
    borderBottomColor: Colors.background, // Una línea sutil de separación
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Círculo perfecto
    borderWidth: 3,
    borderColor: Colors.primary, // Borde con el color primario
    marginBottom: Sizes.padding,
  },
  userName: {
    fontSize: Sizes.header, // Tamaño grande para el nombre
    fontWeight: 'bold',
    color: Colors.text,
  },
  userEmail: {
    fontSize: Sizes.font,
    color: Colors.lightText, // Color más sutil para el email
    marginTop: 4,
  },
});

export default ProfileHeader;
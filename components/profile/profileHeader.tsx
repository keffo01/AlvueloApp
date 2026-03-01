import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 💡 Importar herramientas necesarias

import { useAuth } from '@/context/authContext';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
  const { userData } = useAuth(); // 💡 Accedemos a los datos del usuario desde el contexto

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.imgcontainer} >
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: userData?.profilePic || 'https://picsum.photos/id/237/200/200' }}
          style={styles.profileImage}
        />
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
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors'; // Asegúrate de que la ruta sea correcta
import Sizes from '../../constants/Sizes'; // Asegúrate de que la ruta sea correcta

// Datos simulados (MOCK)
const MOCK_USER = {
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  profilePicUrl: 'https://picsum.photos/id/237/200/200', // Placeholder de imagen
};

const ProfileHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Foto de Perfil */}
      <Image
        source={{ uri: MOCK_USER.profilePicUrl }}
        style={styles.profileImage}
      />

      {/* Nombre del Usuario */}
      <Text style={styles.userName}>{MOCK_USER.name}</Text>

      {/* Email del Usuario */}
      <Text style={styles.userEmail}>{MOCK_USER.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
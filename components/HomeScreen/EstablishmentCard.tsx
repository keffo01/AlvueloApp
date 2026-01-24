// components/EstablishmentCard.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import { Establishment } from '../../models/commons.model';

interface EstablishmentCardProps {
  establishment: Establishment;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({ establishment }) => {
  const navigation = useRouter();
   // 💡 Lógica de Navegación: Ir a la lista de productos del establecimiento
  // 💡 Función de navegación
  const handlePress = () => {
    // Navega a la ruta dinámica: /establishment/[id]
    // Expo Router traduce 'establishment/e1' a la ruta correcta.
    navigation.push(`/establishment/${establishment.id}` as any);
  };
  return (
    <TouchableOpacity 
    style={styles.cardContainer} 
    activeOpacity={0.8} 
    onPress={handlePress} >
      
      <Image source={{ uri: establishment.imageUri }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{establishment.name}</Text>
        <Text style={styles.category}>{establishment.category}</Text>
        <View style={styles.footer}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={styles.rating}>{establishment.rating.toFixed(1)}</Text>
            <Ionicons name="heart" size={14} color={Colors.error} style={{ marginLeft: Sizes.smallPadding }}/>
            <Text style={styles.likes}>{establishment.likes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Sizes.radius,
    padding: Sizes.smallPadding,
    marginBottom: Sizes.smallPadding,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Sizes.radius / 2,
    resizeMode: 'cover',
    marginRight: Sizes.smallPadding,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  name: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: Colors.text,
  },
  category: {
    fontSize: Sizes.subtitle,
    color: Colors.lightText,
  },
  footer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  rating: {
      fontSize: Sizes.subtitle,
      marginLeft: 4,
      color: Colors.text,
      fontWeight: '600',
  },
  likes: {
      fontSize: Sizes.subtitle,
      marginLeft: 4,
      color: Colors.error,
      fontWeight: '600',
  }
});

export default EstablishmentCard;
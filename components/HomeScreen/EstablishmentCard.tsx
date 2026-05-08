// components/EstablishmentCard.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import { Establishment } from '../../models/commons.model';

interface EstablishmentCardProps {
  establishment: Establishment;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({ establishment }) => {
  const navigation = useRouter();

  const handlePress = () => {
    navigation.push(`/establishment/${establishment.id}` as any);
  };

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9} 
      onPress={handlePress} 
    >
      {/* IMAGEN CON BADGE DE RATING */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: establishment.imageUri }} style={styles.image} />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFF" />
          <Text style={styles.ratingText}>{establishment.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* INFORMACIÓN */}
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.name} numberOfLines={1}>{establishment.name}</Text>
          <Text style={styles.category}>{establishment.category}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.statsRow}>
            <Ionicons name="time-outline" size={14} color={Colors.lightText} />
            <Text style={styles.footerText}> 25-35 min</Text> 
            
            <View style={styles.separator} />
            
            <Ionicons name="heart" size={14} color={Colors.error} />
            <Text style={styles.likesText}>{establishment.likes}</Text>
          </View>
          
          {/* Badge de "Abierto" o "Envío Gratis" opcional */}
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryText}>Envío: $1.50</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    // Sombra sutil pero elegante
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.warning || '#FFB800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  ratingText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 3,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    height: 90,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: Colors.lightText,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.lightText,
    fontWeight: '600',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  likesText: {
    fontSize: 12,
    marginLeft: 4,
    color: Colors.text,
    fontWeight: '600',
  },
  deliveryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default EstablishmentCard;
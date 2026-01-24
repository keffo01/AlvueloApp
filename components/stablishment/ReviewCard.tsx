// components/ReviewCard.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import { Review } from '../../constants/mockData';
import Sizes from '../../constants/Sizes';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Función para renderizar las estrellas de rating (5 estrellas fijas)
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={Sizes.smallPadding}
          color={Colors.rating}
          style={styles.star}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.userName}>{review.userName}</Text>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      
      {renderStars(review.rating)}
      
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    padding: Sizes.smallPadding,
    borderRadius: Sizes.radius,
    marginBottom: Sizes.smallPadding,
    borderWidth: 1,
    borderColor: '#ffffff', // Borde suave para separar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.smallPadding / 2,
  },
  userName: {
    fontSize: Sizes.font,
    fontWeight: 'bold',
    color: Colors.text,
  },
  date: {
    fontSize: Sizes.subtitle,
    color: Colors.lightText,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: Sizes.smallPadding / 2,
  },
  star: {
    marginRight: 2,
  },
  comment: {
    fontSize: Sizes.subtitle,
    color: Colors.lightText,
  },
});

export default ReviewCard;
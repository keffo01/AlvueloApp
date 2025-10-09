// views/ReviewsTab.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import { Review } from '../../constants/mockData';
import Sizes from '../../constants/Sizes';
import ReviewCard from './ReviewCard';

interface ReviewsTabProps {
  reviews: Review[];
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews }) => {
  
  // Calcular el rating promedio
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length);
  }, [reviews]);
  
  const totalReviews = reviews.length;

  const renderReview = ({ item }: { item: Review }) => (
    <ReviewCard review={item} />
  );

  return (
    <View style={styles.container}>
      
      {/* 💡 Sección de Rating Promedio */}
      <View style={styles.summaryContainer}>
        <Text style={styles.averageRatingText}>{averageRating.toFixed(1)}</Text>
        <Ionicons name="star" size={Sizes.header} color={Colors.rating} />
        <Text style={styles.countText}>{totalReviews} {totalReviews === 1 ? 'Opinión' : 'Opiniones'}</Text>
      </View>
      
      <View style={styles.divider} />

      {/* 💡 Lista de Opiniones */}
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // Permitir que el ScrollView padre maneje el scroll
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sé el primero en dejar una opinión sobre este local.</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  summaryContainer: {
    padding: Sizes.padding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageRatingText: {
    fontSize: Sizes.largePadding,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: Sizes.smallPadding / 2,
  },
  countText: {
    fontSize: Sizes.font,
    color: Colors.lightText,
    marginLeft: Sizes.smallPadding,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.background,
    marginHorizontal: Sizes.padding,
  },
  listContent: {
    padding: Sizes.padding,
  },
  emptyContainer: {
    padding: Sizes.padding * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Sizes.font,
    color: Colors.lightText,
    textAlign: 'center',
  }
});

export default ReviewsTab;
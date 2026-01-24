// views/ReviewsTab.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import { Review } from '../../constants/mockData';
import Sizes from '../../constants/Sizes';
import AuthModal from '../AuthModal';
import ReviewCard from './ReviewCard';

interface ReviewsTabProps {
  reviews: Review[];
  establishmentId: string; // 💡 Necesitamos el ID del establecimiento para añadir la opinión
}

const MOCK_IS_LOGGED_IN = false; // 💡 MOCK DE AUTENTICACIÓN: Cámbiame a 'true' para probar el formulario.

const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews, establishmentId }) => {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0); // Para seleccionar el rating
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

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
  // 💡 Lógica para manejar el envío del comentario
  const handleSubmitReview = () => {
    // 1. Verificar Autenticación (MOCK)
    if (!MOCK_IS_LOGGED_IN) {
      setIsAuthModalVisible(true);
      return;
    }
    
    // 2. Validar Input
    if (commentText.trim().length < 5 || rating === 0) {
      Alert.alert("Faltan datos", "Por favor, escribe un comentario y selecciona una puntuación.");
      return;
    }
    
    // 3. Lógica para AÑADIR OPINIÓN (Mockear por ahora)
    alert(`Opinión enviada para ${establishmentId} con Rating: ${rating} y Comentario: "${commentText}"`);
    
    // 4. Limpiar formulario
    setCommentText('');
    setRating(0);
  };

  // 💡 Lógica para seleccionar el rating (estrellas)
  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={Sizes.title}
            color={Colors.rating}
            style={styles.starInput}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingInputContainer}>{stars}</View>;
  };
  return (
    <View style={styles.container}>
      
      {/* 💡 Sección de Rating Promedio */}
      <View style={styles.summaryContainer}>
        <Text style={styles.averageRatingText}>{averageRating.toFixed(1)}</Text>
        <Ionicons name="star" size={Sizes.header} color={Colors.rating} />
        <Text style={styles.countText}>{totalReviews} {totalReviews === 1 ? 'Opinión' : 'Opiniones'}</Text>
      </View>
      
      <View style={styles.divider} />

    {/* 💡 Sección de Formulario de Comentario */}
      <View style={styles.commentForm}>
        <Text style={styles.formTitle}>Deja tu opinión</Text>
        
        {renderRatingStars()}
        
        <TextInput
          placeholder="Escribe tu comentario aquí..."
          placeholderTextColor={Colors.lightText}
          value={commentText}
          onChangeText={setCommentText}
          multiline
          style={styles.textInput}
        />
        
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmitReview}
        >
          <Text style={styles.submitButtonText}>Comentar</Text>
        </TouchableOpacity>
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
      {/* 💡 Modal de Autenticación */}
      <AuthModal 
        isVisible={isAuthModalVisible} 
        onClose={() => setIsAuthModalVisible(false)} 
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
  },
  commentForm: {
    padding: Sizes.padding,
    backgroundColor: '#fff',
    marginBottom: Sizes.smallPadding,
    borderRadius: Sizes.radius,
    marginHorizontal: Sizes.padding,
    marginTop: Sizes.padding,
  },
  formTitle: {
    fontSize: Sizes.subtitle,
    fontWeight: 'bold',
    marginBottom: Sizes.smallPadding,
    color: Colors.text,
  },
  ratingInputContainer: {
    flexDirection: 'row',
    marginBottom: Sizes.smallPadding,
  },
  starInput: {
    marginRight: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.background,
    borderRadius: Sizes.radius,
    padding: Sizes.smallPadding,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: Sizes.font,
    color: Colors.text,
    marginBottom: Sizes.smallPadding,
  },
  submitButton: {
    backgroundColor: Colors.secondary,
    padding: Sizes.smallPadding,
    borderRadius: Sizes.radius,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: Sizes.font,
    fontWeight: 'bold',
  }
});

export default ReviewsTab;
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from './GradientButton';
import { colors, radius, spacing } from '../constants/theme';

export default function ReviewForm({
  onSubmit,
}: {
  onSubmit: (rating: number, comment: string) => Promise<void>;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(rating, comment.trim());
      setRating(0);
      setComment('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.box}>
      <Text style={styles.heading}>Rate this provider</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setRating(n)} hitSlop={6}>
            <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={30} color="#F5A623" />
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Share your experience (optional)"
        placeholderTextColor={colors.textMuted}
        value={comment}
        onChangeText={setComment}
        multiline
        maxLength={300}
      />
      <GradientButton
        label={submitting ? 'Submitting...' : 'Submit Review'}
        onPress={handleSubmit}
        loading={submitting}
        disabled={rating === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  heading: { fontSize: 14, fontWeight: '700', color: colors.textDark, marginBottom: spacing.sm },
  stars: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  input: { backgroundColor: colors.inputBg, borderRadius: radius.md, padding: 12, minHeight: 70, textAlignVertical: 'top', fontSize: 14, color: colors.textDark, marginBottom: spacing.md },
});
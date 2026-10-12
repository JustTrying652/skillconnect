import { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, Linking, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Provider, Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { logConnection } from '../../services/providers';
import { getReviews, submitReview } from '../../services/reviews';
import { toWhatsAppNumber } from '../../utils/phone';
import { getRating } from '../../utils/rating';
import GradientButton from '../../components/GradientButton';
import ReviewForm from '../../components/ReviewForm';
import { colors, radius, spacing } from '../../constants/theme';

export default function ProviderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    if (!id) return;
    try {
      const snap = await getDoc(doc(db, 'providers', id));
      if (snap.exists()) setProvider({ id: snap.id, ...snap.data() } as Provider);
      setReviews(await getReviews(id));
    } catch (e) {
      console.error('Failed to load provider', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleConnect() {
    if (!provider) return;

    const number = toWhatsAppNumber(provider.phone);
    if (!number) {
      Alert.alert('Contact unavailable', "This provider hasn't added a WhatsApp number yet.");
      return;
    }

    if (user) {
      logConnection({
        providerId: provider.id,
        providerName: provider.name,
        customerId: user.uid,
        customerName: user.displayName || 'Anonymous',
      }).catch((e) => console.error('Failed to log connection', e));
    }

    const message = `Hi ${provider.name}, I found you on SkillConnect and I'm interested in your services.`;
    try {
      await Linking.openURL(`https://wa.me/${number}?text=${encodeURIComponent(message)}`);
    } catch {
      Alert.alert('Could not open WhatsApp', 'Please make sure WhatsApp is installed.');
    }
  }

  async function handleSubmitReview(rating: number, comment: string) {
    if (!provider || !user) return;
    try {
      await submitReview({
        providerId: provider.id,
        customerId: user.uid,
        customerName: user.displayName || 'Anonymous',
        rating,
        comment,
      });
      await loadAll();
    } catch (e: any) {
      if (e.message === 'already-reviewed') {
        Alert.alert('Already reviewed', "You've already reviewed this provider.");
      } else {
        Alert.alert('Could not submit review', 'Please check your connection and try again.');
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.textMuted }}>Provider not found.</Text>
      </View>
    );
  }

  const rating = getRating(provider);
  const alreadyReviewed = !!user && reviews.some((r) => r.customerId === user.uid);
  const isOwner = !!user && provider.createdBy === user.uid;
  const canReview = !!user && !alreadyReviewed && !isOwner;

  return (
    <>
      <Stack.Screen options={{ title: provider.name, headerBackTitle: 'Back' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Image
          source={{ uri: provider.photoUrl || 'https://placehold.co/300x300/F2F2F7/8A8A9E?text=' + provider.name[0] }}
          style={styles.image}
        />
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.category}>{provider.category.charAt(0).toUpperCase() + provider.category.slice(1)}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color={rating ? '#F5A623' : colors.border} />
            <Text style={styles.metaText}>
              {rating ? `${rating.toFixed(1)} (${provider.reviewCount})` : 'No reviews yet'}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{provider.location}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{provider.bio}</Text>

        <Text style={styles.sectionTitle}>Services</Text>
        {provider.services.map((s, i) => (
          <View key={i} style={styles.serviceRow}>
            <Text style={styles.serviceName}>{s.name}</Text>
            <Text style={styles.servicePrice}>KES {s.price}</Text>
          </View>
        ))}

        <View style={{ marginTop: spacing.xl }}>
          <GradientButton label="Connect on WhatsApp" onPress={handleConnect} />
        </View>

        <Text style={styles.sectionTitle}>Reviews{reviews.length ? ` (${reviews.length})` : ''}</Text>

        {canReview ? <ReviewForm onSubmit={handleSubmitReview} /> : null}
        {alreadyReviewed ? <Text style={styles.note}>You've reviewed this provider. Thanks!</Text> : null}

        {reviews.length === 0 ? (
          <Text style={styles.note}>No reviews yet. Be the first to share your experience.</Text>
        ) : (
          reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewer}>{r.customerName}</Text>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Ionicons key={n} name={n <= r.rating ? 'star' : 'star-outline'} size={13} color="#F5A623" />
                  ))}
                </View>
              </View>
              {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
              <Text style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 60 },
  image: { width: 120, height: 120, borderRadius: radius.lg, alignSelf: 'center', backgroundColor: colors.inputBg },
  name: { fontSize: 22, fontWeight: '700', color: colors.textDark, textAlign: 'center', marginTop: spacing.md },
  category: { fontSize: 14, color: colors.primary, fontWeight: '600', textAlign: 'center', marginTop: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textDark, marginTop: spacing.xl, marginBottom: spacing.sm },
  bio: { color: colors.textMuted, lineHeight: 20, fontSize: 14 },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  serviceName: { fontSize: 15, color: colors.textDark },
  servicePrice: { fontSize: 15, fontWeight: '700', color: colors.primary },
  note: { color: colors.textMuted, fontSize: 13, marginTop: spacing.sm },
  reviewCard: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewer: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  reviewStars: { flexDirection: 'row', gap: 1 },
  reviewComment: { color: colors.textDark, fontSize: 13, lineHeight: 19, marginTop: 6 },
  reviewDate: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
});
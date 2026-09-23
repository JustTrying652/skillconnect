import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from '../types';
import { colors, radius, spacing } from '../constants/theme';

export default function ProviderCard({ provider }: { provider: Provider }) {
  const router = useRouter();

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/provider/${provider.id}`)}>
      <Image
        source={{ uri: provider.photoUrl || 'https://placehold.co/100x100/F2F2F7/8A8A9E?text=' + provider.name[0] }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{provider.name}</Text>
        <Text style={styles.category}>{provider.category.charAt(0).toUpperCase() + provider.category.slice(1)}</Text>
        <Text style={styles.location} numberOfLines={1}>{provider.location}</Text>
        {provider.rating ? (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color="#F5A623" />
            <Text style={styles.rating}>{provider.rating.toFixed(1)}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#1A1A2E',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  image: { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.inputBg },
  info: { marginLeft: spacing.md, flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: colors.textDark },
  category: { color: colors.primary, fontSize: 13, fontWeight: '600', marginTop: 2 },
  location: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  rating: { fontSize: 13, color: colors.textDark, fontWeight: '600' },
});
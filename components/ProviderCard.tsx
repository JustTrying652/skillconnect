import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Provider } from '../types';

export default function ProviderCard({ provider }: { provider: Provider }) {
  const router = useRouter();

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/provider/${provider.id}`)}>
      <Image
        source={{ uri: provider.photoUrl || 'https://placehold.co/100x100?text=' + provider.name[0] }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.category}>{provider.category}</Text>
        <Text style={styles.location} numberOfLines={1}>{provider.location}</Text>
        {provider.rating ? (
          <Text style={styles.rating}>⭐ {provider.rating.toFixed(1)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#eee' },
  info: { marginLeft: 12, flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700' },
  category: { color: '#2563eb', fontSize: 13, fontWeight: '600', marginTop: 2, textTransform: 'capitalize' },
  location: { color: '#666', fontSize: 13, marginTop: 2 },
  rating: { marginTop: 4, fontSize: 13 },
});
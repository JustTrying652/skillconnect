import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Pressable, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Provider } from '../../types';

export default function ProviderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const snap = await getDoc(doc(db, 'providers', id));
      if (snap.exists()) {
        setProvider({ id: snap.id, ...snap.data() } as Provider);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.center}>
        <Text>Provider not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: provider.name, headerBackTitle: 'Back' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Image
          source={{ uri: provider.photoUrl || 'https://placehold.co/300x300?text=' + provider.name[0] }}
          style={styles.image}
        />
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.category}>{provider.category}</Text>
        {provider.rating ? <Text style={styles.rating}>⭐ {provider.rating.toFixed(1)}</Text> : null}
        <Text style={styles.location}>📍 {provider.location}</Text>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{provider.bio}</Text>

        <Text style={styles.sectionTitle}>Services</Text>
        {provider.services.map((s, i) => (
          <View key={i} style={styles.serviceRow}>
            <Text style={styles.serviceName}>{s.name}</Text>
            <Text style={styles.servicePrice}>KES {s.price}</Text>
          </View>
        ))}

        <Pressable style={styles.connectButton} onPress={() => connectWithProvider(provider)}>
          <Text style={styles.connectButtonText}>Connect</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function connectWithProvider(provider: Provider) {
  // Day 4 will replace this with a real in-app booking/request flow.
  // For now, a simple mailto/WhatsApp-style fallback keeps this tappable and demoable.
  Linking.openURL(`https://wa.me/?text=${encodeURIComponent(`Hi ${provider.name}, I found you on SkillConnect and I'm interested in your services.`)}`);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 60 },
  image: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', backgroundColor: '#eee' },
  name: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 16 },
  category: { fontSize: 14, color: '#2563eb', fontWeight: '600', textAlign: 'center', textTransform: 'capitalize', marginTop: 4 },
  rating: { textAlign: 'center', marginTop: 6 },
  location: { textAlign: 'center', color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 8 },
  bio: { color: '#444', lineHeight: 20 },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  serviceName: { fontSize: 15 },
  servicePrice: { fontSize: 15, fontWeight: '600', color: '#2563eb' },
  connectButton: { backgroundColor: '#2563eb', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 32 },
  connectButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
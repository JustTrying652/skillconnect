import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Provider } from '../../types';
import GradientButton from '../../components/GradientButton';
import { colors, radius, spacing } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { logConnection } from '../../services/providers';

export default function ProviderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();


  useEffect(() => {
    async function load() {
      if (!id) return;
      const snap = await getDoc(doc(db, 'providers', id));
      if (snap.exists()) setProvider({ id: snap.id, ...snap.data() } as Provider);
      setLoading(false);
    }
    load();
  }, [id]);

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

  return (
    <>
      <Stack.Screen options={{ title: provider.name, headerBackTitle: 'Back' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Image
          source={{ uri: provider.photoUrl || 'https://placehold.co/300x300/F2F2F7/8A8A9E?text=' + provider.name[0] }}
          style={styles.image}
        />
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.category}>{provider.category.charAt(0).toUpperCase() + provider.category.slice(1)}</Text>

        <View style={styles.metaRow}>
          {provider.rating ? (
            <View style={styles.metaItem}>
              <Ionicons name="star" size={14} color="#F5A623" />
              <Text style={styles.metaText}>{provider.rating.toFixed(1)}</Text>
            </View>
          ) : null}
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
          <GradientButton label="Connect" onPress={() => connectWithProvider(provider, user?.uid, user?.displayName || undefined)} />
        </View>
      </ScrollView>
    </>
  );
}

function connectWithProvider(provider: Provider, customerId?: string, customerName?: string) {
  if (customerId) {
    logConnection({
      providerId: provider.id,
      providerName: provider.name,
      customerId,
      customerName: customerName || 'Anonymous',
    }).catch((e) => console.error('Failed to log connection', e));
  }
  Linking.openURL(`https://wa.me/?text=${encodeURIComponent(`Hi ${provider.name}, I found you on SkillConnect and I'm interested in your services.`)}`);
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
});
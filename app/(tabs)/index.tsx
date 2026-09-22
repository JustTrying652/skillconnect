import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { getProviders } from '../../services/providers';
import { Provider, Category } from '../../types';
import ProviderCard from '../../components/ProviderCard';
import CategoryChip from '../../components/CategoryChip';

const CATEGORIES: (Category | 'all')[] = ['all', 'barber', 'hairdresser', 'tailor', 'caterer', 'other'];

export default function Discover() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const load = useCallback(async () => {
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (e) {
      console.error('Failed to load providers', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = activeCategory === 'all' ? providers : providers.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProviderCard provider={item} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={<Text style={styles.empty}>No providers yet — check back soon.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  chipRow: { marginBottom: 16, maxHeight: 40 },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});
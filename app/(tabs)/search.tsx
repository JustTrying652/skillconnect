import { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProviders } from '../../services/providers';
import { Provider, Category } from '../../types';
import ProviderCard from '../../components/ProviderCard';
import CategoryChip from '../../components/CategoryChip';
import { colors, radius, spacing } from '../../constants/theme';

const CATEGORIES: (Category | 'all')[] = ['all', 'barber', 'hairdresser', 'tailor', 'caterer', 'other'];

export default function Search() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (e) {
      console.error('Failed to load providers', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let result = providers;
    if (activeCategory !== 'all') result = result.filter((p) => p.category === activeCategory);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }
    return result;
  }, [providers, activeCategory, query]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Search by name or location"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={{ paddingRight: spacing.md }}>
        {CATEGORIES.map((cat) => (
          <CategoryChip key={cat} label={cat} active={activeCategory === cat} onPress={() => setActiveCategory(cat)} />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline-outline" size={32} color={colors.textMuted} />
          <Text style={styles.errorText}>Couldn't load providers. Check your connection.</Text>
          <Pressable style={styles.retryButton} onPress={load}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProviderCard provider={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No providers match your search.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: spacing.md, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '700', color: colors.textDark, marginBottom: spacing.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, marginBottom: spacing.md, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: colors.textDark },
  chipRow: { marginBottom: spacing.md, maxHeight: 40 },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
  errorBox: { alignItems: 'center', marginTop: 60, gap: 10 },
  errorText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', paddingHorizontal: 30 },
  retryButton: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: radius.md, backgroundColor: colors.primary },
  retryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getProvidersByCategory } from '../../services/providers';
import { Provider, Category } from '../../types';
import ProviderCard from '../../components/ProviderCard';
import { colors } from '../../constants/theme';

export default function CategoryResults() {
  const { cat } = useLocalSearchParams<{ cat: string }>();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProvidersByCategory(cat as Category);
      setProviders(data);
      setLoading(false);
    }
    load();
  }, [cat]);

  return (
    <>
      <Stack.Screen options={{ title: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Category' }} />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={providers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProviderCard provider={item} />}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={<Text style={styles.empty}>No providers in this category yet.</Text>}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
});
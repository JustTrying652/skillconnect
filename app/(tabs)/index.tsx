import { View, Text, TextInput, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import CategoryTile from '../../components/CategoryTile';
import { colors, radius, spacing } from '../../constants/theme';

const CATEGORIES = [
  { label: 'Barbing', value: 'barber', image: 'https://picsum.photos/seed/barber/300/300' },
  { label: 'Hairdressing', value: 'hairdresser', image: 'https://picsum.photos/seed/hair/300/300' },
  { label: 'Tailoring', value: 'tailor', image: 'https://picsum.photos/seed/tailor/300/300' },
  { label: 'Catering', value: 'caterer', image: 'https://picsum.photos/seed/catering/300/300' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image source={{ uri: user?.photoURL || 'https://placehold.co/44x44' }} style={styles.avatar} />
          <View>
            <Text style={styles.greetingSmall}>Good morning</Text>
            <Text style={styles.greeting}>Welcome back, {user?.displayName?.split(' ')[0] || 'there'}</Text>
          </View>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.location}>Nairobi, Kenya</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput placeholder="Search for services" style={styles.searchInput} placeholderTextColor={colors.textMuted} />
      </View>

      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.promo}>
        <Text style={styles.promoTag}>Limited offer!</Text>
        <Text style={styles.promoText}>Enjoy 25% off your first booking with SkillConnect. Book now and save!</Text>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Categories</Text>
      <Text style={styles.sectionSubtitle}>Explore services</Text>

      <View style={styles.grid}>
        {CATEGORIES.map((c) => (
          <CategoryTile key={c.value} label={c.label} image={c.image} value={c.value} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md },
  header: { paddingTop: 60, marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.border },
  greetingSmall: { color: colors.textMuted, fontSize: 12 },
  greeting: { color: colors.textDark, fontSize: 16, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  location: { color: colors.textMuted, fontSize: 13 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, marginBottom: spacing.md, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: colors.textDark },
  promo: { borderRadius: radius.lg, padding: 18, marginBottom: spacing.lg },
  promoTag: { color: '#fff', fontSize: 11, fontWeight: '700', opacity: 0.85, marginBottom: 6 },
  promoText: { color: '#fff', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textDark },
  sectionSubtitle: { color: colors.primary, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
import { useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientButton from '../components/GradientButton';
import { colors, radius, spacing } from '../constants/theme';

const SLIDES = [
  {
    icon: 'search-outline' as const,
    title: 'Find Skilled Professionals Near You',
    description: 'Discover trusted hairdressers, tailors, carpenters and more in one place.',
  },
  {
    icon: 'navigate-outline' as const,
    title: 'Skilled Service to Your Doorstep',
    description: 'Trusted experts come to your location and get the job done.',
  },
  {
    icon: 'checkmark-done-outline' as const,
    title: 'Book Services with Ease',
    description: 'Browse services, compare providers and connect in just a few steps.',
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const router = useRouter();

  async function finish() {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/login');
  }

  function next() {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      finish();
    }
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.skip} onPress={finish}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={64} color={colors.primary} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        <GradientButton label={index === SLIDES.length - 1 ? 'Get Started' : 'Next'} onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skip: { position: 'absolute', top: 56, right: spacing.lg, zIndex: 1 },
  skipText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, paddingTop: 100 },
  iconWrap: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textDark, textAlign: 'center', marginBottom: spacing.sm },
  description: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
});
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/theme';

export default function Bookings() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="calendar-outline" size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>Bookings coming soon</Text>
      <Text style={styles.subtitle}>
        Track your service requests and appointments right here. For now, connect with a
        provider from their profile to get started.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontSize: 18, fontWeight: '700', color: colors.textDark, marginBottom: spacing.sm },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
});
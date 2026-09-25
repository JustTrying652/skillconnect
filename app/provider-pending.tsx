import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../services/auth';
import { colors, radius, spacing } from '../constants/theme';

export default function ProviderPending() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="construct-outline" size={44} color={colors.primary} />
      </View>
      <Text style={styles.title}>You're on the list!</Text>
      <Text style={styles.subtitle}>
        Provider profiles and listings are launching soon on SkillConnect. We'll notify you
        the moment you can create your service listing and start connecting with customers.
      </Text>
      <Pressable style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  iconWrap: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontSize: 20, fontWeight: '700', color: colors.textDark, marginBottom: spacing.sm },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: spacing.xl },
  logoutButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  logoutText: { color: colors.textDark, fontWeight: '600', fontSize: 14 },
});
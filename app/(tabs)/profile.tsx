import { useRouter } from 'expo-router';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing } from '../../constants/theme';

const MENU_ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'person-outline', label: 'Edit Profile' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'card-outline', label: 'Payment Methods' },
  { icon: 'shield-checkmark-outline', label: 'Privacy & Security' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
  { icon: 'information-circle-outline', label: 'About SkillConnect' },
];

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();

  function handleMenuPress(label: string) {
    if (label === 'Edit Profile') {
      router.push('/edit-profile');
    }
  }

  function handleLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logout() },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Image
          source={{ uri: user?.photoURL || 'https://placehold.co/80x80/F2F2F7/8A8A9E?text=' + (user?.displayName?.[0] || 'U') }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.displayName || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item, i) => (
          <Pressable
            key={item.label}
            style={[styles.menuItem, i === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => handleMenuPress(item.label)}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#dc2626" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.inputBg, marginBottom: spacing.sm },
  name: { fontSize: 18, fontWeight: '700', color: colors.textDark },
  email: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  menu: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    shadowColor: '#1A1A2E',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconWrap: {
    width: 34, height: 34, borderRadius: radius.sm,
    backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: { flex: 1, fontSize: 14, color: colors.textDark, fontWeight: '600' },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: spacing.md, marginTop: spacing.lg,
    paddingVertical: 14, borderRadius: radius.md,
    borderWidth: 1, borderColor: '#fecaca', backgroundColor: '#fef2f2',
  },
  logoutText: { color: '#dc2626', fontWeight: '700', fontSize: 14 },
});
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../../services/auth';
import GradientButton from '../../components/GradientButton';
import { colors, radius } from '../../constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (e: any) {
      setError(e.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SkillConnect</Text>
      <Text style={styles.subtitle}>Log in to continue</Text>

      <View style={styles.inputWrap}>
        <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="your@email.com"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWrap}>
        <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword((s) => !s)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <GradientButton label={loading ? 'Logging in...' : 'Log In'} onPress={handleLogin} loading={loading} />

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialRow}>
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
        </Pressable>
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-facebook" size={20} color="#1877F2" />
        </Pressable>
      </View>

      <Link href="/signup" style={styles.link}>
        <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkAccent}>Sign up</Text></Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: '700', color: colors.textDark, textAlign: 'center' },
  subtitle: { color: colors.textMuted, textAlign: 'center', marginBottom: 28, marginTop: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg, borderRadius: radius.md, paddingHorizontal: 14, marginBottom: 14, height: 50 },
  icon: { marginRight: 8 },
  input: { flex: 1, color: colors.textDark, fontSize: 14 },
  error: { color: '#dc2626', marginBottom: 10, textAlign: 'center' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { marginHorizontal: 10, color: colors.textMuted, fontSize: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  socialButton: { width: 48, height: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  link: { marginTop: 28, alignSelf: 'center' },
  linkText: { color: colors.textMuted, fontSize: 13 },
  linkAccent: { color: colors.primary, fontWeight: '700' },
});
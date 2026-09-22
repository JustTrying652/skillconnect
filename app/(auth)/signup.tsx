import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { signUp } from '../../services/auth';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup() {
    setError('');
    setLoading(true);
    try {
      await signUp(name, email, password, role);
      router.replace('/');
    } catch (e: any) {
      setError(e.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <View style={styles.roleRow}>
        <Pressable
          style={[styles.roleButton, role === 'customer' && styles.roleButtonActive]}
          onPress={() => setRole('customer')}
        >
          <Text style={role === 'customer' ? styles.roleTextActive : styles.roleText}>I'm a customer</Text>
        </Pressable>
        <Pressable
          style={[styles.roleButton, role === 'provider' && styles.roleButtonActive]}
          onPress={() => setRole('provider')}
        >
          <Text style={role === 'provider' ? styles.roleTextActive : styles.roleText}>I'm a provider</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
      </Pressable>

      <Link href="/login" style={styles.link}>
        <Text>Already have an account? Log in</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, marginBottom: 12 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  roleButton: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, alignItems: 'center' },
  roleButtonActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  roleText: { color: '#333' },
  roleTextActive: { color: '#fff', fontWeight: '600' },
  button: { backgroundColor: '#2563eb', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: '#dc2626', marginBottom: 8 },
  link: { marginTop: 16, alignSelf: 'center' },
});
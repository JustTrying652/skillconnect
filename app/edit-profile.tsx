import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../services/firebase';
import GradientButton from '../components/GradientButton';
import { colors, radius, spacing } from '../constants/theme';

export default function EditProfile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name.trim() });
      }
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), { name: name.trim() });
      }
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit Profile', headerBackTitle: 'Back' }} />
      <View style={styles.container}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Email</Text>
        <View style={[styles.input, styles.inputDisabled]}>
          <Text style={styles.disabledText}>{user?.email}</Text>
        </View>
        <Text style={styles.hint}>Email can't be changed here.</Text>

        <View style={{ marginTop: spacing.xl }}>
          <GradientButton label={loading ? 'Saving...' : 'Save Changes'} onPress={handleSave} loading={loading} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.textDark, marginBottom: 6, marginTop: spacing.md },
  input: { backgroundColor: colors.inputBg, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 14, fontSize: 14, color: colors.textDark },
  inputDisabled: { justifyContent: 'center', opacity: 0.6 },
  disabledText: { fontSize: 14, color: colors.textMuted },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
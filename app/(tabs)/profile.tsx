import { View, Text, Pressable, StyleSheet } from 'react-native';
import { logout } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>{user?.displayName}</Text>
      <Text>{user?.email}</Text>
      <Pressable style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  button: { backgroundColor: '#dc2626', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
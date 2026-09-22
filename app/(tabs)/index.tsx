import { View, Text, StyleSheet } from 'react-native';

export default function Discover() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text>Provider feed goes here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
});
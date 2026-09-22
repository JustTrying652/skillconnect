import { Pressable, Text, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function CategoryTile({ label, image, value }: { label: string; image: string; value: string }) {
  const router = useRouter();
  return (
    <Pressable style={styles.tile} onPress={() => router.push(`/category/${value}`)}>
      <ImageBackground source={{ uri: image }} style={styles.image} imageStyle={{ borderRadius: 16 }}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.overlay}>
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { width: '48%', aspectRatio: 1, marginBottom: 12 },
  image: { flex: 1, justifyContent: 'flex-end' },
  overlay: { padding: 10, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  label: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
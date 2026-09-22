import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../constants/theme';

export default function GradientButton({
  label, onPress, loading, disabled,
}: { label: string; onPress: () => void; loading?: boolean; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={{ opacity: disabled ? 0.6 : 1 }}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{label}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: radius.md, paddingVertical: 15, alignItems: 'center' },
  text: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
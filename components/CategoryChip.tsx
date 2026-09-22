import { Pressable, Text, StyleSheet } from 'react-native';

export default function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#2563eb' },
  text: { color: '#333', fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  textActive: { color: '#fff' },
});
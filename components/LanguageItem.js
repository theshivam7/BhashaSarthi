import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../utils/colors';

export default function LanguageItem({ text, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{text}</Text>
      {selected && <Ionicons name="checkmark" size={18} color={colors.white} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  text: {
    fontSize: 15,
    color: colors.text,
    fontFamily: 'Roboto-Regular',
  },
  textSelected: {
    color: colors.white,
    fontFamily: 'Roboto-Medium',
    fontWeight: '600',
  },
});

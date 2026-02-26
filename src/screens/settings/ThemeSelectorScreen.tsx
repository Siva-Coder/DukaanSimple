import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme, PrimaryColor } from '../../theme/themeContext';

const options: {
  label: string;
  color: PrimaryColor;
}[] = [
  { label: 'Indigo (Default)', color: '#4F46E5' },
  { label: 'Deep Blue', color: '#1D4ED8' },
  { label: 'Teal', color: '#0F766E' },
];

export default function ThemeSelectorScreen() {
  const { theme, setPrimary } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Choose App Color
      </Text>

      {options.map(option => {
        const isActive = theme.primary === option.color;

        return (
          <TouchableOpacity
            key={option.color}
            style={[
              styles.option,
              {
                borderColor: isActive
                  ? option.color
                  : theme.border,
              },
            ]}
            onPress={() => setPrimary(option.color)}
          >
            <View
              style={[
                styles.colorDot,
                { backgroundColor: option.color },
              ]}
            />

            <Text
              style={[
                styles.label,
                { color: theme.textPrimary },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 12,
  },
  colorDot: {
    width: 22,
    height: 22,
    borderRadius: 6,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
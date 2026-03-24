import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/themeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreStack({ navigation }: any) {
  const { theme } = useTheme();

  const Item = ({ label, route }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(route)}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: theme.background },
    ]}>
      <Item label="Products" route="Products" />
      <Item label="Reports" route="Reports" />
      <Item label="Settings" route="Settings" />
      <Item label="About" route="About" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
});
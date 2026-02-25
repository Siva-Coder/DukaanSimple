import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

export default function SalesListScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.emptyTitle}>No sales yet</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('AddSale')}
      >
        <Text style={styles.primaryText}>Add Sale</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
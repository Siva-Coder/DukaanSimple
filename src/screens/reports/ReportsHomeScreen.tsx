import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ReportsHomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('SalesReport')}
      >
        <Text style={styles.title}>Sales History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PurchaseReport')}
      >
        <Text style={styles.title}>Purchase History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PartyLedger')}
      >
        <Text style={styles.title}>Party Ledger</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
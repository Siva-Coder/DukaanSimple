import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { formatCurrency } from '../../utils/format';

export default function SalesReportScreen() {
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('sales')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSales(data);
      });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={sales}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.amount}>
              {formatCurrency(item.totalAmount)}
            </Text>
            <Text>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <Text>Payment: {item.paymentType}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
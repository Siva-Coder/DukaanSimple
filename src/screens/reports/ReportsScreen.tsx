import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ReportsScreen() {
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('sales')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
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
      <Text style={styles.title}>Recent Sales</Text>

      <FlatList
        data={sales}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Total: ₹ {item.totalAmount}</Text>
            <Text>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
});
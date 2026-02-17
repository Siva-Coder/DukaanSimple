import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { formatCurrency } from '../../utils/format';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../constants/theme';

export default function PurchaseListScreen({ navigation }: any) {
  const [purchases, setPurchases] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const user = auth().currentUser;
      if (!user) return;

      const unsubscribe = firestore()
        .collection('purchases')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          snapshot => {
            console.log('Purchase snapshot:', snapshot.size);

            const data = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

            setPurchases(data);
          },
          error => {
            console.error('Purchase listener error:', error);
          }
        );

      return () => unsubscribe();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={purchases}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPurchase')}
      >
        <Text style={styles.fabText}>Add Purchases</Text>
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: { color: '#fff', fontSize: 22 }
});
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { formatCurrency } from '../../utils/format';

export default function PartyLedgerScreen({ route }: any) {
  const { partyId, partyName } = route.params;

  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    const user = auth().currentUser;
    if (!user) return;

    const db = firestore();

    // 1️⃣ Credit Sales
    const salesSnapshot = await db
      .collection('sales')
      .where('userId', '==', user.uid)
      .where('customerId', '==', partyId)
      .where('paymentType', '==', 'credit')
      .get();

    const sales = salesSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'sale',
      amount: doc.data().totalAmount,
      direction: 'debit', // customer owes you
      createdAt: doc.data().createdAt,
    }));

    // 2️⃣ Credit Purchases (if supplier)
    const purchaseSnapshot = await db
      .collection('purchases')
      .where('userId', '==', user.uid)
      .where('supplierId', '==', partyId)
      .where('paymentType', '==', 'credit')
      .get();

    const purchases = purchaseSnapshot.docs.map(doc => ({
      id: doc.id,
      type: 'purchase',
      amount: doc.data().totalAmount,
      direction: 'credit', // you owe supplier
      createdAt: doc.data().createdAt,
    }));

    // 3️⃣ Payments
    const paymentSnapshot = await db
      .collection('payments')
      .where('userId', '==', user.uid)
      .where('partyId', '==', partyId)
      .get();

    const payments = paymentSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: 'payment',
        amount: data.amount,
        direction:
          data.direction === 'received'
            ? 'credit'
            : 'debit',
        createdAt: data.createdAt,
      };
    });

    const allEntries = [...sales, ...purchases, ...payments];

    // Sort by date
    allEntries.sort((a, b) => a.createdAt - b.createdAt);

    // Calculate running balance
    let runningBalance = 0;

    const ledger = allEntries.map(entry => {
      if (entry.direction === 'debit') {
        runningBalance += entry.amount;
      } else {
        runningBalance -= entry.amount;
      }

      return {
        ...entry,
        balance: runningBalance,
      };
    });

    setEntries(ledger);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>{partyName} Ledger</Text>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.type.toUpperCase()}</Text>
            <Text>
              {formatCurrency(item.amount)}
            </Text>
            <Text>
              Balance: {formatCurrency(item.balance)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
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
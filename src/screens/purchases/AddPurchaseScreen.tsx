import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { addPurchase } from '../../services/purchaseService';
import { formatCurrency } from '../../utils/format';

export default function AddPurchaseScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [paymentType, setPaymentType] = useState<'cash' | 'credit'>('cash');

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    firestore()
      .collection('products')
      .where('userId', '==', user.uid)
      .get()
      .then(snapshot =>
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      );

    firestore()
      .collection('parties')
      .where('userId', '==', user.uid)
      .where('type', '==', 'supplier')
      .get()
      .then(snapshot =>
        setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      );
  }, []);

  const addItemRow = () => {
    setItems([
      ...items,
      {
        productId: '',
        productName: '',
        quantity: 0,
        costPrice: 0,
        total: 0,
      },
    ]);
  };

  const updateItem = (index: number, key: string, value: any) => {
    const updated = [...items];
    updated[index][key] = value;

    updated[index].total =
      updated[index].quantity * updated[index].costPrice;

    setItems(updated);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const updated = [...items];

    updated[index].productId = product.id;
    updated[index].productName = product.name;
    updated[index].costPrice = product.costPrice || 0;
    updated[index].total =
      updated[index].quantity * updated[index].costPrice;

    setItems(updated);
  };

  const grandTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.total || 0), 0);
  }, [items]);

  const validate = () => {
    if (!selectedSupplier) {
      Alert.alert('Select supplier');
      return false;
    }

    const validItems = items.filter(item => item.productId);

    if (validItems.length === 0) {
      Alert.alert('Add at least one valid item');
      return false;
    }

    for (const item of validItems) {
      if (!item.quantity || item.quantity <= 0) {
        Alert.alert(`Invalid quantity for ${item.productName}`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const validItems = items.filter(item => item.productId);
    await addPurchase(selectedSupplier!, validItems, paymentType);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Supplier */}
      <Text style={styles.sectionTitle}>Supplier</Text>
      {suppliers.map(s => (
        <TouchableOpacity
          key={s.id}
          style={[
            styles.selectItem,
            selectedSupplier === s.id && styles.selectedItem,
          ]}
          onPress={() => setSelectedSupplier(s.id)}
        >
          <Text>{s.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Items */}
      <Text style={styles.sectionTitle}>Items</Text>

      <FlatList
        data={items}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            {/* Product Picker */}
            <Text>Select Product</Text>
            {products.map(p => (
              <TouchableOpacity
                key={p.id}
                onPress={() => handleProductSelect(index, p.id)}
              >
                <Text>{p.name}</Text>
              </TouchableOpacity>
            ))}

            <TextInput
              placeholderTextColor="#888"
              placeholder="Quantity"
              keyboardType="numeric"
              style={styles.input}
              onChangeText={text =>
                updateItem(index, 'quantity', Number(text))
              }
            />

            <TextInput
              placeholderTextColor="#888"
              placeholder="Cost Price"
              keyboardType="numeric"
              value={String(item.costPrice)}
              style={styles.input}
              onChangeText={text =>
                updateItem(index, 'costPrice', Number(text))
              }
            />

            <Text>
              Total: {formatCurrency(item.total || 0)}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity onPress={addItemRow}>
        <Text style={{ marginVertical: 12 }}>+ Add Item</Text>
      </TouchableOpacity>

      {/* Payment Type */}
      <View style={styles.paymentRow}>
        <TouchableOpacity onPress={() => setPaymentType('cash')}>
          <Text style={paymentType === 'cash' ? styles.active : undefined}>
            Cash
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPaymentType('credit')}>
          <Text style={paymentType === 'credit' ? styles.active : undefined}>
            Credit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <Text style={styles.grandTotal}>
          Grand Total: {formatCurrency(grandTotal)}
        </Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={{ color: '#fff' }}>Save Purchase</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  selectItem: {
    padding: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  card: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 6,
    color: '#000',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  active: {
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 10,
  },
  grandTotal: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveBtn: {
    marginTop: 10,
    backgroundColor: '#1e88e5',
    padding: 12,
    alignItems: 'center',
  },
});
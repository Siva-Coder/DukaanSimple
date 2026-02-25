import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createSale } from '../../services/salesService';
import { colors } from '../../theme/colors';

/* ---------------- TYPES ---------------- */

type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  total: number;
  availableStock: number;
};

type Party = {
  id: string;
  name: string;
  phone?: string;
};

export default function AddSaleScreen() {
  const [selectedCustomer, setSelectedCustomer] = useState<Party | null>(null);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState('0');
  const [gst, setGst] = useState('0');
  const [amountPaid, setAmountPaid] = useState('0');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'bank'>('cash');

  const [customers, setCustomers] = useState<Party[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const [showCustomerSheet, setShowCustomerSheet] = useState(false);
  const [showProductSheet, setShowProductSheet] = useState(false);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const unsub1 = firestore()
      .collection('parties')
      .where('type', '==', 'customer')
      .onSnapshot(snap => {
        const list = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })) as Party[];
        setCustomers(list);
      });

    const unsub2 = firestore()
      .collection('products')
      .onSnapshot(snap => {
        const list = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));
        setProducts(list);
      });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  /* ---------------- FILTERED LISTS ---------------- */

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customers, customerSearch]);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  /* ---------------- TOTALS ---------------- */

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.total, 0),
    [items]
  );

  const gstAmount = useMemo(() => {
    return (subtotal * (Number(gst) || 0)) / 100;
  }, [subtotal, gst]);

  const totalAfterTax = subtotal + gstAmount - (Number(discount) || 0);

  const balance = totalAfterTax - (Number(amountPaid) || 0);

  /* ---------------- ITEM LOGIC ---------------- */

  const addProduct = useCallback((product: any) => {
    if (items.find(i => i.productId === product.id)) {
      Alert.alert('Already added');
      return;
    }

    const newItem: SaleItem = {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      rate: product.sellingPrice || 0,
      total: product.sellingPrice || 0,
      availableStock: product.stockQuantity || 0,
    };

    setItems(prev => [...prev, newItem]);
    setShowProductSheet(false);
  }, [items]);

  const updateItem = (index: number, field: 'quantity' | 'rate', value: string) => {
    const updated = [...items];
    const quantity =
      field === 'quantity' ? Number(value) : updated[index].quantity;
    const rate =
      field === 'rate' ? Number(value) : updated[index].rate;

    if (quantity > updated[index].availableStock) {
      Alert.alert('Stock not available');
      return;
    }

    updated[index] = {
      ...updated[index],
      quantity,
      rate,
      total: quantity * rate,
    };

    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!selectedCustomer) {
      Alert.alert('Select customer');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Add items');
      return;
    }

    try {
      await createSale({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        items,
        discount: Number(discount) || 0,
        amountPaid: Number(amountPaid) || 0,
        paymentMode,
      });

      Alert.alert('Invoice saved');
    } catch {
      Alert.alert('Error saving invoice');
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* CUSTOMER */}
        <Text style={styles.label}>Customer</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowCustomerSheet(true)}
        >
          <Text>
            {selectedCustomer?.name || 'Select Customer'}
          </Text>
        </TouchableOpacity>

        {/* ITEMS */}
        <Text style={styles.label}>Items</Text>

        {items.map((item, index) => (
  <View key={index} style={styles.itemCard}>
    
    {/* Left Info */}
    <View style={{ flex: 1 }}>
      <Text style={styles.itemTitle}>{item.productName}</Text>
      <Text style={styles.itemSub}>Stock: {item.availableStock}</Text>
    </View>

    {/* Quantity Controller */}
    <View style={styles.qtyControl}>
      <TouchableOpacity
        onPress={() =>
          updateItem(index, 'quantity', String(item.quantity - 1))
        }
      >
        <Ionicons name="remove" size={16} />
      </TouchableOpacity>

      <Text style={styles.qtyText}>{item.quantity}</Text>

      <TouchableOpacity
        onPress={() =>
          updateItem(index, 'quantity', String(item.quantity + 1))
        }
      >
        <Ionicons name="add" size={16} />
      </TouchableOpacity>
    </View>

    {/* Total */}
    <Text style={styles.itemAmount}>₹{item.total}</Text>

    {/* Delete */}
    <TouchableOpacity onPress={() => removeItem(index)}>
      <Ionicons name="trash-outline" size={20} color={colors.danger} />
    </TouchableOpacity>

  </View>
))}

        <TouchableOpacity
  style={styles.addItemButton}
  onPress={() => setShowProductSheet(true)}
>
  <Ionicons name="add-circle-outline" size={18} color="#fff" />
  <Text style={styles.addItemText}> Add Item</Text>
</TouchableOpacity>

        {/* SUMMARY */}
        <View style={styles.summary}>
          <SummaryRow label="Subtotal" value={subtotal} />

          <InputRow label="GST %" value={gst} onChange={setGst} />

          <InputRow label="Discount" value={discount} onChange={setDiscount} />

          <SummaryRow label="Total" value={totalAfterTax} bold />

          <InputRow label="Paid" value={amountPaid} onChange={setAmountPaid} />

          <SummaryRow label="Balance" value={balance} bold />
        </View>

        {/* PAYMENT */}
        <View style={styles.tabs}>
          {['cash', 'upi', 'bank'].map(mode => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.tab,
                paymentMode === mode && styles.tabActive,
              ]}
              onPress={() => setPaymentMode(mode as any)}
            >
              <Text
                style={{
                  color:
                    paymentMode === mode
                      ? '#fff'
                      : colors.textSecondary,
                }}
              >
                {mode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
  onPress={() => setAmountPaid(String(totalAfterTax))}
>
  <Text style={{ color: colors.primary }}>
    Mark as Fully Paid
  </Text>
</TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            Save Bill
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ---------------- CUSTOMER SHEET ---------------- */}
      <BottomSheet visible={showCustomerSheet} onClose={() => setShowCustomerSheet(false)}>
        <View style={styles.searchContainer}>
  <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
  <TextInput
    placeholder="Search customer"
    placeholderTextColor={colors.textSecondary}
    style={styles.searchInput}
    value={customerSearch}
    onChangeText={setCustomerSearch}
  />
</View>

        <FlatList
          data={filteredCustomers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const initials = item.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <TouchableOpacity
                style={styles.customerRow}
                onPress={() => {
                  setSelectedCustomer(item);
                  setShowCustomerSheet(false);
                }}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                  <Text style={{ color: colors.textSecondary }}>
                    {item.phone || ''}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>

      {/* ---------------- PRODUCT SHEET ---------------- */}
      <BottomSheet visible={showProductSheet} onClose={() => setShowProductSheet(false)}>
        <TextInput
          placeholder="Search product..."
          style={styles.searchInput}
          value={productSearch}
          onChangeText={setProductSearch}
        />

        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productRow}
              onPress={() => addProduct(item)}
            >
              <View>
                <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ color: colors.textSecondary }}>
                  Stock: {item.stockQuantity || 0}
                </Text>
              </View>
              <Text style={{ fontWeight: '600' }}>
                ₹{item.sellingPrice}
              </Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    </View>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

const SummaryRow = ({ label, value, bold }: any) => (
  <View style={styles.rowBetween}>
    <Text style={{ fontWeight: bold ? '600' : '400' }}>{label}</Text>
    <Text style={{ fontWeight: bold ? '600' : '400' }}>₹{value}</Text>
  </View>
);

const InputRow = ({ label, value, onChange }: any) => (
  <View style={styles.rowBetween}>
    <Text>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType="numeric"
      style={styles.inputInline}
    />
  </View>
);

const BottomSheet = ({ visible, children, onClose }: any) => (
  <Modal visible={visible} transparent animationType="slide">
    <Pressable style={styles.overlay} onPress={onClose} />
    <View style={styles.sheet}>{children}</View>
  </Modal>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 20, marginBottom: 6, color: colors.textSecondary },
  selector: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: { fontWeight: '600', marginBottom: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  field: { alignItems: 'center' },
  fieldLabel: { fontSize: 12, color: colors.textSecondary },
  inputSmall: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 6,
    width: 60,
    textAlign: 'center',
  },
  totalText: { fontWeight: '600', marginTop: 6 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  summary: {
    marginTop: 20,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  inputInline: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    minWidth: 80,
    textAlign: 'right',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  primaryButton: {
    marginTop: 25,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 12,
  paddingHorizontal: 10,
  marginBottom: 15,
},

searchInput: {
  flex: 1,
  padding: 10,
  color: colors.textPrimary,
},
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontWeight: '600' },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  itemCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.card,
  padding: 14,
  borderRadius: 16,
  marginBottom: 12,
},

itemTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: colors.textPrimary,
},

itemSub: {
  fontSize: 12,
  color: colors.textSecondary,
  marginTop: 2,
},

qtyControl: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F1F5F9',
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 10,
  marginHorizontal: 12,
},

qtyText: {
  marginHorizontal: 10,
  fontWeight: '600',
},

itemAmount: {
  fontWeight: '700',
  width: 70,
  textAlign: 'right',
},
addItemButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary,
  padding: 12,
  borderRadius: 14,
  marginTop: 8,
},

addItemText: {
  color: '#fff',
  fontWeight: '600',
},
});
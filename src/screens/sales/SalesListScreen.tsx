import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colors } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Sale = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  grandTotal: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
  createdAt: any;
};

export default function SalesListScreen({ navigation }: any) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const user = auth().currentUser;

  /* ---------------- FIRESTORE SUBSCRIPTION ---------------- */

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('sales')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const list: Sale[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Sale[];

        setSales(list);
      });

    return unsubscribe;
  }, [user]);

  /* ---------------- SEARCH FILTER ---------------- */

  const filteredSales = useMemo(() => {
    if (!search.trim()) return sales;

    return sales.filter(s =>
      s.customerName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      s.invoiceNumber
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [sales, search]);

  /* ---------------- SUMMARY ---------------- */

  const totalAmount = useMemo(() => {
    return filteredSales.reduce(
      (sum, s) => sum + (s.grandTotal || 0),
      0
    );
  }, [filteredSales]);

  const todayAmount = useMemo(() => {
    const today = new Date();
    return filteredSales
      .filter(s => {
        const date = s.createdAt?.toDate?.();
        return (
          date &&
          date.toDateString() === today.toDateString()
        );
      })
      .reduce((sum, s) => sum + s.grandTotal, 0);
  }, [filteredSales]);

  /* ---------------- REFRESH ---------------- */

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Sale }) => (
      <SaleItemCard item={item} navigation={navigation} />
    ),
    [navigation]
  );

  const keyExtractor = useCallback(
    (item: Sale) => item.id,
    []
  );

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search invoice or customer"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* SUMMARY STRIP */}
      <View style={styles.summaryContainer}>
        <SummaryItem label="Today" value={todayAmount} />
        <SummaryItem label="Total" value={totalAmount} />
      </View>

      {/* LIST */}
      <FlatList
        data={filteredSales}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No Sales Yet
            </Text>
            <Text style={styles.emptySub}>
              Your sales will appear here
            </Text>
          </View>
        }
      />

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('AddSale')}
      >
        <Text style={styles.primaryText}>Add Sale</Text>
        <Ionicons name="add" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- SUMMARY COMPONENT ---------------- */

const SummaryItem = React.memo(
  ({ label, value }: { label: string; value: number }) => {
    return (
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValue}>
          ₹{value.toFixed(2)}
        </Text>
        <Text style={styles.summaryLabel}>
          {label}
        </Text>
      </View>
    );
  }
);

/* ---------------- SALE CARD ---------------- */

const SaleItemCard = React.memo(
  ({ item, navigation }: any) => {
    const statusColor = useMemo(() => {
      switch (item.status) {
        case 'paid':
          return colors.success;
        case 'partial':
          return '#F59E0B';
        default:
          return colors.danger;
      }
    }, [item.status]);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('SaleDetails', {
            id: item.id,
          })
        }
      >
        <View style={styles.rowBetween}>
          <Text style={styles.invoice}>
            {item.invoiceNumber}
          </Text>

          <Text
            style={{
              color: statusColor,
              fontWeight: '600',
              fontSize: 12,
            }}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.customer}>
          {item.customerName}
        </Text>

        <View style={styles.rowBetween}>
          <Text style={styles.amount}>
            ₹{item.grandTotal.toFixed(2)}
          </Text>

          {item.balance > 0 && (
            <Text style={styles.balance}>
              Due ₹{item.balance.toFixed(2)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  summaryItem: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 14,
    width: '48%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoice: {
    fontWeight: '600',
    fontSize: 15,
  },
  customer: {
    marginTop: 4,
    color: colors.textSecondary,
  },
  amount: {
    marginTop: 8,
    fontWeight: '700',
    fontSize: 16,
  },
  balance: {
    marginTop: 8,
    color: colors.danger,
  },
  emptyContainer: {
    marginTop: 120,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySub: {
    marginTop: 6,
    color: colors.textSecondary,
  },
  primaryButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
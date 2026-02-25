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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colors } from '../../theme/colors';
import AppAlert from '../../components/common/AppAlert';

/* ---------------- TYPES ---------------- */

type Sale = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  grandTotal: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
  createdAt: any;
};

/* ---------------- COMPONENT ---------------- */

export default function SalesListScreen({ navigation }: any) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const user = auth().currentUser;

  /* ---------------- FETCH SALES ---------------- */

const subscribeSales = useCallback(() => {
  if (!user) return;

  return firestore()
    .collection('sales')
    .where('userId', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        if (!snapshot) return;

        const list: Sale[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Sale[];

        setSales(list);
      },
      error => {
        console.log('Sales snapshot error:', error);
      }
    );
}, [user]);

useEffect(() => {
  let unsubscribe: any;

  if (user) {
    unsubscribe = subscribeSales();
  }

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [user, subscribeSales]);

  /* ---------------- REFRESH ---------------- */

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  /* ---------------- MEMOIZED ITEM ---------------- */

  const renderItem = useCallback(
    ({ item }: { item: Sale }) => {
      return <SaleItemCard item={item} navigation={navigation} />;
    },
    [navigation]
  );

  const keyExtractor = useCallback((item: Sale) => item.id, []);

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.container}>
      <FlatList
        data={sales}
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

      <AppAlert
        visible={alertVisible}
        title="Info"
        message="Coming soon"
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

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
          navigation.navigate('SaleDetails', { id: item.id })
        }
      >
        <View style={styles.rowBetween}>
          <Text style={styles.invoice}>
            {item.invoiceNumber}
          </Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + '20' },
            ]}
          >
            <Text style={{ color: statusColor, fontSize: 12 }}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.customer}>
          {item.customerName}
        </Text>

        <View style={styles.rowBetween}>
          <Text style={styles.amount}>
            ₹{item.grandTotal}
          </Text>

          {item.balance > 0 && (
            <Text style={styles.balance}>
              Due ₹{item.balance}
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
    alignItems: 'center',
  },
  invoice: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.textPrimary,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  emptyContainer: {
    marginTop: 100,
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
});
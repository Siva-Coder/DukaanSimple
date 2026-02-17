import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useProductStore } from '../../store/useProductStore';
import { colors } from '../../constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import ListSkeleton from '../../components/skeleton/ListSkeleton';

export default function ProductListScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const { products, loading, initProductsListener } =
    useProductStore();

  const onRefresh = () => {
    setRefreshing(true);
    initProductsListener();
    setRefreshing(false);
  };


  useFocusEffect(
    useCallback(() => {
      const unsubscribe = initProductsListener();
      return unsubscribe;
    }, [])
  );

  if (loading) return <ListSkeleton />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1e88e5']}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>
              Stock: {item.stockQuantity} {item.unit}
            </Text>
            <Text>Selling: ₹{item.sellingPrice}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.fabText}>Add Products</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
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
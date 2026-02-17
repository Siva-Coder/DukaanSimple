import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { usePartyStore } from '../../store/usePartyStore';
import { PartyType } from '../../models/Party';

export default function PartyListScreen({ navigation }: any) {
  const [type, setType] = useState<PartyType>('customer');

  const {
    customers,
    suppliers,
    loading,
    initPartyListener,
  } = usePartyStore();

  useEffect(() => {
    initPartyListener(type);
  }, [type]);


  const data = type === 'customer' ? customers : suppliers;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            type === 'customer' && styles.activeToggle,
          ]}
          onPress={() => setType('customer')}
        >
          <Text
            style={[
              styles.toggleText,
              type === 'customer' && styles.activeText,
            ]}
          >
            Customers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            type === 'supplier' && styles.activeToggle,
          ]}
          onPress={() => setType('supplier')}
        >
          <Text
            style={[
              styles.toggleText,
              type === 'supplier' && styles.activeText,
            ]}
          >
            Suppliers
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('PartyLedger', {
                  partyId: item.id,
                  partyName: item.name,
                })
              }
            >
              <Text style={styles.name}>{type === "customer" ? item.name : item.firmName || item.ownerName}</Text>
              <Text style={styles.balance}>
                Balance: ₹ {item.balance}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate('AddParty', { partyType: type })
        }
      >
        <Text style={styles.fabText}>
          {type === 'customer' ? 'Add Customer' : 'Add Supplier'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#1e88e5',
  },
  toggleText: {
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
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
  balance: {
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#1e88e5',
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: { color: '#fff', fontSize: 22 }
});
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import { addParty } from '../../services/partyService';

export default function AddPartyScreen({ navigation, route }: any) {
  const { partyType } = route.params;
  const [type, setType] = useState<'customer' | 'supplier'>(partyType || 'customer');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [firmName, setFirmName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Enter name');
      return;
    }

    try {
      await addParty({
        name,
        phone,
        type,
        firmName: type === 'supplier' ? firmName : undefined,
        ownerName: type === 'supplier' ? ownerName : undefined,
        address: type === 'supplier' ? address : undefined,
        alternatePhone: type === 'supplier' ? alternatePhone : undefined,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Failed to add');
    }
  };

  return (
    <View style={styles.container}>
      {type === 'customer' && (
        <>
          <TextInput
            placeholderTextColor="#888"
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholderTextColor="#888"
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </>
      )}

      {type === 'supplier' && (
        <>
          <TextInput
            placeholderTextColor="#888"
            placeholder="Firm Name"
            value={firmName}
            onChangeText={setFirmName}
            style={styles.input}
          />

          <TextInput
            placeholderTextColor="#888"
            placeholder="Owner Name"
            value={ownerName}
            onChangeText={setOwnerName}
            style={styles.input}
          />

          <TextInput
            placeholderTextColor="#888"
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            placeholderTextColor="#888"
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
            style={[styles.input, { height: 80 }]}
          />

          <TextInput
            placeholderTextColor="#888"
            placeholder="Alternate Phone"
            value={alternatePhone}
            onChangeText={setAlternatePhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={{ color: '#fff' }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1e88e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
});
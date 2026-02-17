import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { addProduct } from '../../services/productService';

export default function AddProductScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');

  const handleSave = async () => {
    if (!name || !unit || !stock) {
      Alert.alert('Fill required fields');
      return;
    }

    try {
      await addProduct(
        name,
        unit,
        Number(costPrice || 0),
        Number(sellingPrice || 0),
        Number(stock)
      );

      navigation.goBack();
    } catch (error) {
      console.error('Add Product Error:', error);
      Alert.alert('Error', 'Failed to add product');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
  placeholderTextColor="#888"
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput 
  placeholderTextColor="#888"
        placeholder="Unit (kg, bag, piece)"
        value={unit}
        onChangeText={setUnit}
        style={styles.input}
      />
      <TextInput 
  placeholderTextColor="#888"
        placeholder="Cost Price"
        keyboardType="numeric"
        value={costPrice}
        onChangeText={setCostPrice}
        style={styles.input}
      />
      <TextInput 
  placeholderTextColor="#888"
        placeholder="Selling Price"
        keyboardType="numeric"
        value={sellingPrice}
        onChangeText={setSellingPrice}
        style={styles.input}
      />
      <TextInput 
  placeholderTextColor="#888"
        placeholder="Initial Stock"
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={{ color: '#fff' }}>Save Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
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
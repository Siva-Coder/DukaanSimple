import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sendOTP } from '../../services/authService';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

type NavigationProp = any; // you can strongly type later

export default function PhoneScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Number', 'Enter 10 digit mobile number');
      return;
    }

    try {
      setLoading(true);

      const confirmation: FirebaseAuthTypes.ConfirmationResult =
        await sendOTP(`+91${phone}`);

      navigation.navigate('OTP', {
        confirmation,
        phone: `+91${phone}`,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dukaan Simple</Text>

      <Text style={styles.label}>Enter Mobile Number</Text>

      <View style={styles.phoneContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput 
  placeholderTextColor="#888"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          placeholder="9876543210"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  phoneContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  countryCode: {
    paddingHorizontal: 12,
    fontSize: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e88e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
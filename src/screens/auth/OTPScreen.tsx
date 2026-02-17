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
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { confirmOTP } from '../../services/authService';

type Props = {
  route: {
    params: {
      confirmation: FirebaseAuthTypes.ConfirmationResult;
      phone: string;
    };
  };
};

export default function OTPScreen({ route }: Props) {
  const { confirmation, phone } = route.params;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid OTP', 'Enter 6 digit OTP');
      return;
    }

    try {
      setLoading(true);
      await confirmOTP(confirmation, code);
      // No navigation here.
      // onAuthStateChanged will automatically switch to MainTabs
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>
        OTP sent to {phone}
      </Text>

      <TextInput 
  placeholderTextColor="#888"
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        placeholder="Enter 6 digit OTP"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 24,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 24,
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
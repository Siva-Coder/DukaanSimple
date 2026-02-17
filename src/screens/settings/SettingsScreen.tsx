import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function SettingsScreen() {
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(doc => {
        setSubscription(doc.data()?.subscription);
      });
  }, []);


  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: 'bold' }}>Subscription</Text>

      <Text>Status: {subscription?.status || 'Trial'}</Text>

      {subscription?.expiryDate && (
        <Text>
          Expires on:{' '}
          {new Date(subscription.expiryDate).toLocaleDateString()}
        </Text>
      )}
    </View>

  );
}
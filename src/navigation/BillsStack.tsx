import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BillsScreen from '../screens/bills/BillsScreen';

const Stack = createNativeStackNavigator();

export default function BillsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BillsHome" component={BillsScreen} />
    </Stack.Navigator>
  );
}
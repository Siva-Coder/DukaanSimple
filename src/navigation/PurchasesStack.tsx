import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PurchaseListScreen from '../screens/purchases/PurchaseListScreen';

const Stack = createNativeStackNavigator();

export default function PurchasesStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="PurchaseList"
        component={PurchaseListScreen}
        options={{ title: 'Purchases' }}
      />
    </Stack.Navigator>
  );
}
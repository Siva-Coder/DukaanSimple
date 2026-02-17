import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddPurchaseScreen from '../screens/purchases/AddPurchaseScreen';
import PurchaseListScreen from '../screens/purchases/PurchaseListScreen';

const Stack = createNativeStackNavigator();

export default function PurchasesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PurchaseList"
        component={PurchaseListScreen}
        options={{ title: 'Purchases' }}
      />
      <Stack.Screen
        name="AddPurchase"
        component={AddPurchaseScreen}
        options={{ title: 'Add Purchase' }}
      />
    </Stack.Navigator>
  );
}
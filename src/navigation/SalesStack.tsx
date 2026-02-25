import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SalesListScreen from '../screens/sales/SalesListScreen';
import AddSaleScreen from '../screens/main/AddSaleScreen';

const Stack = createNativeStackNavigator();

export default function SalesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SalesList"
        component={SalesListScreen}
        options={{ title: 'Sales' }}
      />
      <Stack.Screen
        name="AddSale"
        component={AddSaleScreen}
        options={{ title: 'New Sale' }}
      />
    </Stack.Navigator>
  );
}
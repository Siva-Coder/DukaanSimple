import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SalesListScreen from '../screens/sales/SalesListScreen';

const Stack = createNativeStackNavigator();

export default function SalesStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="SalesList"
        component={SalesListScreen}
        options={{ title: 'Sales' }}
      />
    </Stack.Navigator>
  );
}
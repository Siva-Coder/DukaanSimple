import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from '../screens/main/ProductListScreen';

const Stack = createNativeStackNavigator();

export default function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
    </Stack.Navigator>
  );
}
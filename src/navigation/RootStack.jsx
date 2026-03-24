import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { colors } from '../constants/theme';
import { TouchableOpacity } from 'react-native';
import ProductsStack from './ProductsStack';
import AddSaleScreen from '../screens/main/AddSaleScreen';
import AddPurchaseScreen from '../screens/purchases/AddPurchaseScreen';
import AddPartyScreen from '../screens/main/AddPartyScreen';
import AddProductScreen from '../screens/main/AddProductScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{
        headerShown: false
      }} name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
        }}
      />
      <Stack.Screen name='AddSale' options={{
        presentation: 'modal',
        title: 'Add Sale',
      }} component={AddSaleScreen} />
      <Stack.Screen
        name="AddPurchase"
        component={AddPurchaseScreen}
        options={{
          title: 'Add Purchase',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="AddParty"
        component={AddPartyScreen}
        options={{ title: 'Add Party' }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: 'Add Product' }}
      />
      <Stack.Screen name='Products' options={{
        headerShown: false
      }} component={ProductsStack} />
    </Stack.Navigator>
  );
}
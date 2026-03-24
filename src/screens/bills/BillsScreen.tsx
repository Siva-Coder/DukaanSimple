import React, { useMemo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '../../theme/themeContext';
import SalesListScreen from '../sales/SalesListScreen';
import PurchaseListScreen from '../purchases/PurchaseListScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

const Tab = createMaterialTopTabNavigator();

export default function BillsScreen() {
  const { theme } = useTheme();

  const screenOptions = 
  useMemo(
    () => ({
      lazy: true,
      swipeEnabled: true,
      tabBarStyle: {
        backgroundColor: theme.card,
        elevation: 0,
      },
      tabBarIndicatorStyle: {
        backgroundColor: theme.primary,
        height: 100,
      },
      tabBarLabelStyle: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'none' as const,
      },
      tabBarActiveTintColor: colors.textLight,
      tabBarInactiveTintColor: colors.textDark,
    }),
    [theme]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Sales" component={SalesListScreen} options={{ title: 'Sales' }} />
      <Tab.Screen name="Purchases" component={PurchaseListScreen} options={{ title: 'Purchases' }} />
      {/* <Tab.Screen name="Money In" component={PaymentInListScreen} />
      <Tab.Screen name="Money Out" component={PaymentOutListScreen} /> */}
    </Tab.Navigator>
    </SafeAreaView>
  );
}
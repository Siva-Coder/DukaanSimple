import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportsHomeScreen from '../screens/reports/ReportsHomeScreen';
import SalesReportScreen from '../screens/reports/SalesReportScreen';
import PurchaseReportScreen from '../screens/reports/PurchaseReportScreen';
import PartyLedgerScreen from '../screens/reports/PartyLedgerScreen';

const Stack = createNativeStackNavigator();

export default function ReportsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ReportsHome" component={ReportsHomeScreen} options={{ title: 'Reports' }} />
      <Stack.Screen name="SalesReport" component={SalesReportScreen} options={{ title: 'Sales Report' }} />
      <Stack.Screen name="PurchaseReport" component={PurchaseReportScreen} options={{ title: 'Purchase Report' }} />
      <Stack.Screen name="PartyLedger" component={PartyLedgerScreen} options={{ title: 'Party Ledger' }} />
    </Stack.Navigator>
  );
}
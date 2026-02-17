import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartyListScreen from '../screens/main/PartyListScreen';
import AddPartyScreen from '../screens/main/AddPartyScreen';
import PartyLedgerScreen from '../screens/reports/PartyLedgerScreen';

const Stack = createNativeStackNavigator();

export default function PartiesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PartyList"
        component={PartyListScreen}
        options={{ title: 'Parties' }}
      />
      <Stack.Screen
        name="AddParty"
        component={AddPartyScreen}
        options={{ title: 'Add Party' }}
      />
      <Stack.Screen
        name="PartyLedger"
        component={PartyLedgerScreen}
        options={{ title: 'Ledger' }}
      />
    </Stack.Navigator>
  );
}
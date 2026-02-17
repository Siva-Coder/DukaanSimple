import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { colors } from '../constants/theme';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({
      headerShown: false,
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerTitle: 'Dukaan Simple',
      headerRight: () => <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
        style={{ marginRight: 10 }}
      >
        <Ionicons name="settings-outline" color={colors.background} size={28} />
      </TouchableOpacity>,
    })}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
}
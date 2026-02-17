import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/main/DashboardScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={({ navigation }) => ({
          title: 'Dashboard',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate('Settings')}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="person-circle-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductsStack from './ProductsStack';
import PartiesStack from './PartiesStack';
import ReportsStack from './ReportsStack';
import PurchasesStack from './PurchasesStack';
// import DashboardStack from './DashboardStack';
import DashboardScreen from '../screens/main/DashboardScreen';
import { colors } from '../constants/theme';
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { height: 60, alignItems: 'center', justifyContent: 'center', paddingTop: 5, backgroundColor: '#fff', borderTopWidth: 0, elevation: 5 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Parties') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Purchases') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#1e88e5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" options={({ navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
          paddingTop: 0
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
        </TouchableOpacity>
      })} component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductsStack} />
      <Tab.Screen name="Purchases" component={PurchasesStack} />
      <Tab.Screen name="Parties" component={PartiesStack} />
      <Tab.Screen name="Reports" component={ReportsStack} />
    </Tab.Navigator>
  );
};
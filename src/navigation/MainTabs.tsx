import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

import DashboardScreen from '../screens/main/DashboardScreen';
import PartiesStack from './PartiesStack';

import QuickAddSheet from '../components/sheets/QuickAddSheet';
import { colors } from '../theme/colors';
import { getGreeting } from '../utils/greeting';
import MoreStack from './MoreStack';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const navigation = useNavigation<any>();
  const [quickVisible, setQuickVisible] = useState(false);

  const openQuickAdd = useCallback(() => {
    setQuickVisible(true);
  }, []);

  const closeQuickAdd = useCallback(() => {
    setQuickVisible(false);
  }, []);

  const handleQuickNavigate = useCallback(
    (route: string) => {
      navigation.navigate(route);
    },
    [navigation]
  );

  const handleBillsPress = useCallback(() => {
    navigation.navigate('BillsSheet'); // implement later
  }, [navigation]);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabInactive,

          tabBarItemStyle: styles.tabItem,

          tabBarIcon: ({ focused, color }) => {
            let iconName: string = '';

            switch (route.name) {
              case 'Dashboard':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Bills':
                iconName = focused ? 'receipt' : 'receipt-outline';
                break;
              case 'Parties':
                iconName = focused ? 'people' : 'people-outline';
                break;
              case 'More':
                iconName = focused ? 'menu' : 'menu-outline';
                break;
            }

            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        {/* DASHBOARD */}
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerShadowVisible: false,
            header: () => <DashboardHeader navigation={navigation} />,
            tabBarItemStyle: styles.activeBorder,
          })}
        />

        {/* BILLS (Action Only) */}
        <Tab.Screen
          name="Bills"
          component={View}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              handleBillsPress();
            },
          }}
        />

        {/* CENTER FAB */}
        <Tab.Screen
          name="QuickAdd"
          component={View}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <View style={styles.fabButton}>
                <Ionicons name="add" size={24} color="#fff" />
              </View>
            ),
            tabBarButton: props => (
              <TouchableOpacity
                {...props}
                activeOpacity={0.85}
                onPress={openQuickAdd}
              />
            ),
          }}
        />

        {/* PARTIES */}
        <Tab.Screen name="Parties" component={PartiesStack} />

        {/* MORE */}
        <Tab.Screen name="More" component={MoreStack} />
      </Tab.Navigator>

      {/* QUICK ADD SHEET */}
      <QuickAddSheet
        visible={quickVisible}
        onClose={closeQuickAdd}
        onNavigate={handleQuickNavigate}
      />
    </>
  );
}

/* ---------------- HEADER ---------------- */

const DashboardHeader = React.memo(({ navigation }: any) => {
  const greeting = getGreeting();
  const user = auth().currentUser;
  const displayName = user?.displayName || 'User';

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>
            {greeting}, {displayName}
          </Text>
          <Text style={styles.headerSub}>
            Here’s today's business summary
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons
            name="settings-outline"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  tabItem: {
    paddingTop: 6,
  },
  activeBorder: {
    borderTopWidth: 3,
    borderTopColor: colors.primary,
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 14, // square feel (not fully round)
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 10,
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSub: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
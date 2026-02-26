import React, { useRef, useCallback, useMemo } from 'react';
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
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import DashboardScreen from '../screens/main/DashboardScreen';
import PartiesStack from './PartiesStack';
import MoreStack from './MoreStack';
import AppBottomSheet from '../components/common/AppBottomSheet';

import { useTheme } from '../theme/themeContext';
import { colors } from '../theme/colors';
import { getGreeting } from '../utils/greeting';

const Tab = createBottomTabNavigator();

const EmptyScreen = () => null;

export default function MainTabs() {
  const navigation = useNavigation<any>();
  const quickSheetRef = useRef<BottomSheetModal>(null);
  const billsSheetRef = useRef<BottomSheetModal>(null);
  const { theme } = useTheme();

  const openQuickSheet = useCallback(() => {
    console.log(quickSheetRef.current);

    quickSheetRef.current?.present();
  }, []);

  const openBillsSheet = useCallback(() => {
    billsSheetRef.current?.present();
  }, []);

  const handleNavigate = useCallback(
    (route: string) => {
      quickSheetRef.current?.close();
      billsSheetRef.current?.close();
      setTimeout(() => navigation.navigate(route), 250);
    },
    [navigation]
  );

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            height: 64,
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 4,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.tabInactive,

          tabBarIcon: ({ focused, color }) => {
            let iconName = '';

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

            return (
              <View style={{ alignItems: 'center' }}>
                {focused && (
                  <View
                    style={{
                      height: 3,
                      width: 55,
                      backgroundColor: theme.primary,
                      borderRadius: 2,
                      marginBottom: 6,
                    }}
                  />
                )}
                <Ionicons name={iconName} size={22} color={color} />
              </View>
            );
          },
        })}
      >
        {/* DASHBOARD */}
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({ navigation }) => ({
            headerShown: true,
            header: () => <DashboardHeader navigation={navigation} />,
          })}
        />

        {/* BILLS */}
        <Tab.Screen
          name="Bills"
          component={View}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              openBillsSheet();
            },
          }}
        />

        {/* QUICK ADD FAB */}
        <Tab.Screen
          name="Quick"
          component={EmptyScreen}
          options={{
            headerShown: false,
            tabBarLabel: () => null,
            tabBarIcon: () => (
              <View style={[styles.fabButton, { backgroundColor: theme.primary }]}>
                <Ionicons name="add" size={24} color="#fff" />
              </View>
            ),
            tabBarButton: props => (
              <TouchableOpacity {...props} onPress={openQuickSheet} />
            ),
          }}
        />

        <Tab.Screen name="Parties" component={PartiesStack} />
        <Tab.Screen name="More" component={MoreStack} />
      </Tab.Navigator>

      {/* QUICK CREATE SHEET */}
        <AppBottomSheet ref={quickSheetRef} snap="35%">
          <QuickGrid onNavigate={handleNavigate} />
        </AppBottomSheet>

      {/* BILLS SHEET */}
        <AppBottomSheet ref={billsSheetRef} snap="40%">
          <BillsGrid onNavigate={handleNavigate} />
        </AppBottomSheet>
    </>
  );
}

/* ---------------- HEADER ---------------- */

const DashboardHeader = React.memo(({ navigation }: any) => {
  const greeting = getGreeting();
  const { theme } = useTheme();
  const user = auth().currentUser;
  const displayName = user?.displayName || 'My Business';

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background }}>
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
            size={26}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

/* ---------------- QUICK GRID ---------------- */

const QuickGrid = React.memo(({ onNavigate }: any) => {
  const { theme } = useTheme();

  return (
    <BottomSheetView style={styles.sheetContainer}>
      <Text style={styles.sheetTitle}>Quick Create</Text>
      <View style={styles.grid}>
        <SheetItem icon="receipt-outline" label="Sale" onPress={() => onNavigate('CreateSale')} />
        <SheetItem icon="cart-outline" label="Purchase" onPress={() => onNavigate('CreatePurchase')} />
        <SheetItem icon="person-add-outline" label="Customer" onPress={() => onNavigate('AddCustomer')} />
        <SheetItem icon="business-outline" label="Supplier" onPress={() => onNavigate('AddSupplier')} />
        <SheetItem icon="cube-outline" label="Product" onPress={() => onNavigate('AddProduct')} />
      </View>
    </BottomSheetView>
  );
});

/* ---------------- BILLS GRID ---------------- */

const BillsGrid = React.memo(({ onNavigate }: any) => {
  return (
    <BottomSheetView style={styles.sheetContainer}>
      <Text style={styles.sheetTitle}>Transactions</Text>
      <View style={styles.grid}>
        <SheetItem icon="receipt-outline" label="Sales" onPress={() => onNavigate('SalesList')} />
        <SheetItem icon="cart-outline" label="Purchases" onPress={() => onNavigate('PurchasesList')} />
        <SheetItem icon="arrow-down-outline" label="Payment In" onPress={() => onNavigate('PaymentIn')} />
        <SheetItem icon="arrow-up-outline" label="Payment Out" onPress={() => onNavigate('PaymentOut')} />
      </View>
    </BottomSheetView>
  );
});

const SheetItem = React.memo(({ icon, label, onPress }: any) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={20} color={theme.primary} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
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
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSub: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '47%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
});
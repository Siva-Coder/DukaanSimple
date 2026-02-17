import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { getDashboardData, getWeeklySales } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/format';
import { colors } from '../../constants/theme';
// import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import { useFocusEffect } from '@react-navigation/native';
import DashboardSkeleton from '../../components/skeleton/DashboardSkeleton';


export default function DashboardScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
const [refreshing, setRefreshing] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);


  const user = auth().currentUser;
  const displayName = user?.displayName || 'User';

  useFocusEffect(
    useCallback(() => {
      loadSummary();
      return () => { };
    }, [])
  );

  const loadSummary = async () => {
    setLoadingSummary(true);

    const result = await getDashboardData();
    setSummaryData(result);

    setLoadingSummary(false);

    // Lazy load chart AFTER summary renders
    setTimeout(() => {
      loadWeekly();
    }, 300);
  };

  const loadWeekly = async () => {
    setLoadingChart(true);

    const weekly = await getWeeklySales();
    setWeeklyData(weekly);

    setLoadingChart(false);
  };

const onRefresh = async () => {
  setRefreshing(true);
  await loadSummary();   // your fetch function
  setRefreshing(false);
};


  /*   useEffect(() => {
      loadData();
    }, []);
  
    const loadData = async () => {
      const result = await getDashboardData();
      setData(result);
      const weeklyResult = await getWeeklySales();
      setWeeklyData(weeklyResult);
    }; */

  // if (!data) return null;

if (loadingSummary) {
  return <DashboardSkeleton />;
}


  return (
    <ScrollView style={styles.container} refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#1e88e5']}
    />
  }>
      {/* Greeting */}
      <Text style={styles.greeting}>
        Hi {displayName} 👋
      </Text>

      {/* Today Overview */}
      <Text style={styles.sectionTitle}>Today</Text>
      <View style={styles.row}>
        <Card
          title="Sales"
          value={formatCurrency(summaryData.todaySales)}
          color={colors.success}
        />
        <Card
          title="Purchases"
          value={formatCurrency(summaryData.todayPurchases)}
          color={colors.danger}
        />
      </View>

      {/* Credit Summary */}
      <Text style={styles.sectionTitle}>Credit Summary</Text>
      <View style={styles.row}>
        <Card
          title="Receivables"
          value={formatCurrency(summaryData.receivables)}
          color={colors.success}
        />
        <Card
          title="Payables"
          value={formatCurrency(summaryData.payables)}
          color={colors.danger}
        />
      </View>

      {/* <Text style={styles.sectionTitle}>Last 7 Days Sales</Text>

      {loadingChart ? (
        <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading chart...</Text>
        </View>
      ) : (
        weeklyData && (
          <View style={styles.chartContainer}>
            <BarChart
              data={weeklyData.values.map((value: number, index: number) => ({
                value,
                label: weeklyData.labels[index].slice(0, 3),
              }))}
              barWidth={22}
              spacing={20}
              roundedTop
              frontColor={colors.primary}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
            />
          </View>
        )
      )} */}

      {/* {weeklyData && (
        <View style={{ height: 200, marginVertical: 10 }}>
          <View style={styles.chartContainer}>
          <BarChart
            style={{ flex: 1 }}
            data={weeklyData.values}
            svg={{ fill: colors.primary }}
            contentInset={{ top: 10, bottom: 10 }}
            spacingInner={0.3}
          >
            <Grid />
          </BarChart>
          </View>

          <View style={styles.chartContainer}>
          <XAxis
            style={{ marginTop: 10 }}
            data={weeklyData.values}
            formatLabel={(value, index) =>
              weeklyData.labels[index].slice(0, 5)
            }
            contentInset={{ left: 20, right: 20 }}
            svg={{ fontSize: 10, fill: '#666' }}
          />
          </View>
        </View>
      )} */}

      {/* Stock Value */}
      <Text style={styles.sectionTitle}>Inventory</Text>
      <View style={styles.fullCard}>
        <Text style={styles.cardTitle}>Stock Value</Text>
        <Text style={styles.cardValue}>
          {formatCurrency(summaryData.stockValue)}
        </Text>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Purchases')}
      >
        <Text style={styles.actionText}>Add Purchase</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { marginBottom: 40 }]}
        onPress={() => navigation.navigate('Parties')}
      >
        <Text style={styles.actionText}>Add Customer / Supplier</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- Card Component ---------- */

const Card = ({ title, value, color }: any) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={[styles.cardValue, { color }]}>{value}</Text>
  </View>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    width: '48%',
    borderLeftWidth: 5,
    elevation: 3,
  },
  fullCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },
});
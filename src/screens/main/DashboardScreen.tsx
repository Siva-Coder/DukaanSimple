import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-gifted-charts';
import DashboardSkeleton from '../../components/skeleton/DashboardSkeleton';
import { Card } from '../../components/common/Card';
import { getDashboardData, getWeeklySales } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/format';
import { colors } from '../../theme/colors';

export default function DashboardScreen({ navigation }: any) {
  const [summaryData, setSummaryData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any>(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------- Initial Load ---------- */

  useEffect(() => {
    loadAll(true);
  }, []);

  /* ---------- Refresh On Focus (NO skeleton flash) ---------- */

  useFocusEffect(
    useCallback(() => {
      if (!initialLoading) {
        loadAll(false);
      }
    }, [initialLoading])
  );

  const loadAll = async (isInitial = false) => {
    if (isInitial) setInitialLoading(true);

    const [summary, weekly] = await Promise.all([
      getDashboardData(),
      getWeeklySales(),
    ]);

    setSummaryData(summary);
    setWeeklyData(weekly);

    if (isInitial) setInitialLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll(false);
    setRefreshing(false);
  };

  const hasWeeklyActivity = useMemo(() => {
    return weeklyData?.values?.some((v: number) => v > 0);
  }, [weeklyData]);

  if (initialLoading || !summaryData) {
    return <DashboardSkeleton />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* Today Overview */}
        <View style={styles.cardRow}>
          <Card style={styles.flexCard}>
            {summaryData.todaySales > 0 ? (
              <>
                <View style={styles.row}>
                  <View
                    style={[styles.dot, { backgroundColor: colors.success }]}
                  />
                  <Text style={styles.cardLabel}>Sales</Text>
                </View>

                <Text style={styles.amount}>
                  {formatCurrency(summaryData.todaySales)}
                </Text>
              </>
            ) : (
              <View style={styles.emptyCardContainer}>
                <Ionicons
                  name="cart-outline"
                  size={24}
                  color={colors.textSecondary}
                />
                <Text style={styles.emptyTitle}>
                  No Sales Today
                </Text>
                <TouchableOpacity
                  style={styles.inlinePrimaryButton}
                  onPress={() => navigation.navigate('Sales')}
                >
                  <Text style={styles.inlinePrimaryText}>
                    Add Sale
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>

          <Card style={styles.flexCard}>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: colors.danger }]} />
              <Text style={styles.cardLabel}>Purchases</Text>
            </View>
            <Text
              style={styles.amount}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {formatCurrency(summaryData.todayPurchases)}
            </Text>
          </Card>
        </View>

        {/* Credit Summary */}
        <Text style={styles.sectionTitle}>Credit Summary</Text>

        <View style={styles.cardRow}>
          <Card style={styles.flexCard}>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: colors.success }]} />
              <Text style={styles.cardLabel}>Receivables</Text>
            </View>
            <Text style={styles.amount} adjustsFontSizeToFit numberOfLines={1}>
              {formatCurrency(summaryData.receivables)}
            </Text>
          </Card>

          <Card style={styles.flexCard}>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: colors.danger }]} />
              <Text style={styles.cardLabel}>Payables</Text>
            </View>
            <Text style={styles.amount}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {formatCurrency(summaryData.payables)}
            </Text>
          </Card>
        </View>

        {/* Weekly Mini Chart */}
        <Text style={styles.sectionTitle}>Last 7 Days Sales</Text>

        <Card style={styles.weeklyCard}>
          {hasWeeklyActivity ? (
            <LineChart
              data={weeklyData.values.map((v: number) => ({ value: v }))}
              thickness={2}
              color={colors.primary}
              hideDataPoints
              hideYAxisText
              hideRules
              xAxisColor="transparent"
              yAxisColor="transparent"
              areaChart
              startFillColor={colors.primary}
              endFillColor="#FFFFFF"
              startOpacity={0.15}
              endOpacity={0}
            />
          ) : (
            <View style={styles.weeklyEmptyContainer}>
              <Ionicons
                name="analytics-outline"
                size={28}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyTitle}>
                No activity yet
              </Text>
              <Text style={styles.emptySub}>
                Sales data will appear here once you start billing.
              </Text>
            </View>
          )}
        </Card>

        {/* Inventory */}
        <Text style={styles.sectionTitle}>Inventory</Text>

        <Card style={{ paddingVertical: 24, marginHorizontal: 20 }}>
          <Text style={styles.cardLabel}>Stock Value</Text>
          <Text style={styles.amount}>
            {formatCurrency(summaryData.stockValue)}
          </Text>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Purchases')}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 28,
    marginBottom: 14,
    paddingHorizontal: 20,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },

  amount: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  cardLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  cardRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 14,
  },

  weeklyCard: {
    marginHorizontal: 20,
    paddingVertical: 24,
  },

  weeklyEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  emptySub: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  flexCard: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  emptyChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  inlinePrimaryButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },

  inlinePrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
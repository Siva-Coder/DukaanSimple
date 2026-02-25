import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const db = firestore();

export const getDashboardData = async () => {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayTimestamp = todayStart.getTime();

  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0
  );

  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23, 59, 59
  );

  // Today Sales
  const salesSnapshot = await db
    .collection('sales')
    .where('userId', '==', user.uid)
    .where('status', '==', 'paid')
    .where('createdAt', '>=', firestore.Timestamp.fromDate(startOfDay))
    .where('createdAt', '<=', firestore.Timestamp.fromDate(endOfDay))
    .get();

  let todaySales = 0;
  let todayCollection = 0;
  salesSnapshot.forEach(doc => {
    const data = doc.data();
    todaySales += data.grandTotal || 0;
    todayCollection += data.amountPaid || 0;
  });

  // Today Purchases
  const purchaseSnapshot = await firestore()
    .collection('purchases')
    .where('userId', '==', user.uid)
    .where(
      'createdAt',
      '>=',
      firestore.Timestamp.fromDate(startOfDay)
    )
    .where(
      'createdAt',
      '<=',
      firestore.Timestamp.fromDate(endOfDay)
    )
    .get();

  let todayPurchases = 0;
  let todayPurchasePayments = 0;

  purchaseSnapshot.forEach(doc => {
    const data = doc.data();
    todayPurchases += data.totalAmount || 0;
    todayPurchasePayments += data.totalAmount || 0;
  });

  // Parties
  const partiesSnapshot = await db
    .collection('parties')
    .where('userId', '==', user.uid)
    .get();

  let receivables = 0;
  let payables = 0;

  partiesSnapshot.docs.forEach(doc => {
    const balance = doc.data().balance || 0;

    if (balance > 0) {
      receivables += balance;
    } else if (balance < 0) {
      payables += Math.abs(balance);
    }
  });

  // Stock Value
  const productsSnapshot = await db
    .collection('products')
    .where('userId', '==', user.uid)
    .get();

  const stockValue = productsSnapshot.docs.reduce((sum, doc) => {
    const data = doc.data();
    return sum + data.stockQuantity * data.costPrice;
  }, 0);

  return {
    todaySales,
    todayPurchases,
    receivables,
    payables,
    stockValue,
  };
};

export const getWeeklySales = async () => {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const snapshot = await firestore()
    .collection('sales')
    .where('userId', '==', user.uid)
    .where('createdAt', '>=', sevenDaysAgo.getTime())
    .get();

  const dailyTotals: Record<string, number> = {};

  // Initialize last 7 days
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const key = d.toLocaleDateString();
    dailyTotals[key] = 0;
  }

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const dateKey = new Date(data.createdAt).toLocaleDateString();

    if (dailyTotals[dateKey] !== undefined) {
      dailyTotals[dateKey] += data.totalAmount;
    }
  });

  const labels = Object.keys(dailyTotals).reverse();
  const values = Object.values(dailyTotals).reverse();

  return { labels, values };
};
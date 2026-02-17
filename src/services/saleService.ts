import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { SaleItem } from '../models/Sale';

const db = firestore();

export const addSale = async (
  customerId: string,
  items: SaleItem[],
  paymentType: 'cash' | 'credit'
) => {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');

  const totalAmount = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  await db.runTransaction(async transaction => {
    // 1️⃣ Validate & deduct stock
    for (const item of items) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists) {
        throw new Error('Product not found');
      }

      const currentStock = productDoc.data()?.stockQuantity || 0;

      if (currentStock < item.quantity) {
        throw new Error(
          `Insufficient stock for product`
        );
      }

      transaction.update(productRef, {
        stockQuantity: currentStock - item.quantity,
        updatedAt: Date.now(),
      });
    }

    // 2️⃣ Create sale document
    const saleRef = db.collection('sales').doc();

    transaction.set(saleRef, {
      userId: user.uid,
      customerId,
      items,
      totalAmount,
      paymentType,
      createdAt: Date.now(),
    });

    // 3️⃣ Update customer balance if credit
    if (paymentType === 'credit') {
      const partyRef = db.collection('parties').doc(customerId);
      const partyDoc = await transaction.get(partyRef);

      if (!partyDoc.exists) {
        throw new Error('Customer not found');
      }

      const currentBalance = partyDoc.data()?.balance || 0;

      transaction.update(partyRef, {
        balance: currentBalance + totalAmount,
      });
    }
  });
};
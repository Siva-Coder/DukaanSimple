import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { PurchaseItem } from '../models/Purchase';

const db = firestore();

export const addPurchase = async (
  supplierId: string,
  items: PurchaseItem[],
  paymentType: 'cash' | 'credit'
) => {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');

  const totalAmount = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  await db.runTransaction(async transaction => {
    // Update stock for each product
    for (const item of items) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists) {
        throw new Error('Product not found');
      }

      const currentStock = productDoc.data()?.stockQuantity || 0;

      transaction.update(productRef, {
        stockQuantity: currentStock + item.quantity,
        updatedAt: Date.now(),
      });
    }

    // Create purchase record
    const purchaseRef = db.collection('purchases').doc();

    transaction.set(purchaseRef, {
      userId: user.uid,
      supplierId,
      items,
      totalAmount,
      paymentType,
      createdAt: Date.now(),
    });

    // If credit → update supplier balance
    if (paymentType === 'credit') {
      const partyRef = db.collection('parties').doc(supplierId);
      const partyDoc = await transaction.get(partyRef);

      if (!partyDoc.exists) {
        throw new Error('Supplier not found');
      }

      const currentBalance = partyDoc.data()?.balance || 0;

      transaction.update(partyRef, {
        balance: currentBalance - totalAmount,
      });
    }
  });
};
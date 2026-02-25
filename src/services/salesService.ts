import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  total: number;
  availableStock: number;
};

export type CreateSalePayload = {
  customerId: string;
  customerName: string;
  items: SaleItem[];
  discount: number;
  amountPaid: number;
  paymentMode: 'cash' | 'upi' | 'bank';
};

/* ---------------- INVOICE NUMBER ---------------- */

export const generateInvoiceNumber = async (): Promise<string> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const counterRef = firestore()
    .collection('counters')
    .doc(user.uid);

  const invoiceNumber = await firestore().runTransaction(
    async transaction => {
      const counterDoc: FirebaseFirestoreTypes.DocumentSnapshot =
        await transaction.get(counterRef);

      let newNumber = 1;

      if (counterDoc.exists()) {
        const data = counterDoc.data();
        newNumber = (data?.lastInvoiceNumber || 0) + 1;
      }

      transaction.set(counterRef, {
        lastInvoiceNumber: newNumber,
      });

      return newNumber;
    }
  );

  return `INV-${invoiceNumber
    .toString()
    .padStart(4, '0')}`;
};

/* ---------------- CREATE SALE ---------------- */

export const createSale = async (
  payload: CreateSalePayload
) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const invoiceNumber = await generateInvoiceNumber();

  const subtotal = payload.items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const grandTotal =
    subtotal - (payload.discount || 0);

  const balance =
    grandTotal - (payload.amountPaid || 0);

  const status =
    balance === 0
      ? 'paid'
      : payload.amountPaid > 0
      ? 'partial'
      : 'unpaid';

  const batch = firestore().batch();

  const saleRef = firestore()
    .collection('sales')
    .doc();

  batch.set(saleRef, {
    invoiceNumber,
    userId: user.uid,
    customerId: payload.customerId,
    customerName: payload.customerName,
    items: payload.items,
    subtotal,
    discount: payload.discount,
    grandTotal,
    amountPaid: payload.amountPaid,
    balance,
    paymentMode: payload.paymentMode,
    status,
    createdAt:
      firestore.FieldValue.serverTimestamp(),
  });

  /* Update Product Stock */

  payload.items.forEach(item => {
    const productRef = firestore()
      .collection('products')
      .doc(item.productId);

    batch.update(productRef, {
      stock:
        firestore.FieldValue.increment(
          -item.quantity
        ),
    });
  });

  /* Update Customer Balance */

  if (balance > 0) {
    const customerRef = firestore()
      .collection('parties')
      .doc(payload.customerId);

    batch.update(customerRef, {
      balance:
        firestore.FieldValue.increment(
          balance
        ),
    });
  }

  await batch.commit();

  return {
    invoiceNumber,
    status,
  };
};
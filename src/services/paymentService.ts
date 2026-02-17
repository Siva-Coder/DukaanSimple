import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { PaymentDirection } from '../models/Payment';

const db = firestore();

export const addPayment = async (
  partyId: string,
  amount: number,
  direction: PaymentDirection
) => {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');

  await db.runTransaction(async transaction => {
    const partyRef = db.collection('parties').doc(partyId);
    const partyDoc = await transaction.get(partyRef);

    if (!partyDoc.exists) {
      throw new Error('Party not found');
    }

    const currentBalance = partyDoc.data()?.balance || 0;

    let updatedBalance = currentBalance;

    if (direction === 'received') {
      updatedBalance = currentBalance - amount;
    } else if (direction === 'paid') {
      updatedBalance = currentBalance + amount;
    }

    // 1️⃣ Update balance
    transaction.update(partyRef, {
      balance: updatedBalance,
    });

    // 2️⃣ Create payment record
    const paymentRef = db.collection('payments').doc();

    transaction.set(paymentRef, {
      userId: user.uid,
      partyId,
      amount,
      direction,
      createdAt: Date.now(),
    });
  });
};
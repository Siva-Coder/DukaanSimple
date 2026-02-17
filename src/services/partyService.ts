import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Party, PartyType } from '../models/Party';

const partiesRef = firestore().collection('parties');

export const addParty = async (party: any) => {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');

  await firestore().collection('parties').add({
    userId: user.uid,
    ...party,
    balance: 0,
    createdAt: Date.now(),
  });
};

export const subscribeToParties = (
  type: PartyType,
  callback: (parties: Party[]) => void
) => {
  console.log({type});
  
  const user = auth().currentUser;
  if (!user) return () => {};

  return partiesRef
    .where('userId', '==', user.uid)
    .where('type', '==', type)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        console.log('Snapshot size:', snapshot.size);

        const parties: Party[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Party, 'id'>),
        }));

        callback(parties);
      },
      error => {
        console.error('Firestore error:', error);
      }
  );

};
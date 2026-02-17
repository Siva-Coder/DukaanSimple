import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Product } from '../models/Product';

const productsRef = firestore().collection('products');

export const addProduct = async (
  name: string,
  unit: string,
  costPrice: number,
  sellingPrice: number,
  initialStock: number
) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const now = Date.now();

  await productsRef.add({
    userId: user.uid,
    name,
    unit,
    costPrice,
    sellingPrice,
    stockQuantity: initialStock,
    createdAt: now,
    updatedAt: now,
  });
};

export const subscribeToProducts = (
  callback: (products: Product[]) => void
) => {
  const user = auth().currentUser;
  if (!user) return () => {};

  return productsRef
    // .where('userId', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const products: Product[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>),
      }));

      callback(products);
    });
};
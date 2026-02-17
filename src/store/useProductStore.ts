import { create } from 'zustand';
import { Product } from '../models/Product';
import { subscribeToProducts } from '../services/productService';

interface ProductState {
  products: Product[];
  loading: boolean;
  initProductsListener: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: true,

  initProductsListener: () => {
    set({ loading: true });

    const unsubscribe = subscribeToProducts(products => {
      set({
        products,
        loading: false,
      });
    });

    return unsubscribe;
  },
}));
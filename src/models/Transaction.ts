export type TransactionType = 'sale' | 'stock_add' | 'adjustment';

export interface Transaction {
  id: string;
  productId: string;
  type: TransactionType;
  quantity: number;
  profit: number;
  createdAt: number;
}
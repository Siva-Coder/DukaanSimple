export interface SaleItem {
  productId: string;
  quantity: number;
  sellingPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  userId: string;
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  paymentType: 'cash' | 'credit';
  createdAt: number;
}
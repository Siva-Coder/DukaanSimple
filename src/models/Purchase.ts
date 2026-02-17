export interface PurchaseItem {
  productId: string;
  quantity: number;
  costPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  userId: string;
  supplierId: string;
  items: PurchaseItem[];
  totalAmount: number;
  paymentType: 'cash' | 'credit';
  createdAt: number;
}
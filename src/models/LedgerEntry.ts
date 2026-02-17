export interface LedgerEntry {
  id: string;
  type: 'sale' | 'purchase' | 'payment';
  amount: number;
  direction: 'debit' | 'credit';
  createdAt: number;
}
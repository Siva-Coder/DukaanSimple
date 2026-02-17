export type PaymentDirection = 'received' | 'paid';

export interface Payment {
  id: string;
  userId: string;
  partyId: string;
  amount: number;
  direction: PaymentDirection;
  createdAt: number;
}
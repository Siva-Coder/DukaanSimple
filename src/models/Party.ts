export type PartyType = 'customer' | 'supplier';

export interface Party {
  id: string;
  type: PartyType;

  // Basic
  name: string;          // display name
  phone?: string;

  // Supplier-specific
  firmName?: string;
  ownerName?: string;
  address?: string;
  alternatePhone?: string;

  // Accounting
  balance: number;

  createdAt: number;
  updatedAt?: number;
}
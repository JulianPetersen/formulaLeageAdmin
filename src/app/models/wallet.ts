export type WalletClaimStatus = 'pending' | 'approved' | 'paid' | 'rejected';

export type WalletClaimMethod = 'bank_transfer' | 'mercado_pago' | 'paypal' | 'other';

export interface WalletClaimUser {
  _id: string;
  username?: string;
  email?: string;
  points?: number;
}

export interface WalletData {
  _id: string;
  user: string | WalletClaimUser;
  currency: string;
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalPaid: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface WalletPrize {
  _id: string;
  amount?: number | string;
  status?: string;
  endDate?: string | Date;
}

export interface WalletClaim {
  _id: string;
  user: WalletClaimUser;
  wallet: WalletData;
  prize?: WalletPrize;
  amount: number;
  currency: string;
  status: WalletClaimStatus;
  method: WalletClaimMethod;
  accountAlias: string;
  note?: string;
  requestedAt?: string | Date;
  approvedAt?: string | Date;
  paidAt?: string | Date;
  rejectedReason?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface WalletClaimStatusUpdate {
  status: WalletClaimStatus;
  rejectedReason?: string;
}

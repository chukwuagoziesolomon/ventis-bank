export interface VantisUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  phone: string;
  address: string;
  image: string;
  createdAt: string;
}

export type UserStatus = "pending" | "approved" | "rejected";

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
  currency: string;
  type: "checking" | "savings";
  apy?: number;
}

export interface Card {
  id: string;
  label: string;
  holder: string;
  last4: string;
  expiry: string;
  type: "physical" | "virtual";
  network: "visa" | "mastercard";
  frozen: boolean;
  limit: number;
  spent: number;
  color: "gold" | "teal" | "ink";
  accountId: string;
}

export type TxStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  accountId: string;
  direction: "credit" | "debit";
  counterparty: string;
  status: TxStatus;
}

export type Type = "INCOME" | "EXPENSE"

export type Category = {
  id: number;
  name: string;
  type: Type;
  userId: number
}

export type Account = {
  id: number;
  name: string;
  openingBalance: number | string;
  userId: number
}

export type Transaction = {
  accountId: number;
  account: Account;
  categoryId: number;
  category: Category;
  description: number;
  dueDate: Date;
  id: number;
  type: Type
  userId: number;
  value: number | string;
  wasConfirm: boolean;
}
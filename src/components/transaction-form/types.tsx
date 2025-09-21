import { Transaction } from "../transaction-manager/types";

type TransactionType = "INCOME" | "EXPENSE"


export type Props = {
  type: TransactionType;
}

export type Form = {
  description: string;
  categoryId: number;
  accountId: number
  value: string | number;
  dueDate: string | Date;
  recurrent: "Não recorrente" | "Parcelado" | "Fixo Mensal";
  installments: number
  category: string;
  account: string;
  type: TransactionType;
  wasConfirm: boolean;

}

export type Accounts = {
  name: string;
  id: number;
  openingBalance: number | string;
  createdAt: Date;
  transaction?: Transaction[]
}

export type Categories = {
  name: string;
  id: number
}

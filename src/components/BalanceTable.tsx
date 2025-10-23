'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { MdOutlineOpenInNew } from 'react-icons/md';

import { Transaction } from './transactionManager';
import { convertToMoneyFormat } from '@/utils/numberFunctions';

import styles from './style.module.css';

type TableProps = {
  type: 'EXPENSE' | 'INCOME';
  data: Transaction[];
};


export default function BalanceTable({ type, data }: TableProps) {
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        const value = Number(item.value);
        acc.total += value;
        if (item.wasConfirm) {
          acc.confirmed += value;
        }
        return acc;
      },
      { confirmed: 0, total: 0 }
    );
  }, [data]);

  const predicted = totals.total - totals.confirmed;
  const title = type === 'INCOME' ? 'Receitas' : 'Despesas';

  const THEME_COLOR = type === 'INCOME' ? 'border-green-600' : 'border-red-600';
  const BG_COLOR = type === 'INCOME' ? 'bg-green-50' : 'bg-red-50';
  const TEXT_COLOR = type === 'INCOME' ? 'text-green-700' : 'text-red-700';

  return (
    <article className={`bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col ${THEME_COLOR}`}>
      <header className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 m-0">{title}</h2>
        <Link href={`${type.toLowerCase()}s`} className={`flex items-center justify-center text-gray-400 cursor-pointer text-xl transition-colors hover:${TEXT_COLOR.replace('text-', 'text-')}`} aria-label={`Ver todas as ${title}`}>
          <MdOutlineOpenInNew />
        </Link>
      </header>
      <div className="flex flex-col p-4">
        <div className={`flex flex-col items-center p-4 rounded-lg ${BG_COLOR} ${TEXT_COLOR}`}>
          <span className="text-base font-medium">Total</span>
          <span className="text-3xl font-bold leading-none">{convertToMoneyFormat(totals.total)}</span>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex justify-between text-base py-1">
            <span className="text-gray-600">Confirmado</span>
            <span className="font-semibold text-gray-800">{convertToMoneyFormat(totals.confirmed)}</span>
          </div>
          <div className="flex justify-between text-base py-1">
            <span className="text-gray-600">Previsto</span>
            <span className="font-semibold text-gray-800">{convertToMoneyFormat(predicted)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
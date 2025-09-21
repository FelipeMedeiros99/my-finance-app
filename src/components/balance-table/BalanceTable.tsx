'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { MdOutlineOpenInNew } from 'react-icons/md';

import { Transaction } from '../transaction-manager/types';
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

  return (
    <article className={`${styles.summaryCard} ${type === 'INCOME' ? styles.green : styles.red}`}>
      <header className={styles.cardHeader}>
        <h2 className={styles.title}>{title}</h2>
        <Link href={`${type.toLowerCase()}s`} className={styles.iconButton}>
          <MdOutlineOpenInNew />
        </Link>
      </header>

      <div className={styles.cardBody}>
        <div className={styles.cardTotal}>
          <span>Total</span>
          <span>{convertToMoneyFormat(totals.total)}</span>
        </div>
        
        {/* O breakdown fica como informação secundária. */}
        <div className={styles.cardBreakdown}>
          <div className={styles.breakdownRow}>
            <span>Confirmado</span>
            <span>{convertToMoneyFormat(totals.confirmed)}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span>Previsto</span>
            <span>{convertToMoneyFormat(predicted)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { MdOutlineOpenInNew } from 'react-icons/md';

// import { Transaction } from '../transaction-manager/types';
// import { convertToMoneyFormat } from '@/utils/numberFunctions';

// import styles from './style.module.css';
// import Link from 'next/link';

// type TableProps = {
//   type: 'EXPENSE' | 'INCOME';
//   data: Transaction[];
// };

// export default function BalanceTable({ type, data }: TableProps) {
//   const [informations, setInformations] = useState({
//     confirmed: 0,
//     predicted: 0,
//     total: 0,
//   });

//   useEffect(() => {
//     const total = data.reduce((aggregate, item) => aggregate + Number(item.value), 0);
//     const confirmed = data.reduce((aggregate, item) => {
//       if (item.wasConfirm) {
//         return aggregate + Number(item.value);
//       }
//       return aggregate;
//     }, 0);
//     const predicted = total - confirmed;

//     setInformations({ confirmed, predicted, total });
//   }, [data]);

//   return (
//     <div className={`${styles.containerTable} ${type === 'INCOME' ? styles.green : styles.red}`}>
//       <Link href={`${type.toLocaleLowerCase()}s`} className={styles.iconButton}>
//         <MdOutlineOpenInNew />
//       </Link>
//       <table className={styles.table}>
//         <thead>
//           <tr className={styles.tableHeader}>
//             <th colSpan={2}>
//               <h2 className={styles.title}>{type === 'INCOME' ? 'Receitas' : 'Despesas'}</h2>
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className={styles.cell}>Confirmado</td>
//             <td className={`${styles.cell} ${styles.cellRight}`}>
//               {convertToMoneyFormat(informations.confirmed)}
//             </td>
//           </tr>
//           <tr>
//             <td className={styles.cell}>Previsto</td>
//             <td className={`${styles.cell} ${styles.cellRight}`}>
//               {convertToMoneyFormat(informations.predicted)}
//             </td>
//           </tr>
//           <tr className={styles.totalRow}>
//             <td className={`${styles.cell} ${styles.cellTotal}`}>Total</td>
//             <td className={`${styles.cell} ${styles.cellRight} ${styles.cellTotal}`}>
//               {convertToMoneyFormat(informations.total)}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// "use client"


// import { useEffect, useState } from "react";
// import { MdOutlineOpenInNew } from "react-icons/md";

// import { Transaction } from "../transaction-manager/types";
// import { convertToMoneyFormat } from "@/utils/numberFunctions";

// import styles from "./style.module.css"
// import Link from "next/link";

// type TableProps = {
//   type: "EXPENSE" | "INCOME";
//   data: Transaction[];
// }

// export default function BalanceTable({ type, data }: TableProps){
//   const [informations, setInformations] = useState({ confirmed: 0, prevpredicted: 0, total:0 })

//   useEffect(()=>{
//       const total = data.reduce((aggregate, data) => aggregate + Number(data.value), 0)
//       const confirmed = data.reduce((aggregate, data) => {
//         if (data.wasConfirm) {
//           return aggregate + Number(data.value);
//         }
//         return aggregate;
//       }, 0)
//       const prevpredicted = total - confirmed;

//       setInformations({ confirmed, prevpredicted, total })

//   }, [data])

//   return (
//     <div className={`${styles.containerTable} ${type === "INCOME" ? styles.green : styles.red}`}>
//       <Link href={`${type.toLocaleLowerCase()}s`} className={styles.iconButton}>
//         <MdOutlineOpenInNew />
//       </Link>
      
//       <table className={styles.table}>
//         <caption className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red}`}>{type === "INCOME" ? "Receitas" : "Despesas"}</caption>
//         <tbody>
//           <tr>
//             <td className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red}`}>Confirmado</td>
//             <td className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red} ${styles.tdRight}`}>{convertToMoneyFormat(informations.confirmed)}</td>
//           </tr>
//           <tr>
//             <td className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red}`}>Previsto</td>
//             <td className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red} ${styles.tdRight}`}>{convertToMoneyFormat(informations.prevpredicted)}</td>
//           </tr>
//           <tr>
//             <td className={`${styles.total} ${styles.td} ${type === "INCOME" ? styles.green : styles.red}`}>Total</td>
//             <td className={`${styles.total} ${styles.td} ${type === "INCOME" ? styles.green : styles.red} ${styles.tdRight}`}>{convertToMoneyFormat(informations.total)}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   )
// }
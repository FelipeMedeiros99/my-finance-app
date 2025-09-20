"use client"


import { useEffect, useState } from "react";
import { MdOutlineOpenInNew } from "react-icons/md";

import { Transaction } from "../transaction-manager/types";
import { convertToMoneyFormat } from "@/utils/numberFunctions";

import styles from "./style.module.css"
import Link from "next/link";

type TableProps = {
  type: "EXPENSE" | "INCOME";
  data: Transaction[];
}

export default function BalanceTable({ type, data }: TableProps){
  const [informations, setInformations] = useState({ confirmed: 0, prevpredicted: 0, total:0 })

  useEffect(()=>{
      const total = data.reduce((aggregate, data) => aggregate + Number(data.value), 0)
      const confirmed = data.reduce((aggregate, data) => {
        if (data.wasConfirm) {
          return aggregate + Number(data.value);
        }
        return aggregate;
      }, 0)
      const prevpredicted = total - confirmed;

      setInformations({ confirmed, prevpredicted, total })

  }, [data])

  return (
    <div className={`${styles.containerTable} ${type === "INCOME" ? styles.green : styles.red}`}>
      <Link href={`${type.toLocaleLowerCase()}s`} className={styles.iconButton}>
        <MdOutlineOpenInNew />
      </Link>
      
      <table className={styles.table}>
        <caption className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red}`}>{type === "INCOME" ? "Receitas" : "Despesas"}</caption>
        <tbody>
          <tr>
            <td className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red}`}>Confirmado</td>
            <td className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red} ${styles.tdRight}`}>{convertToMoneyFormat(informations.confirmed)}</td>
          </tr>
          <tr>
            <td className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red}`}>Previsto</td>
            <td className={`${styles.td} ${type === "INCOME" ? styles.green : styles.red} ${styles.tdRight}`}>{convertToMoneyFormat(informations.prevpredicted)}</td>
          </tr>
          <tr>
            <td className={`${styles.total} ${styles.td} ${type === "INCOME" ? styles.green : styles.red}`}>Total</td>
            <td className={`${styles.total} ${styles.td} ${type === "INCOME" ? styles.green : styles.red} ${styles.tdRight}`}>{convertToMoneyFormat(informations.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
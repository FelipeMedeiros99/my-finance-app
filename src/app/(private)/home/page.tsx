"use client"

import { useEffect, useState } from "react";

import TopDate from "@/components/top-date/TopDate";
import WhiteContainer from "@/components/white-container/WhiteContainer";
import config from "@/config";
import { Transaction } from "@/components/transaction-manager/types";
import { convertToMoneyFormat } from "@/utils/numberFunctions";

import styles from "./styles.module.css"

type TableProps = {
  type: "EXPENSE" | "INCOME";
  data: Transaction[];
}

const Table = ({ type, data }: TableProps) => {
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

export default function Home() {
  const [date, setDate] = useState(new Date())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)


  useEffect(() => {
    (async () => {
      try {
        const response = await config.getTransaction(`date=${date}`)
        setTransactions(response.data)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

  useEffect(()=>{
    const total = transactions.reduce((acc, data)=>{
      if(data.type==="EXPENSE"){
        return acc - Number(data.value)
      }else{
        return acc + Number(data.value)
      }
    },0)
    setBalance(total)
  }, [transactions])

  return (
    <>
      <TopDate date={date} setDate={setDate} />
      <WhiteContainer title="Resumos">
        <div className={styles.containerTables}>
          <Table type="INCOME" data={transactions.filter((transaction) => transaction.type === "INCOME")} />
          <Table type="EXPENSE" data={transactions.filter((transaction) => transaction.type === "EXPENSE")} />
        </div>

        <p className={styles.balanceContainer}>
          <label>Balanço do mês: </label> <span className={`${styles.balance} ${balance > 0? styles.green : balance < 0 ? styles.red : ""}`}>{convertToMoneyFormat(balance)}</span>
        </p>
      </WhiteContainer>
    </>
  )
}
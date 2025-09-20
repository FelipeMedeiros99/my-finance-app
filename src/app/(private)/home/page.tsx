"use client"

import { useEffect, useState } from "react";

import TopDate from "@/components/top-date/TopDate";
import WhiteContainer from "@/components/white-container/WhiteContainer";
import config from "@/config";
import { Transaction } from "@/components/transaction-manager/types";
import { convertToMoneyFormat } from "@/utils/numberFunctions";
import BalanceTable from "@/components/balance-table/BalanceTable";

import styles from "./style.module.css"

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
  }, [date])

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
          <BalanceTable type="INCOME" data={transactions.filter((transaction) => transaction.type === "INCOME")} />
          <BalanceTable type="EXPENSE" data={transactions.filter((transaction) => transaction.type === "EXPENSE")} />
        </div>

        <p className={styles.balanceContainer}>
          <label>Balanço do mês: </label> <span className={`${styles.balance} ${balance > 0? styles.green : balance < 0 ? styles.red : ""}`}>{convertToMoneyFormat(balance)}</span>
        </p>
      </WhiteContainer>
    </>
  )
}
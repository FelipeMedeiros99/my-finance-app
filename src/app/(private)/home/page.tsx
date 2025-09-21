"use client"

import { useEffect, useState } from "react";

import TopDate from "@/components/top-date/TopDate";
import WhiteContainer from "@/components/white-container/WhiteContainer";
import config from "@/config";
import { Transaction } from "@/components/transaction-manager/types";
import { convertToMoneyFormat } from "@/utils/numberFunctions";
import BalanceTable from "@/components/balance-table/BalanceTable";

import styles from "./style.module.css"
import { Accounts } from "@/components/transaction-form/types";
import Link from "next/link";
import { MdOutlineOpenInNew } from "react-icons/md";

export default function Home() {
  const [date, setDate] = useState(new Date())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Accounts[]>([])
  const [balance, setBalance] = useState(0)
  const [accountsBalanceTotal, setAccountsBalanceTotal] = useState({ predicted: 0, total: 0 })

  const calculateConfirmedBalance = (accounts: Transaction[]) => {
    const total = accounts.reduce((accumulate, data) => {
      if (data.type === "EXPENSE" && data.wasConfirm) {
        return accumulate - Number(data.value)
      } else if (data.type === "INCOME" && data.wasConfirm) {
        return accumulate + Number(data.value)
      } else {
        return accumulate
      }
    }, 0)

    return total
  }

  const calculateTotalBalance = (accounts: Transaction[]) => {
    const total = accounts.reduce((accumulate, data) => {
      if (data.type === "EXPENSE") {
        return accumulate - Number(data.value)
      } else if (data.type === "INCOME") {
        return accumulate + Number(data.value)
      } else {
        return accumulate
      }
    }, 0)

    return total
  }


  useEffect(() => {
    const accountTotal = accounts.reduce((aggregate, data) => {
      let values = { predicted: 0, total: 0 }
      if (data.transaction) {
        values = data.transaction.reduce((aggregate2, data) => {
          if (data.type === "EXPENSE") {
            aggregate2.predicted -= Number(data.value);
            if (data.wasConfirm) {
              aggregate2.total -= Number(data.value);
            }
            return aggregate2
          } else if (data.type === "INCOME") {
            aggregate2.predicted += Number(data.value);
            if (data.wasConfirm) {
              aggregate2.total += Number(data.value);
            }
            return aggregate2
          } else {
            return aggregate2
          }
        }, { predicted: 0, total: 0 })
      }
      aggregate.predicted += values.predicted;
      aggregate.total += values.total;
      return aggregate
    }, { predicted: 0, total: 0 })

    setAccountsBalanceTotal(accountTotal)
  }, [accounts])

  console.log(accountsBalanceTotal)

  useEffect(() => {
    (async () => {
      try {
        const transactions = await config.getTransaction(`date=${date}`)
        const accounts = await config.getAccounts(`date=${date}`)

        const [transactionResponse, accountsResponse] = await Promise.all([transactions, accounts])

        setTransactions(transactionResponse.data)
        setAccounts(accountsResponse.data)

      } catch (e) {
        console.log(e)
      }
    })()
  }, [date])

  useEffect(() => {
    const total = transactions.reduce((acc, data) => {
      if (data.type === "EXPENSE") {
        return acc - Number(data.value)
      } else {
        return acc + Number(data.value)
      }
    }, 0)
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
          <label>Balanço do mês: </label> <span className={`${styles.balance} ${balance > 0 ? styles.green : balance < 0 ? styles.red : ""}`}>{convertToMoneyFormat(balance)}</span>
        </p>
      </WhiteContainer>


      <WhiteContainer title="Contas">
        <div className={styles.containerAccounts}>
          <Link href={`/accounts`} className={styles.iconButton}>
            <MdOutlineOpenInNew />
          </Link>
          {accounts?.map((account) => (
            <div className={styles.containerInfos}>
              <h3 className={styles.titleAccount}>{account.name}</h3>
              <p>Saldo atual: {account?.transaction ? convertToMoneyFormat(calculateConfirmedBalance(account.transaction)) : ""}</p>
              <p>saldo previsto: {account?.transaction ? convertToMoneyFormat(calculateTotalBalance(account.transaction)) : ""}</p>
            </div>
          ))}
        </div>

        <div className={styles.balanceContainer}>
          <p><label htmlFor="currentBalance">Saldo atual: </label><span className={accountsBalanceTotal.total > 0 ? `${styles.green} ${styles.strongText}` : accountsBalanceTotal.total < 0 ? `${styles.red} ${styles.strongText}` : ""}  id="currentBalance">{convertToMoneyFormat(accountsBalanceTotal.total)}</span></p>
          <p className={styles.weakText}><label htmlFor="predicted">Saldo previsto:</label> <span className={accountsBalanceTotal.predicted > 0 ? styles.green : accountsBalanceTotal.predicted < 0 ? styles.red : ""} id="predicted">{convertToMoneyFormat(accountsBalanceTotal.predicted)}</span></p>
        </div>

      </WhiteContainer>
    </>
  )
}
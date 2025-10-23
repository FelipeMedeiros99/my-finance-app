"use client"

import React, { useEffect, useState } from "react";

import TopDate from "@/components/TopDate";
import WhiteContainer from "@/components/WhiteContainer";
import config from "@/config";
import { Transaction } from "@/components/transaction-manager/types";
import { calculateConfirmedBalance, calculateTotalBalance, calculateFullTotalsFromAllAccountsTransactions, convertToMoneyFormat } from "@/utils/numberFunctions";
import BalanceTable from "@/components/BalanceTable";

import { Accounts } from "@/components/transaction-form/types";
import Link from "next/link";
import { MdOutlineOpenInNew } from "react-icons/md";

export default function Home() {
  const [date, setDate] = useState(new Date())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Accounts[]>([])
  const [balance, setBalance] = useState(0)
  const [accountsBalanceTotal, setAccountsBalanceTotal] = useState({ predicted: 0, total: 0 })

  useEffect(() => {
    const accountTotal = calculateFullTotalsFromAllAccountsTransactions(accounts);
    setAccountsBalanceTotal(accountTotal)
  }, [accounts])


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

  const THEME_GREEN = "text-green-600";
  const THEME_RED = "text-red-600";
  const STYLES = {
    green: THEME_GREEN,
    red: THEME_RED,
    balance: "font-bold text-xl",
    label: "font-normal text-gray-600",
    strongText: "font-bold",
    weakText: "font-light opacity-80",
    textRight: "text-right",
  };

  return (
    <React.Fragment>

      <TopDate date={date} setDate={setDate} />
      
      <main className="pb-20">

        {/* Resumos */}
        <WhiteContainer title="Resumos">
          
          <div className="flex flex-col gap-4 mb-6">
            <BalanceTable type="INCOME" data={transactions.filter((transaction) => transaction.type === "INCOME")} />
            <BalanceTable type="EXPENSE" data={transactions.filter((transaction) => transaction.type === "EXPENSE")} />
          </div>

          <div className="pt-4 border-t border-gray-200 text-center">
            
            <p className="text-lg flex justify-between items-center">
              <span className={STYLES.label}>Balanço do mês: </span>
              <span
                className={`${STYLES.balance} ${balance > 0 ? STYLES.green : balance < 0 ? STYLES.red : ""}`}
              >
                {convertToMoneyFormat(balance)}
              </span>
            </p>
          </div>
        </WhiteContainer>
        
        {/* Contas */}
        <WhiteContainer title="Contas">
          
          <Link href={`/accounts`} className="absolute top-3 right-3 w-6 h-6 text-green-600 text-2xl cursor-pointer">
            <MdOutlineOpenInNew />
          </Link>

          <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {accounts?.map((account) => {
              const currentValue = account?.transaction ? calculateConfirmedBalance(account.transaction) : 0;
              const predictedValue = account?.transaction ? calculateTotalBalance(account.transaction) : 0;
              return (
                <div key={account.name} className="border border-gray-400 rounded-sm p-4 flex flex-col shadow-sm">
                  <h3 className="pb-2 text-base font-bold">{account.name}</h3>                  
                  <div className="flex flex-col gap-1">
                    <p className="flex justify-between items-center text-sm">
                      <span className={STYLES.label}>Saldo atual: </span>
                      <span className={currentValue > 0 ? STYLES.green : currentValue < 0 ? STYLES.red : ""}>
                        {convertToMoneyFormat(currentValue)}
                      </span>
                    </p>

                    <p className="flex justify-between items-center text-sm">
                      <span className={STYLES.label}>Saldo previsto: </span>
                      <span className={predictedValue > 0 ? STYLES.green : predictedValue < 0 ? STYLES.red : ""}>
                        {convertToMoneyFormat(predictedValue)}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          
          <div className="pt-4 border-t border-gray-200 text-center">
            
            <p className="flex justify-between items-center">
              <span className={STYLES.label}>Total: </span>
              <span className={accountsBalanceTotal.total > 0 ? STYLES.green : accountsBalanceTotal.total < 0 ? STYLES.red : ""}>
                {convertToMoneyFormat(accountsBalanceTotal.total)}
              </span>
            </p>
            
            <p className={`${STYLES.weakText} flex justify-between items-center`}>
              <span className={STYLES.label}>Previsto: </span>
              <span className={accountsBalanceTotal.predicted > 0 ? STYLES.green : accountsBalanceTotal.predicted < 0 ? STYLES.red : ""}>
                {convertToMoneyFormat(accountsBalanceTotal.predicted)}
              </span>
            </p>
          </div>
        </WhiteContainer>
      </main>
    </React.Fragment>
  );
}

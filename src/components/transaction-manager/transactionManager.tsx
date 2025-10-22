"use client"
import { useEffect, useState } from "react"
import { AxiosError } from "axios"

import TopDate from "@/components/top-date/TopDate"
import WhiteContainer from "@/components/WhiteContainer"
import config from "@/config"
import Checkbox from "@/components/checkbox/Checkbox"
import { returnObjectOfDate } from "@/utils/dateFunctions"
import { calculateConfirmedAndTotalsAtIncomesAndExpenses, convertToMoneyFormat, convertToNumberFormat } from "@/utils/numberFunctions"

import { Transaction, ValuesInformation } from "./types"
import styles from "./style.module.css"
import Link from "next/link"


export default function TransactionManager({ type }: { type: "EXPENSE" | "INCOME" }) {
  const [date, setDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [valuesInformations, setValuesInformations] = useState<ValuesInformation>()

  const calculateValues = () => {
    const calculedValues = calculateConfirmedAndTotalsAtIncomesAndExpenses(transactions)
    if (type === "EXPENSE") {
      setValuesInformations({
        confirmedTotal: convertToMoneyFormat(calculedValues.expense.confirmed),
        total: convertToMoneyFormat(calculedValues.expense.total),
        unconfirmedTotal: convertToMoneyFormat(calculedValues.expense.total - calculedValues.expense.confirmed)
      })
    } else {
      setValuesInformations({
        confirmedTotal: convertToMoneyFormat(calculedValues.income.confirmed),
        total: convertToMoneyFormat(calculedValues.income.total),
        unconfirmedTotal: convertToMoneyFormat(calculedValues.income.total - calculedValues.expense.confirmed)
      })
    }
  }

  const getTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await config.getTransaction(`date=${date}&type=${type}`)
      setTransactions(response.data)
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.data)
      } else {
        console.log(e)
      }
    }
    setIsLoading(false)
  }

  const toggleConfirmation = async (transaction: Transaction) => {
    try {
      transaction.value = convertToNumberFormat(transaction.value);
      transaction.wasConfirm = !transaction.wasConfirm;
      await config.updateTransaction(transaction, transaction.id);
      await getTransactions()
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response)
      } else {
        console.log(e)
      }
    }

  }

  useEffect(() => {
    calculateValues()
  }, [transactions])

  useEffect(() => {
    (async () => {
      await getTransactions()
    })()
  }, [date])


const THEME_RED = "text-red-600";
const THEME_GREEN = "text-green-600";
const ICON_COLOR = type === "EXPENSE" ? THEME_RED : THEME_GREEN;

return (
  <>
    <TopDate date={date} setDate={setDate} />

    <WhiteContainer
      title={type === "EXPENSE" ? "Saídas" : type === "INCOME" ? "Entradas" : ""}
      theme={type === "EXPENSE" ? "red" : type === "INCOME" ? "green" : "neutral"}
      isLoading={isLoading}
    >

      <div className="flex flex-col space-y-2">        
        <div className="flex flex-col justify-center gap-2 p-4 shadow-md border border-gray-300 rounded-md text-gray-800">
          <div className="flex flex-col items-center justify-center p-3 gap-2 border border-gray-300 rounded-md bg-gray-50 text-3xl font-bold">
            <strong className="text-sm font-semibold text-gray-700">Total previsto</strong>
            <strong className={ICON_COLOR}>
              {valuesInformations?.total}
            </strong>
          </div>
          <div className="grid grid-cols-2 text-gray-600 gap-1 pt-2">
            <div className="flex justify-start">
              <p>Confirmado:</p>
            </div>
            <div className="flex justify-end">
              <p className="text-gray-800">{valuesInformations?.confirmedTotal}</p>
            </div>
            <div className="flex justify-start">
              <p>Pendente:</p>
            </div>
            <div className="flex justify-end">
              <p className="text-gray-800">{valuesInformations?.unconfirmedTotal}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 pt-2">
          {transactions.map((transaction) => {
            const formatedDate = returnObjectOfDate(String(transaction?.dueDate));
            return (
              <div key={transaction.id} className="flex justify-between items-center border border-gray-300 shadow-sm rounded-md px-2 py-3 relative min-h-20">
                <input 
                    type="checkbox"
                    className="w-5 h-5 z-10 text-lime-600 bg-gray-100 border-gray-300 rounded focus:ring-lime-500 focus:ring-2"
                    checked={transaction?.wasConfirm} 
                    onChange={(event) => { event.stopPropagation(); toggleConfirmation(transaction); }} 
                    onClick={(event) => event.stopPropagation()} 
                  />
                <Link 
                  href={`/${transaction.type.toLowerCase()}s/new?id=${transaction?.id}`} 
                  className="flex w-full h-full justify-between items-center absolute inset-0 pl-12 pr-2" 
                >
                  <div className="grow flex items-center">
                    <div>
                      <h2 className="font-medium text-base text-gray-900">{transaction.description}</h2>
                      
                      <div className="flex flex-wrap gap-x-2 text-xs text-gray-600 opacity-80">
                        <p>{transaction.account.name}</p>
                        <p>•</p>
                        <p>{transaction.category.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-600 opacity-80">
                    <p>Venc: {formatedDate.day}/{formatedDate.month}</p>
                    <strong className={`font-bold text-base ${ICON_COLOR}`}>{convertToMoneyFormat(transaction.value)}</strong>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </WhiteContainer>
  </>
);
}
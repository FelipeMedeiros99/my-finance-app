"use client"
import { useEffect, useState } from "react"
import { AxiosError } from "axios"

import TopDate from "@/components/top-date/TopDate"
import WhiteContainer from "@/components/white-container/WhiteContainer"
import config from "@/config"
import Checkbox from "@/components/checkbox/Checkbox"
import { formatToDate } from "@/utils/dateFunctions"
import { convertToMoneyFormat, convertToNumberFormat } from "@/utils/numberFunctions"

import { Transaction } from "./types"
import styles from "./style.module.css"


export default function TransactionManager({type}: {type: "EXPENSE" | "INCOME"}) {
  const [date, setDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const getTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await config.getTransaction(date, type)
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

  const toggleConfirmation = async(transaction: Transaction)=>{
    try{
      transaction.value = convertToNumberFormat(transaction.value);
      transaction.wasConfirm = !transaction.wasConfirm;
      await config.updateTransaction(transaction, transaction.id);
      await getTransactions()
    }catch(e){
      if(e instanceof AxiosError){
        console.log(e.response)
      }else{
        console.log(e)
      }
    }
    
  }

  useEffect(() => {
    (async () => {
      await getTransactions()
    })()
  }, [date])


  return (
    <>
      <TopDate date={date} setDate={setDate} />
      <WhiteContainer title={type==="EXPENSE" ? "Saídas": type==="INCOME" ? "Entradas" : ""} theme={type==="EXPENSE" ? "red": type==="INCOME" ? "green" : "neutral"} isLoading={isLoading}>
        <div className={styles.transactionsContainer}>

        {transactions.map((transction, index) => {
          const formatedDate = formatToDate(new Date(transction.dueDate));
          return (
            <div key={index} className={`${styles.transactionContainer} ${styles.containerGreen}`}>
              <div className={styles.transactionDescriptions}>
                <Checkbox checked={transction.wasConfirm} onChange={()=>toggleConfirmation(transction)}/>
                <div>
                  <p className={styles.OppacyText}>{transction.account.name}</p>
                  <p className={styles.strongText}>{transction.description}</p>
                  <p className={styles.OppacyText}>{transction.category.name}</p>
                </div>
              </div>
              <div className={styles.rightContainer}>
                <p className={styles.OppacyText}>Venc: {formatedDate.day}/{formatedDate.month}</p>
                <p className={styles.strongText}>{convertToMoneyFormat(transction.value)}</p>
              </div>
            </div>
          )
        })}
        </div>
      </WhiteContainer>
    </>
  )
}
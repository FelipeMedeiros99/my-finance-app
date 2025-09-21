"use client"
import { useEffect, useState } from "react"
import { AxiosError } from "axios"
// import { MdOpenInNew } from "react-icons/md";

import TopDate from "@/components/top-date/TopDate"
import WhiteContainer from "@/components/white-container/WhiteContainer"
import config from "@/config"
import Checkbox from "@/components/checkbox/Checkbox"
import { formatToDate } from "@/utils/dateFunctions"
import { convertToMoneyFormat, convertToNumberFormat } from "@/utils/numberFunctions"

import { Transaction, ValuesInformation } from "./types"
import styles from "./style.module.css"
import Link from "next/link"


const DescriptionTransactionBox = ({ transaction, toggleConfirmation }: { transaction: Transaction, toggleConfirmation: (transaction: Transaction) => void }) => {
  const formatedDate = formatToDate(new Date(transaction?.dueDate));
  return (
    <div className={`${styles.descriptionTransactionBox}`}>

      <Checkbox className={styles.checkbox} checked={transaction?.wasConfirm} onChange={() => toggleConfirmation(transaction)} />

      <Link className={styles.link} href={`/${transaction.type.toLowerCase()}s/new?id=${transaction?.id}`}>

        <div className={styles.transactionDescriptions}>
          <div>
            <h2 className={styles.transactionTitle}>{transaction.description}</h2>
            <div className={styles.metadataContainer}>
              <p>{transaction.account.name}</p>
              <p>•</p>
              <p>{transaction.category.name}</p>
            </div>
          </div>
        </div>


        <div className={styles.rightContainer}>
          <p>Venc: {formatedDate.day}/{formatedDate.month}</p>
          <strong className={styles.transactionValue}>{convertToMoneyFormat(transaction.value)}</strong>
        </div>

      </Link>

    </div>
  )
}

const TotalTableContainer = (
  { type, valuesInformations }: {
    type: "INCOME" | "EXPENSE",
    valuesInformations?: ValuesInformation
  }) => {
  return (
    <div className={styles.containerTotals}>
      <div className={styles.totalTransactionsContainer}>
        <strong style={{ fontSize: "var(--font-size-sm)" }}>Total previsto</strong>
        <strong className={type==="EXPENSE" ? styles.valuesRed : styles.valuesGreen}>{valuesInformations?.total}</strong>
      </div>
      <div className={styles.subtotalsTransactions}>
        <div className={styles.subtotalsTransactionsRows}>
          <p className={styles.itemLeft}>Confirmado:</p>
          <p className={styles.itemRight}>{valuesInformations?.confirmedTotal}</p>
        </div>
        <div className={styles.subtotalsTransactionsRows}>
          <p className={styles.itemLeft}>Pendente:</p>
          <p className={styles.itemRight}>{valuesInformations?.unconfirmedTotal}</p>
        </div>
      </div>
      {/* <table className={styles.table}>
        <tbody>
          <tr>
            <td>Total: </td>
            <td>{valuesInformations?.total}</td>
          </tr>
          <tr>
            <td>Recebido: </td>
            <td>{valuesInformations?.confirmedTotal}</td>
          </tr>
          <tr>
            <td>Pendente:</td>
            <td>{valuesInformations?.unconfirmedTotal}</td>
          </tr>
        </tbody>
      </table> */}
    </div>
  )
}

export default function TransactionManager({ type }: { type: "EXPENSE" | "INCOME" }) {
  const [date, setDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [valuesInformations, setValuesInformations] = useState<ValuesInformation>()



  const calculateValues = () => {
    const total = transactions.reduce((acumulator, transaction) => acumulator + Number(transaction.value), 0)
    const confirmedTotal = transactions.reduce((acumulator, transaction) => {
      if (transaction.wasConfirm) {
        return acumulator + Number(transaction.value)
      }
      return acumulator
    }, 0)
    const unconfirmedTotal = total - confirmedTotal

    setValuesInformations({
      confirmedTotal: convertToMoneyFormat(confirmedTotal),
      total: convertToMoneyFormat(total),
      unconfirmedTotal: convertToMoneyFormat(unconfirmedTotal)
    })
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


  return (
    <>
      <TopDate date={date} setDate={setDate} />

      <WhiteContainer title={type === "EXPENSE" ? "Saídas" : type === "INCOME" ? "Entradas" : ""} theme={type === "EXPENSE" ? "red" : type === "INCOME" ? "green" : "neutral"} isLoading={isLoading}>
        <div className={styles.transactionsContainer}>

          <TotalTableContainer type={type} valuesInformations={valuesInformations} />


          {transactions.map((transaction) => (
            <DescriptionTransactionBox key={transaction.id} transaction={transaction} toggleConfirmation={toggleConfirmation} />
          ))}
        </div>

        {/* <div className={styles.totalContainer}>
          <table className={styles.table}>
            <tbody>

              <tr>
                <td className={styles.td}>Recebido: </td>
                <td className={type == "INCOME" ? styles.green : styles.red}>{valuesInformations?.confirmedTotal}</td>
              </tr>
              <tr>
                <td className={styles.td}>Pendente:</td>
                <td className={type == "INCOME" ? styles.green : styles.red}>{valuesInformations?.unconfirmedTotal}</td>
              </tr>
              <tr>
                <td className={`${styles.td} ${styles.strongText}`}>Total: </td>
                <td className={`${styles.strongText} ${type == "INCOME" ? styles.green : styles.red}`}>{valuesInformations?.total}</td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </WhiteContainer>
    </>
  )
}
"use client"

import TransactionForm from "@/components/transaction-form/TransactionForm"
import { Suspense } from "react"

export default function NewIncome() {
  
  return(
    <Suspense>
      <TransactionForm type="INCOME"/>
    </Suspense>
  )
}
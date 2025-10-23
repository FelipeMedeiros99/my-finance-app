"use client"

import TransactionForm from "@/components/TransactionForm"
import { Suspense } from "react"

export default function NewIncome() {

  return (
    <Suspense>
      <TransactionForm type="EXPENSE" />
    </Suspense>
  )
}
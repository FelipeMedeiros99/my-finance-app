import { Accounts } from "@/components/transaction-form/types";
import { Transaction } from "@/components/transaction-manager/types";

export function filterNumbers(value: string) {
  const filtredValue = value.replace(/\D+/g, "")
  return filtredValue;
}

export function convertToStringNumber(value: string) {
  value = value.replace(",", ".")

  if (!value.includes(".")) {
    value = value + "00"
  }
  value = filterNumbers(value)
  return String((Number(value) / 100).toFixed(2))
}


export function convertToMoneyFormat(value: string | number) {
  let newValue = String(Number(value).toFixed(2))
  newValue = convertToStringNumber(newValue)

  newValue = (Number(value) >= 0 ? Number(newValue) : -Number(newValue)).toLocaleString("pt-BT", { style: "currency", currency: "BRL" })
  return newValue
}

export function convertToNumberFormat(value: string | number) {
  value = convertToStringNumber(String(value))
  return Number(value)
}

export function calculateTotalBalance(accounts: Transaction[]) {
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



export function calculateConfirmedBalance(accounts: Transaction[]) {
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

export function calculateConfirmedAndTotalsAtIncomesAndExpenses(accounts: Transaction[]) {
  const total = accounts.reduce((accumulate, data) => {
    if (data.type === "EXPENSE") {
      if (data.wasConfirm) {
        accumulate.expense.confirmed += Number(data.value);
      }
      accumulate.expense.total += Number(data.value);
      return accumulate
    } else if (data.type === "INCOME") {
      if (data.wasConfirm) {
        accumulate.income.confirmed += Number(data.value);
      }
      accumulate.income.total += Number(data.value);
      return accumulate
    } else {
      return accumulate
    }
  }, { income: { confirmed: 0, total: 0 }, expense: { confirmed: 0, total: 0 } })

  return total
}


export function calculateFullTotalsFromAllAccountsTransactions(accounts: Accounts[]) {
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

  return accountTotal;
}

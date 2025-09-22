"use client"

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import WhiteContainer from "@/components/white-container/WhiteContainer";
import Input from "@/components/input/Input";
import Checkbox from "@/components/checkbox/Checkbox";
import Select from "@/components/select/Select";
import InputDate from "@/components/input/InputDate";

import { convertToNumberFormat, convertToStringNumber, filterNumbers } from "@/utils/numberFunctions";
import config from "@/config";
import { useRouter, useSearchParams } from "next/navigation";

import { defaultValues, rules } from "./const";
import { Accounts, Categories, Form, Props } from "./types";

import styles from "./style.module.css";


export default function TransactionForm({ type }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Form>({ defaultValues: { ...defaultValues, type } });
  const [accounts, setAccounts] = useState<Accounts[]>([])
  const [categories, setCategories] = useState<Categories[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false)
  const route = useRouter()

  const params = useSearchParams();
  const id = params.get("id");
  const title = () => {
    if (id) {
      return type === "EXPENSE" ? "Editar despesa" : "Editar Receita"
    } else {
      return type === "EXPENSE" ? "Nova Despesa" : type === "INCOME" ? "Nova Receita" : "Nova Transação"
    }
  }

  const value = watch("value")
  const installments = watch("installments")
  const recurrent = watch("recurrent");
  const wasConfirm = watch("wasConfirm")
  const date = watch("dueDate")


  const formatData = (data: Form) => {

    const categoryData = categories.find((category) => category.name === data.category);
    if (categoryData) data.categoryId = Number(categoryData.id);

    const accountData = accounts.find((account) => account.name === data.account);
    if (accountData) data.accountId = Number(accountData.id);

    data.installments = Number(data.installments)
    data.value = convertToNumberFormat(data.value)
    data.dueDate = new Date(data.dueDate)

    return data
  }

  const onSubmit = async (data: Form) => {
    setIsFormDisabled(true)
    try {
      data = formatData(data);

      let response;
      if (id) {
        response = await config.updateTransaction(data, Number(id));
      } else {
        response = await config.createTransaction(data);
      }
      if (response.status === 201 || response.status === 200) {
        // route.push(`/${type.toLowerCase()}s`)
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("error: ", e?.response?.data)
      } else {
        console.log("error: ", e)
      }
    }
    setIsFormDisabled(false)
  };

  useEffect(() => {
    setValue("value", convertToStringNumber(String(value)))
  }, [value, setValue])

  useEffect(() => {
    setValue("installments", Number(filterNumbers(String(installments))))
  }, [installments, setValue])

  useEffect(() => {
    if (recurrent === "Não recorrente") {
      setValue("installments", 1)
    }
  }, [recurrent, setValue])

  useEffect(() => {
    (async () => {
      if (id && Number(id)) {
        try {
          const response = await config.getTransaction(`id=${id}`)
          const data = response.data[0] 

          setValue("description", data.description)
          setValue("value", data.value)
          setValue("dueDate", new Date(data.dueDate).toISOString().split("T")[0])
          setValue("recurrent", data.recurrent)
          setValue("installments", 1)
          setValue("category", data.category.name)
          setValue("account", data.account.name)
          setValue("wasConfirm", data.wasConfirm)
        } catch (err) {
          console.log(err)
        }
      }
    })()
  }, [id, setValue])

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        const accountsPromise = config.getAccountNames()
        const categoriesPromise = config.getCategoryNames(type)
        const [accounts, categories] = await Promise.all([accountsPromise, categoriesPromise])
        setAccounts(accounts.data)
        setCategories(categories.data)
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    })()
  }, [setIsLoading, setAccounts, setCategories, type])

  return (
    <WhiteContainer theme={type === "EXPENSE" ? "red" : type === "INCOME" ? "green" : "neutral"} title={title()} isLoading={isLoading}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputs}>
          <Input disabled={isFormDisabled} error={errors.description?.message} {...register("description", rules.description)} label="Descrição: " placeholder={type === "EXPENSE" ? "Ex: Aluguel" : type === "INCOME" ? "Ex: Salário" : "Ex: Transferência"} />
          {!id && <Select disabled={isFormDisabled} error={errors.recurrent?.message} {...register("recurrent", rules.recurrent)} label="Recorrência: " options={["Não recorrente", "Parcelado"]} />}
          {recurrent === "Parcelado" && <Input disabled={isFormDisabled} error={errors.installments?.message} {...register("installments", rules.installments)} label="Numero de parcelas" type="number" />}

          <Input disabled={isFormDisabled} error={errors.value?.message} {...register("value", rules.value)} label="Valor: " placeholder="Ex: 200,00" />
          <InputDate date={date} disabled={isFormDisabled} error={errors.dueDate?.message} {...register("dueDate", rules.dueDate)} label="Vencimento: " type="date" />
          {/* <div className={styles.categoryAndAccountContainer}>
          </div> */}

          <div className={styles.categoryAndAccountContainer}>
            <Select disabled={isFormDisabled} error={errors.category?.message} {...register("category", rules.category)} label="Categoria: " options={categories.map((category) => (category.name))} />
            <Select disabled={isFormDisabled} error={errors.account?.message} {...register("account", rules.account)} label="Conta: " options={accounts.map((account) => (account.name))} />
          </div>
          <Checkbox disabled={isFormDisabled} label={wasConfirm ? "Confirmado" : "Não confirmado"} {...register("wasConfirm")} />
        </div>

        <button disabled={isFormDisabled} className={`btn ${type === "EXPENSE" ? "danger" : type === "INCOME" ? "success" : ""}`} type="submit">Salvar</button>
      </form>
    </WhiteContainer>
  )
}
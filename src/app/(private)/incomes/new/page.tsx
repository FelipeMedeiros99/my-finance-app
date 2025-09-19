"use client"

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import WhiteContainer from "@/components/white-container/WhiteContainer";
import Input from "@/components/input/Input";
import Checkbox from "@/components/checkbox/Checkbox";
import Select from "@/components/select/Select";
import { defaultValues, rules } from "./const";
import { convertToNumberFormat, convertToStringNumber } from "@/utils/numberFunctions";
import config from "@/config";

import { Accounts, Categories, Form } from "./types";

import styles from "./style.module.css";
import { AxiosError } from "axios";

export default function New() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Form>({defaultValues: defaultValues});
  const [accounts, setAccounts] = useState<Accounts[]>([])
  const [categories, setCategories] = useState<Categories[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const value = watch("value")
  const wasConfirm = watch("wasConfirm")

  const onSubmit = async(data: Form) => {
    
    console.log("data: ", data)
    try{
      const categoryData = categories.find((category)=>category.name === data.category);
      if(categoryData) data.categoryId = categoryData.id;
      
      const accountData = accounts.find((account)=>account.name === data.account);
      if(accountData) data.accountId = accountData.id;

      data.value = convertToNumberFormat(data.value)

      const response = await config.createTransaction(data);

      console.log("response: ", response)
    }catch(e){
      if(e instanceof AxiosError){
        console.log(e?.response?.data)
        return
      }
      console.log(e)
    }
  };

  useEffect(() => {
    setValue("value", convertToStringNumber(String(value)))
  }, [value, setValue])

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        const accountsPromise = config.getAccountNames()
        const categoriesPromise = config.getCategoryNames()
        const [accounts, categories] = await Promise.all([accountsPromise, categoriesPromise])
        setAccounts(accounts.data)
        setCategories(categories.data)
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    })()
  }, [setIsLoading, setAccounts, setCategories])

  return (
    <WhiteContainer theme="green" title="Nova Receita" isLoading={isLoading}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputs}>
          <Input error={errors.description?.message} {...register("description", rules.description)} label="Descrição: " placeholder="Ex: Salário" />
          <Input error={errors.value?.message} {...register("value", rules.value)} label="Valor: " placeholder="Ex: 200,00" />
          <Input error={errors.dueDate?.message} {...register("dueDate", rules.dueDate)} label="Vencimento: " type="date" />
          <Select error={errors.recurrent?.message} {...register("recurrent", rules.recurrent)} label="Recorrência: " options={["Não recorrente", "Parcelado", "Fixo Mensal"]} />
          <Select error={errors.category?.message} {...register("category", rules.category)} label="Categoria: " options={categories.map((category) => (category.name))} />
          <Select error={errors.account?.message} {...register("account", rules.account)} label="Conta: " options={accounts.map((account) => (account.name))} />          
          <Checkbox label={wasConfirm ? "Confirmado" : "Não confirmado"} {...register("wasConfirm")}/>
        </div>

        <button className="btn success" type="submit">Salvar</button>
      </form>
    </WhiteContainer>
  )
}
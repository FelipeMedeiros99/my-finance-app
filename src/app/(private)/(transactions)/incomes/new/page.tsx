"use client"

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import WhiteContainer from "@/components/white-container/WhiteContainer";
import Input from "@/components/input/Input";
import Checkbox from "@/components/checkbox/Checkbox";
import Select from "@/components/select/Select";
import { convertToNumberFormat, convertToStringNumber, filterNumbers } from "@/utils/numberFunctions";
import config from "@/config";

import { defaultValues, rules } from "./const";
import { Accounts, Categories, Form } from "./types";

import styles from "./style.module.css";

export default function New() {
  const { register, reset, handleSubmit, setValue, watch, formState: { errors } } = useForm<Form>({defaultValues: defaultValues});
  
  const [accounts, setAccounts] = useState<Accounts[]>([])
  const [categories, setCategories] = useState<Categories[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false)


  const value = watch("value")
  const installments = watch("installments")
  const recurrent = watch("recurrent");
  const wasConfirm = watch("wasConfirm")

  const formatData = (data: Form) => {
    
    const categoryData = categories.find((category)=>category.name === data.category);
    if(categoryData) data.categoryId = categoryData.id;
    
    const accountData = accounts.find((account)=>account.name === data.account);
    if(accountData) data.accountId = accountData.id;

    data.installments = Number(data.installments)
    data.value = convertToNumberFormat(data.value)
    
    return data
  }


  const onSubmit = async(data: Form) => {
    setIsFormDisabled(true)
    try{
      data = formatData(data);
      const response = await config.createTransaction(data);
      if(response.status === 201){
        alert("Transação criada com sucesso!")
        reset()
      }
    }catch(e){
      if(e instanceof AxiosError){
        console.log(e?.response?.data)
      }else{
        console.log(e)
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
    if(recurrent === "Não recorrente"){
      setValue("installments", 1)
    }
  }, [recurrent, setValue])

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
          <Input disabled={isFormDisabled} error={errors.description?.message} {...register("description", rules.description)} label="Descrição: " placeholder="Ex: Salário" />
          <Input disabled={isFormDisabled} error={errors.value?.message} {...register("value", rules.value)} label="Valor: " placeholder="Ex: 200,00"/>
          <Input disabled={isFormDisabled} error={errors.dueDate?.message} {...register("dueDate", rules.dueDate)} label="Vencimento: " type="date" />
          <Select disabled={isFormDisabled} error={errors.recurrent?.message} {...register("recurrent", rules.recurrent)} label="Recorrência: " options={["Não recorrente", "Parcelado", "Fixo Mensal"]} />
          {recurrent === "Parcelado" && <Input disabled={isFormDisabled} error={errors.installments?.message} {...register("installments", rules.installments)} label="Numero de parcelas" type="number"/> }
          <Select disabled={isFormDisabled} error={errors.category?.message} {...register("category", rules.category)} label="Categoria: " options={categories.map((category) => (category.name))} />
          <Select disabled={isFormDisabled} error={errors.account?.message} {...register("account", rules.account)} label="Conta: " options={accounts.map((account) => (account.name))} />          
          <Checkbox disabled={isFormDisabled} label={wasConfirm ? "Confirmado" : "Não confirmado"} {...register("wasConfirm")}/>
        </div>

        <button disabled={isFormDisabled} className="btn success" type="submit">Salvar</button>
      </form>
    </WhiteContainer>
  )
}
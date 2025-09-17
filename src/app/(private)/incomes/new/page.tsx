"use client"

import { useForm } from "react-hook-form";
import { useEffect } from "react";

import WhiteContainer from "@/components/white-container/WhiteContainer";
import Input from "@/components/input/Input";
import Select from "@/components/select/Select";
import { getDateToday, rules } from "./const";

import styles from "./style.module.css";
import { convertToStringNumber } from "@/utils/numberFunctions";


type Form = {
  description: string;
  value: string;
  dueDate: string;
  recurrent: string;
  category: string;
  account: string;
}

export default function New() {
  const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm<Form>({
    defaultValues: {
      description: "",
      value: "0.00",
      dueDate: getDateToday(),
    }
  });

  const value = watch("value")
  
  const onSubmit = (data: Form) =>{
    console.log(data)
  };


  useEffect(()=>{
    setValue("value", convertToStringNumber(value))
  }, [value, setValue])

  return (
    <WhiteContainer theme="green" title="Nova Receita">

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputs}>
          <Input error={errors.description?.message} {...register("description", rules.description)} label="Descrição: " placeholder="Ex: Salário"/>
          <Input error={errors.value?.message} {...register("value", rules.value)} label="Valor: " placeholder="Ex: 200,00"/>
          <Input error={errors.dueDate?.message} {...register("dueDate", rules.dueDate)} label="Vencimento: " type="date"/>
          <Select error={errors.recurrent?.message} {...register("recurrent", rules.recurrent)} label="Recorrência: " options={["Não recorrente", "Parcelado", "Fixo Mensal"]}/>
          <Select error={errors.category?.message} {...register("category", rules.category)} label="Categoria: " options={["Salários", "Vendas", "Benefícios"]} />
          <Select error={errors.account?.message} {...register("account", rules.account)} label="Conta: " options={["Nubank", "Santander", "Bradesco", "Carteira"]}/>
        </div>

        <button className="btn success" type="submit">Salvar</button>
      </form>
    </WhiteContainer>
  )
}
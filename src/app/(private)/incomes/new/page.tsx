"use client"

import { useForm } from "react-hook-form";

import WhiteContainer from "@/components/white-container/WhiteContainer";
import Input from "@/components/input/Input";
import Select from "@/components/select/Select";
import { rules } from "./const";

import styles from "./style.module.css";


type Form = {
  description: string;
  value: number;
  dueDate: Date;
  recurrent: string;
  category: string;
  account: string;
}

export default function New() {
  const {register, handleSubmit, watch, formState: {errors}} = useForm<Form>();
 
  const onSubmit = (data: Form) => console.log(data);
  console.log(errors)


  return (
    <WhiteContainer theme="green" title="Nova Receita">

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputs}>
          <Input error={errors.description?.message} {...register("description", rules.description)} label="Descrição: " placeholder="Salário"/>
          <Input error={errors.description?.message} {...register("value", rules.value)} label="Valor: " placeholder="200,00"/>
          <Input error={errors.description?.message} {...register("dueDate", rules.dueDate)} label="Vencimento: " type="date" defaultValue={Date.now()}/>
          <Select error={errors.description?.message} {...register("recurrent", rules.recurrent)} label="Recorrência: " options={["Não recorrente", "Parcelado", "Fixo Mensal"]}/>
          <Select error={errors.description?.message} {...register("category", rules.category)} label="Categoria: " options={["Salários", "Vendas", "Benefícios"]} />
          <Select error={errors.description?.message} {...register("account", rules.account)} label="Conta: " options={["Nubank", "Santander", "Bradesco", "Carteira"]}/>
        </div>

        <button className="btn success" type="submit">Salvar</button>
      </form>
    </WhiteContainer>
  )
}
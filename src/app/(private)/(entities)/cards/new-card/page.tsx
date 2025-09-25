"use client"

import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Input from "@/components/input/Input";
import WhiteContainer from "@/components/white-container/WhiteContainer";
import VBox from "@/components/box/VBox";
import HBox from "@/components/box/HBox";
import Select from "@/components/select/Select";


import styles from "./style.module.css"
import { defaultValuesForm, formRules } from "./vars";

type CardForm = { 
  name: string;
  limit: number;
  closeDate: string;
  dueDate: string;
}

export default function NewCard() {
  const {register, formState: {errors}, handleSubmit} = useForm<CardForm>({defaultValues: defaultValuesForm})
  const days = useMemo(()=>new Array(31).fill(null).map((value, index)=>String(index + 1)), [])
 
  const onSubmit: SubmitHandler<CardForm> = (data)=>{
    console.log(data)
  }

  useEffect(()=>{
    // setValue
  }, [])
  console.log(errors)

  return (
    <WhiteContainer title="Novo cartão">
      <VBox as="form" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("name", formRules.name)} error={errors.name?.message} label="Nome" placeholder="Ex: Itaú" />
          <Input {...register("limit", formRules.limit)} error={errors.limit?.message} label="Limite" placeholder="Ex: 2500.00"/>

        <HBox>
        <Select {...register("closeDate", formRules.closeDate)} error={errors.closeDate?.message} label="Data de fechamento" options={days} />
        <Select {...register("dueDate", formRules.dueDate)} error={errors.dueDate?.message} label="Data de vencimento" options={days} />
        </HBox>
      
        <HBox className={styles.buttonBox}>
          <button type="submit" className={`btn success ${styles.button}`}>Salvar</button>
        </HBox>
      </VBox>
    </WhiteContainer>

  )
}
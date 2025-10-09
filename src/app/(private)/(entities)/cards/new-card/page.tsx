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
import { convertToNumberFormat } from "@/utils/numberFunctions";
import config from "@/config";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

export type CardForm = { 
  name: string;
  limit: number | string;
  closeDay: number | string;
  dueDay: number | string;
}

export default function NewCard() {
  const {register, reset, formState: {errors}, handleSubmit, setValue, watch} = useForm<CardForm>({defaultValues: defaultValuesForm})
  const days = useMemo(()=>new Array(31).fill(null).map((value, index)=>String(index + 1)), [])
  const limit = watch("limit")
  const router = useRouter()

  const onSubmit: SubmitHandler<CardForm> = async (data)=>{
    try{
      await config.createCard(data) as AxiosResponse
      reset()
      router.push("/cards")

    }catch(e){
      if(e instanceof AxiosError){
        console.log(e.response?.data)
      }
    }
  }

  useEffect(()=>{
    const reformatedLimit = convertToNumberFormat(limit).toFixed(2)
    if(reformatedLimit !== limit){
      setValue("limit", reformatedLimit)
    }
  }, [limit])

  return (
    <WhiteContainer title="Novo cartão">
      <VBox as="form" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("name", formRules.name)} error={errors.name?.message} label="Nome" placeholder="Ex: Itaú" />
          <Input {...register("limit", formRules.limit)} error={errors.limit?.message} label="Limite" placeholder="Ex: 2500.00"/>

        <HBox>
        <Select {...register("closeDay", formRules.closeDay)} error={errors.closeDay?.message} label="Data de fechamento" options={days} />
        <Select {...register("dueDay", formRules.dueDay)} error={errors.dueDay?.message} label="Data de vencimento" options={days} />
        </HBox>
      
        <HBox className={styles.buttonBox}>
          <button type="submit" className={`btn success ${styles.button}`}>Salvar</button>
        </HBox>
      </VBox>
    </WhiteContainer>

  )
}
"use client"

import WhiteContainer from "@/components/WhiteContainer";
import VBox from "@/components/VBox";
import HBox from "@/components/HBox";
import Input from "@/components/Input";
import InputDate from "@/components/InputDate";
import Select from "@/components/Select";
import { SubmitHandler, useForm } from "react-hook-form";
import { rules } from "./const";
import { useEffect, useState } from "react";
import config from "@/config";
import { AxiosError } from "axios";
import { convertToNumberFormat } from "@/utils/numberFunctions";
import { convertInputDateToDate } from "@/utils/dateFunctions";

type CardExpenseForm = {
  description: string;
  cardId: number;
  categoryId: number;
  value: number;
  date: string;
  category: string;
  card: string;
  installments: number;
}

export type CardExpenseSendForm = {
  description: string;
  cardId: number;
  categoryId: number;
  value: number;
  date: Date;
  installments: number;
}

type Category = {
  id: number;
  name: string;
  type: 'INCOME' | "EXPENSE";
  userId: number;
}

type Card = {
  id: number;
  name: string;
  limit: number | string;
  closeDay: number;
  dueDay: number
}

export default function New() {
  const [cardData, setCardData] = useState<Card[]>([])
  const [categoryData, setCategoryData] = useState<Category[]>([])

  const { register, reset, formState: { errors }, handleSubmit, watch, setValue } = useForm<CardExpenseForm>({
    defaultValues: {
      value: 0.00
    }})


  const date = watch("date");

  const onSubmit: SubmitHandler<CardExpenseForm> = async(data) => {
    try{
      const card = cardData.find((card)=> card.name === data.card);
      if(!card) throw new Error("Nome de cartão inválido")
      const category = categoryData.find((category)=> category.name === data.category);
      if(!category) throw new Error("Nome de categoria inválido")

      const sendData: CardExpenseSendForm = {
        cardId: card?.id,
        categoryId: category?.id,
        date: convertInputDateToDate(data?.date),
        description: data?.description,
        installments: data?.installments,
        value: convertToNumberFormat(data?.value)
      }
      await config.createCardExpense(sendData)
      reset()
    }catch(e){
      if(e instanceof AxiosError) {
        console.log(e?.response?.data)
        return
      }
      console.log(e)
    }     
  }

  useEffect(() => {
    (async () => {
      try {
        const [cardResponse, categoryResponse] = await Promise.all([config.getCards(), config.getCategories("EXPENSE")]);
        setCardData(cardResponse?.data);
        setCategoryData(categoryResponse?.data);
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

  useEffect(()=>{
    setValue("category", "")
    setValue("card", "")
  }, [cardData, categoryData])

  useEffect(()=>{
    const currentDate = new Date()

    const day = (currentDate.getDate()).toString().padStart(2, "0");
    const month = (currentDate.getMonth()+1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    const localDate = `${year}-${month}-${day}`
    setValue("date", localDate)
  }, [])

  return (
    <WhiteContainer title="Nova despesa">
      <VBox as="form" onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("description", rules.description)} error={errors.description?.message} label="Descrição" placeholder="Ex: Nova despesa" />
        <Input {...register("value", rules.value)} error={errors.value?.message} label="Valor" placeholder="Ex: 200.00" type="number" step={0.01}/>
        <InputDate {...register("date", rules.date)} error={errors.date?.message} label="Data" date={date} type="date"/>
        <Select {...register("category", rules.category)} error={errors.category?.message} label="Categoria" options={categoryData.map((category) => category.name)} />
        <Select {...register("card", rules.card)} error={errors.card?.message} label="Cartão" options={cardData.map((card) => card?.name)} />
        <Input {...register("installments", rules.installments)} error={errors.installments?.message} label="Parcelas" placeholder="ex: 10" type="number" />

        <HBox>
          <button type="submit" className="btn success" style={{ width: "100%" }}>Salvar</button>
        </HBox>
      </VBox>
    </WhiteContainer>
  )
}
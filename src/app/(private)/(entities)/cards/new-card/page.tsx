"use client"

import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Input from "@/components/Input";
import WhiteContainer from "@/components/WhiteContainer";
import VBox from "@/components/VBox";
import HBox from "@/components/HBox";
import Select from "@/components/Select";

import { convertToNumberFormat } from "@/utils/numberFunctions";
import config from "@/config";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import ButtonForm from "@/components/ButtonForm";

export type CardForm = {
  name: string;
  limit: number | string;
  closeDay: number | string;
  dueDay: number | string;
}

const required = { value: true, message: "Este campo é obrigatório" }
const valueAsNumber = true

const formRules = {
  name: { required, maxLength: { value: 30, message: "No máximo, 30 caracteres" } },
  limit: { required, pattern: { value: /^\d+\.\d{1,2}$/, message: "Insira um valor válido" } },
  closeDay: { required, valueAsNumber },
  dueDay: { required, valueAsNumber },
}

const defaultValuesForm = {
  closeDay: '',
  dueDay: '',
  limit: 0.00
}

export default function NewCard() {
  const { register, reset, formState: { errors }, handleSubmit, setValue, watch } = useForm<CardForm>({ defaultValues: defaultValuesForm })
  const days = useMemo(() => new Array(31).fill(null).map((value, index) => String(index + 1)), [])
  const limit = watch("limit")
  const router = useRouter()

  const onSubmit: SubmitHandler<CardForm> = async (data) => {
    try {
      await config.createCard(data) as AxiosResponse
      reset()
      router.push("/cards")

    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.data)
      }
    }
  }

  useEffect(() => {
    const reformatedLimit = convertToNumberFormat(limit).toFixed(2)
    if (reformatedLimit !== limit) {
      setValue("limit", reformatedLimit)
    }
  }, [limit])

  return (
    <WhiteContainer title="Novo cartão">
      <VBox as="form" onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("name", formRules.name)} error={errors.name?.message} label="Nome" placeholder="Ex: Itaú" />
        <Input {...register("limit", formRules.limit)} error={errors.limit?.message} label="Limite" placeholder="Ex: 2500.00" />

        <HBox>
          <Select {...register("closeDay", formRules.closeDay)} error={errors.closeDay?.message} label="Data de fechamento" options={days} />
          <Select {...register("dueDay", formRules.dueDay)} error={errors.dueDay?.message} label="Data de vencimento" options={days} />
        </HBox>

        <ButtonForm type="submit">Salvar</ButtonForm>
      </VBox>
    </WhiteContainer>

  )
}
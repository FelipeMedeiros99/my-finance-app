"use client"

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import WhiteContainer from "@/components/WhiteContainer";
import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";
import Select from "@/components/Select";
import InputDate from "@/components/InputDate";

import { convertToNumberFormat, convertToStringNumber, filterNumbers } from "@/utils/numberFunctions";
import config from "@/config";
import { useRouter, useSearchParams } from "next/navigation";

import { convertInputDateToDate } from "@/utils/dateFunctions";
import ButtonForm from "./ButtonForm";
import { Transaction } from "./transactionManager";


type TransactionType = "INCOME" | "EXPENSE"


export type Props = {
  type: TransactionType;
}

export type Form = {
  description: string;
  categoryId: number;
  accountId: number
  value: string | number;
  dueDate: string | Date;
  recurrent: "Não recorrente" | "Parcelado" | "Fixo Mensal";
  installments: number
  category: string;
  account: string;
  type: TransactionType;
  wasConfirm: boolean;

}

export type Accounts = {
  name: string;
  id: number;
  openingBalance: number | string;
  createdAt: Date;
  transaction?: Transaction[]
}

export type Categories = {
  name: string;
  id: number
}

const rules = {
  description: { required: { value: true, message: "Este campo é obrigatório" }, maxLength: { value: 20, message: "O nome deve ter no máximo 20 caracteres" } },
  value: { required: { value: true, message: "Este campo é obrigatório" }, pattern: { value: /^\d+(.\d{1,2})?$/, message: "O valor deve ser válido" } },
  dueDate: { required: { value: true, message: "Este campo é obrigatório" } },
  recurrent: { required: { value: true, message: "Este campo é obrigatório" } },
  category: { required: { value: true, message: "Este campo é obrigatório" } },
  account: { required: { value: true, message: "Este campo é obrigatório" } },
  installments: { min: { value: 1, message: "Quantidade mínima de 1 parcela" } }
}

const getDateToday = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${year}-${month}-${day}`;
}

const defaultValues: Omit<Form, "type" | "accountId" | "categoryId"> = {
  description: "",
  value: "0.00",
  installments: 1,
  recurrent: "Não recorrente",
  wasConfirm: true,
  dueDate: getDateToday(),
  account: "",
  category: ""
}

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
    data.dueDate = convertInputDateToDate(data.dueDate)


    return data
  }

  const onSubmit = async (data: Form) => {
    setIsFormDisabled(true)
    try {
      data = formatData(data);
      console.log(data)

      let response;
      if (id) {
        response = await config.updateTransaction(data, Number(id));
      } else {
        response = await config.createTransaction(data);
      }
      if (response.status === 201 || response.status === 200) {
        route.push(`/${type.toLowerCase()}s`)
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
          setValue("dueDate", new Date(data.dueDate))
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
    <WhiteContainer
      theme={type === "EXPENSE" ? "red" : type === "INCOME" ? "green" : "neutral"}
      title={title()}
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 mt-5">

        <div className="flex flex-col gap-2">
          <Input disabled={isFormDisabled} error={errors.description?.message} {...register("description", rules.description)} label="Descrição: " placeholder={type === "EXPENSE" ? "Ex: Aluguel" : type === "INCOME" ? "Ex: Salário" : "Ex: Transferência"} />
          {!id && <Select disabled={isFormDisabled} error={errors.recurrent?.message} {...register("recurrent", rules.recurrent)} label="Recorrência: " options={["Não recorrente", "Parcelado"]} />}
          {recurrent === "Parcelado" && <Input disabled={isFormDisabled} error={errors.installments?.message} {...register("installments", rules.installments)} label="Numero de parcelas" type="number" />}
          <Input disabled={isFormDisabled} error={errors.value?.message} {...register("value", rules.value)} label="Valor: " placeholder="Ex: 200,00" />
          <InputDate date={date} disabled={isFormDisabled} error={errors.dueDate?.message} {...register("dueDate", rules.dueDate)} label="Vencimento: " type="date" />
          <div className="grid grid-cols-2 gap-4 items-baseline">
            <Select disabled={isFormDisabled} error={errors.category?.message} {...register("category", rules.category)} label="Categoria: " options={categories.map((category) => (category.name))} />
            <Select disabled={isFormDisabled} error={errors.account?.message} {...register("account", rules.account)} label="Conta: " options={accounts.map((account) => (account.name))} />
          </div>
          <Checkbox disabled={isFormDisabled} label={wasConfirm ? "Confirmado" : "Não confirmado"} {...register("wasConfirm")} />
        </div>

        <ButtonForm disabled={isFormDisabled} className={`btn ${type === "EXPENSE" ? "danger" : "success"} w-full py-3 text-lg font-semibold`} type="submit">
          Salvar
        </ButtonForm>

      </form>
    </WhiteContainer>
  )
}
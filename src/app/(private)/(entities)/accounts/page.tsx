"use client"

import React, { useEffect, useState } from "react"
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form";

import config from "@/config"

import { convertToMoneyFormat, convertToNumberFormat, convertToStringNumber } from "@/utils/numberFunctions";
import WhiteContainer from "@/components/white-container/WhiteContainer"
import Input from "@/components/input/Input";
import Modal from "@/components/modal/Modal";
import TopDate from "@/components/top-date/TopDate";

import styles from "./style.module.css"
import { rules } from "./const";

type Form = {
  id: number | null;
  name: string;
  openingBalance: string | number;
}

type AccountModel = {
  id: number;
  name: string;
  openingBalance: string;
}


export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const { register, setValue, setError, handleSubmit, watch, formState: { errors } } = useForm<Form>({
    defaultValues: {
      name: "",
      openingBalance: "R$ 0.00",
      id: null
    }
  });
  const openingBalance = watch("openingBalance");

  const onSubmit: SubmitHandler<Form> = async (data: Form) => {
    data.openingBalance = convertToNumberFormat(String(data.openingBalance))
    
    try {
      if (!data.id) {
        await config.createAccount(data.name, data.openingBalance)
        await getAccount()
        cancelModalFunction()
      } else {
        await config.editAccount(data.id, data.name, data.openingBalance)
        await getAccount()
        cancelModalFunction()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const openModal = () => {
    setIsModalVisible(true);
    setValue("name", "");
    setValue("openingBalance", "0");
    setValue("id", null);
    setError("name", { type: "required", message: "" })
  }

  const getAccount = async () => {
    try {
      const account = await config.getAccounts()
      setAccounts(account?.data);
    } catch (e) {
      console.log(e)
      // alert("Erro ao tentar buscar as categorias")
    }
  }

  const deleteAccount = async (id: number) => {
    try {
      await config.deleteAccount(id)
      await getAccount()
    } catch (e) {
      console.log(e)
      // alert("Erro ao tentar deletar a categoria")
    }
  }

  const cancelModalFunction = () => {
    setIsModalVisible(false);
    setValue("name", "");
    setValue("openingBalance", "0");
    setValue("id", null);
    setError("name", { type: "required", message: "" });
  }

  const editAccount = (account: AccountModel) => {
    setValue("name", account.name);
    setValue("openingBalance", account.openingBalance);
    setValue("id", account.id);
    setIsModalVisible(true);
  }

  useEffect(() => {
    setValue("openingBalance", convertToStringNumber(String(openingBalance)))
  }, [openingBalance, setValue])

  useEffect(() => {
    (async () => {
      await getAccount()
    })()
  }, [])

  return (
    <React.Fragment>
      <TopDate date={date} setDate={setDate} />
      <WhiteContainer title="Contas" theme={"neutral"}>
        <FaPlusCircle className={styles.icon} onClick={() => openModal()} />
        <div className={styles.categoryContainer}>
          {accounts &&
            accounts.map((account: AccountModel) => (
              <div key={account.id} className={styles.account}>
                <p>{account.name}</p>
                <div className={styles.icons}>
                  <FaEdit onClick={() => editAccount(account)} />
                  <AiFillDelete onClick={() => deleteAccount(account?.id)} />
                </div>
                <p>saldo: {convertToMoneyFormat(account.openingBalance)}</p>
              </div>
            )
            )}
        </div>
      </WhiteContainer>

      <Modal isOpen={isModalVisible} setIsOpen={setIsModalVisible} title="Nova conta" theme={"neutral"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("name", rules.name)} error={errors.name?.message} label="Título: " placeholder="Título da categoria" />
          <Input {...register("openingBalance", rules.openingBalance)} error={errors.openingBalance?.message} label="Saldo inicial: " placeholder="Título da categoria" />
          <div className={styles.containerButtons}>
            <button type="button" onClick={cancelModalFunction} className="btn danger">Cancelar</button>
            <button type="submit" className="btn success">Salvar</button>
          </div>
        </form>
      </Modal>

    </React.Fragment>
  )
}
"use client"

import React, { useEffect, useState } from "react"
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form";

import config from "@/config"

import WhiteContainer from "@/components/white-container/WhiteContainer"
import Input from "@/components/input/Input";
import Modal from "@/components/modal/Modal";

import styles from "./style.module.css"
import { rules } from "./const";

type Form = {
  name: string;
  type: string;
  id: number | null;
}

type CategoryModel = {
  id: number;
  name: string;
  type: string;
}

const ButtonCategory = ({isActived, children, ...props}: React.ComponentProps<"button"> & {isActived: boolean}) => {

  return(
    <button className={`${styles.toggleButton} ${isActived ? styles.active : ''}`} {...props}>{children}</button>
  )
}




export default function Category() {
  const [categories, setCategories] = useState([])
  const [pageType, setPageType] = useState<"EXPENSE" | "INCOME">("EXPENSE")
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { register, setValue, setError, handleSubmit, formState: { errors } } = useForm<Form>({
    defaultValues: {
      name: "",
      type: pageType,
      id: null
    }
  })

  const onSubmit: SubmitHandler<Form> = async (data: Form) => {
    try {
      if (!data.id) {
        await config.createCategory(data.name, data.type)
        await getCategorys()
        cancelModalFunction()
      } else {
        await config.editCategory(data.id, data.name)
        await getCategorys()
        cancelModalFunction()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const openModal = () => {
    setIsModalVisible(true);
    setValue("name", "");
    setValue("type", pageType);
    setValue("id", null);
    setError("name", { type: "required", message: "" })
  }

  const getCategorys = async () => {
    try {
      const categorys = await config.getCategories()
      setCategories(categorys?.data);
    } catch (e) {
      console.log(e)
      // alert("Erro ao tentar buscar as categorias")
    }
  }

  const deleteCategorys = async (id: number) => {
    try {
      await config.deleteCategory(id)
      await getCategorys()
    } catch (e) {
      console.log(e)
      // alert("Erro ao tentar deletar a categoria")
    }
  }

  const cancelModalFunction = () => {
    setIsModalVisible(false);
    setValue("name", "");
    setValue("type", pageType);
    setValue("id", null);
    setError("name", { type: "required", message: "" });
  }

  const editCategory = (category: CategoryModel) => {
    setValue("name", category.name);
    setValue("type", category.type);
    setValue("id", category.id);
    setIsModalVisible(true);
  }

  useEffect(() => {
    (async () => {
      await getCategorys()
    })()
  }, [])

  return (
    <React.Fragment>


      <WhiteContainer title="Categorias" theme={pageType === "EXPENSE" ? "red" : pageType === "INCOME" ? "green" : "neutral"}>

        <div className={`${styles.toggleGroup} ${pageType === "EXPENSE" ? styles.red : pageType === "INCOME" ? styles.green : ""}`}>
          <ButtonCategory isActived={pageType === "INCOME"} onClick={() => setPageType("INCOME")}>Receitas</ButtonCategory>
          <ButtonCategory isActived={pageType === "EXPENSE"} onClick={() => setPageType("EXPENSE")}>Despesas</ButtonCategory>
        </div>

        <FaPlusCircle className={styles.icon} onClick={() => openModal()} />
        
        <div className={styles.categoryContainer}>
          {categories &&
            categories.map((category: CategoryModel) => {
              {
                if (category.type === pageType) {
                  return (
                    <div key={category.id} className={styles.category}>
                      <p>{category.name}</p>
                      <div className={styles.icons}>
                        <FaEdit onClick={() => editCategory(category)} />
                        <AiFillDelete onClick={() => deleteCategorys(category?.id)} />
                      </div>
                    </div>
                  )
                }
              }
            })}
        </div>
      </WhiteContainer>

      <Modal isOpen={isModalVisible} setIsOpen={setIsModalVisible} title="Nova categoria" theme={pageType === "EXPENSE" ? "red" : pageType === "INCOME" ? "green" : "neutral"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("name", rules.name)} error={errors.name?.message} label="Título: " placeholder="Título da categoria" />
          <div className={styles.containerButtons}>
            <button type="button" onClick={cancelModalFunction} className="btn danger">Cancelar</button>
            <button type="submit" className="btn success">Salvar</button>
          </div>
        </form>
      </Modal>

    </React.Fragment>
  )
}
"use client"

import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { passwordRules, usernameRules } from "./const"
import Input from "@/components/Input"

import styles from "../style.module.css"
import config from "@/config"
import { AxiosError } from "axios"

type Form = {
  username: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Form>();
  const router = useRouter()

  const onSubmit: SubmitHandler<Form> = async (data) => {
    const { username, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setError("password", { type: "manual", message: "Senhas não coincidem" })
      setError("confirmPassword", { type: "manual", message: "Senhas não coincidem" })
      return;
    }
    try {
      const response = await config.register(data.username, data.password, data.confirmPassword)
      if (response.status === 201) {
        alert("Usuário criado, faça login!")
        router.push("/login")
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        const message = e?.response?.data?.message;
        if (message === "This username is already registered.") {
          setError("username", { type: "manual", message: "Este usuário já está em uso" })
          return
        }
      } else {
        console.error(e)
        alert("Um erro desconhecido aconteceu, tente novamente mais tarde.")
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h1>Cadastro</h1>

      <Input
        label="Usuário: "
        placeholder="meu_usuario"
        error={errors?.username?.message}
        {...register("username", usernameRules)}
      />

      <Input
        label="Senha: "
        placeholder="123456"
        error={errors?.password?.message}
        {...register("password", passwordRules)}
      />

      <Input
        label="Confirmar senha: "
        placeholder="123456"
        error={errors?.password?.message}
        {...register("confirmPassword", passwordRules)}
      />

      <button type="submit" className="btn success">Cadastrar</button>
      <Link href={"/login"}>Já possui conta? Faça login.</Link>

    </form>
  )
}
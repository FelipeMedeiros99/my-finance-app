"use client"

import { SubmitHandler, useForm } from "react-hook-form"
import Link from "next/link"

import Input from "@/components/Input"
import { passwordRules, usernameRules } from "./const"

import styles from "../style.module.css"

type Form = {
  username: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = (data) => {
    if(data.password !== data.confirmPassword){
      setError("password", {type: "manual", message: "Senhas não coincidem"})
      setError("confirmPassword", {type: "manual", message: "Senhas não coincidem"})
      return
    }
    console.log("clicado", data)
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h1>Login</h1>

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
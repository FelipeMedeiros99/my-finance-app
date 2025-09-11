"use client"

import { SubmitHandler, useForm } from "react-hook-form"
import Link from "next/link"

import Input from "@/components/Input"
import { passwordRules, usernameRules } from "./const"

import styles from "../style.module.css"

type Form = {
  username: string
  password: string
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = (data) => {
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

      <button type="submit" className="btn success">Login</button>
      <Link href={"/register"}>Não possui conta? Cadastre-se.</Link>
      
    </form>
  )
}
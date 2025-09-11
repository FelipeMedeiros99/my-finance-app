"use client"

import { SubmitHandler, useForm } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/navigation"

import Input from "@/components/Input"
import { passwordRules, usernameRules } from "./const"

import styles from "../style.module.css"
import config from "@/config"
import axios from "axios"

type Form = {
  username: string
  password: string
}

export default function Login() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Form>();
  const router = useRouter()
  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      const response = await config.login(data.username, data.password)
      const token = response?.data?.access_token;
      if (token) {
        localStorage.setItem("token", token);
        router.push("/home");
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e?.response?.data
        if (error.message === "username not found") {
          return setError("username", { type: "manual", message: "Usuário não encontrado" })
        } else if (error.message === "Incorrect password") {
          return setError("password", { type: "manual", message: "Senha incorreta" })
        }else{
          console.log(e)
          alert("Um erro desconhecido aconteceu, contate o desenvolvedor")  
        }
      }else{
        console.log(e)
        alert("Um erro desconhecido aconteceu, contate o desenvolvedor")
      }
    }
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
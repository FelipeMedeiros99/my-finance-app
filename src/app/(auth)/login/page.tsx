"use client"

import { SubmitHandler, useForm } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/navigation"

import Input from "@/components/Input"
import PasswordInput from "@/components/PasswordInput"
import { passwordRules, usernameRules } from "./const"

import config from "@/config"
import { AxiosError } from "axios"
import AuthContainer from "@/components/AuthContainer"
import ButtonForm from "@/components/ButtonForm"

type Form = {
  username: string
  password: string
}

export default function Login() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Form>();
  const router = useRouter();

  const handleLoginErrors = (e: AxiosError) => {
    const error = e?.response?.data as { message: string }
    if (error?.message === "username not found") {
      return setError("username", { 
        type: "manual", 
        message: "Usuário não encontrado" 
      })
    } else if (error?.message === "Incorrect password") {
      return setError("password", { 
        type: "manual", 
        message: "Senha incorreta" 
      })
    } else {
      console.error(e)
      alert("Um erro desconhecido aconteceu, tente novamente mais tarde.")
    }
  }

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      const response = await config.login(data.username, data.password)
      const token = response?.data?.access_token;
      if (token) {
        localStorage.setItem("token", token);
        router.push("/home");
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        handleLoginErrors(e)
      } else {
        console.error(e)
        alert("Um erro desconhecido aconteceu, tente novamente mais tarde.")
      }
    }
  };

  return (
    <AuthContainer onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>

      <Input
        label="Usuário: "
        error={errors?.username?.message}
        {...register("username", usernameRules)}
      />

      <PasswordInput
        label="Senha: "
        error={errors?.password?.message}
        {...register("password", passwordRules)}
      />
      <ButtonForm>Login</ButtonForm>
      <p>
        Não possui conta?{" "}
        <Link href={"/register"} className="text-lime-600 underline">Cadastre-se.</Link>
      </p>
        

    </AuthContainer>
  )
}
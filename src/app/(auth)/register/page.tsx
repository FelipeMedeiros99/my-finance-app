"use client"

import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { passwordRules, usernameRules } from "./const"
import Input from "@/components/input/Input"

import config from "@/config"
import { AxiosError } from "axios"
import AuthContainer from "@/components/AuthContainer"
import ButtonForm from "@/components/ButtonForm"
import PasswordInput from "@/components/input/PasswordInput"

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
      const response = await config.register(username, password, confirmPassword)
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
    <AuthContainer onSubmit={handleSubmit(onSubmit)}>

      <h1>Cadastro</h1>

      <Input
        label="Usuário: "
        placeholder="meu_usuario"
        error={errors?.username?.message}
        {...register("username", usernameRules)}
      />

      <PasswordInput
        label="Senha: "
        placeholder="123456"
        error={errors?.password?.message}
        {...register("password", passwordRules)}
      />

      <PasswordInput
        label="Confirmar senha: "
        placeholder="123456"
        error={errors?.password?.message}
        {...register("confirmPassword", passwordRules)}
      />
      <ButtonForm>Cadastrar</ButtonForm>

      <p>
        Não possui conta?{" "}
        <Link href={"/login"} className="text-lime-600 underline">Faça login.</Link>
      </p>

    </AuthContainer>
  )
}
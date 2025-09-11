"use client"

import { InputHTMLAttributes, useId } from "react"

import styles from "./style.module.css"

type PropsInput = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  error?: string | undefined
}

export default function Input({label, error, ...props}: PropsInput){
  const id = useId();
  return (
  <div className={styles.inputContainer}>
    <label htmlFor={id}>{label}</label>
    <input className={styles.input} id={id} {...props}/>
    {error && <p className={styles.errorAlert}>{error}</p>}
  </div>
  )
}
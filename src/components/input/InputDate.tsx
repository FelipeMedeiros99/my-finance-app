"use client"

import { InputHTMLAttributes, useId, useRef } from "react"

import styles from "./style.module.css"
import { convertDateToText } from "@/utils/dateFunctions"

type PropsInput = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name?: string;
  date: string | Date;
  error?: string | undefined;
  ref?: React.ForwardedRef<HTMLInputElement>;
}

export default function InputDate({ label, date, error, ref, ...props }: PropsInput) {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerInput = useRef<HTMLInputElement>(null)
  const handleClick = () => {
    inputRef.current?.showPicker()
  }

  const refFunction = (e: HTMLInputElement | null) => {
    inputRef.current = e;
    if (typeof ref === 'function') {
      ref(e);
    } else if (ref) {
      ref.current = e;
    }
  }

  const id = useId();
  return (
    <div className={`${styles.inputContainer}`}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.dateContainer} onClick={handleClick} ref={containerInput}>
        <button type="button" className={styles.dateText}>{date ? convertDateToText(date) : "Selecione uma data"}</button>
        <input
          tabIndex={-1}
          className={`${styles.input} ${styles.dateInput}`} 
          id={id} 
          type="date" 
          ref={refFunction}
          {...props} 
          />
      </div>
      {error && <p className={styles.errorAlert}>{error}</p>}
    </div>
  )
}
"use client"

import { InputHTMLAttributes, useId, useRef } from "react"

import styles from "./style.module.css"
import { formateDateToText } from "@/utils/dateFunctions"

type PropsInput = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name?: string;  
  date: string | Date;
  error?: string | undefined; 
  ref?: React.ForwardedRef<HTMLInputElement>;
}

export default function InputDate({label, date, error, ref, ...props}: PropsInput){
  const inputRef = useRef<HTMLInputElement>(null)
  const containerInput = useRef<HTMLInputElement>(null)
  const handleClick = ()=>{
    inputRef.current?.showPicker()
  } 


  const id = useId();
  return (
  <div className={`${styles.inputContainer}`}>
    <label htmlFor={id}>{label}</label>
    <div className={styles.dateContainer} onClick={handleClick} ref={containerInput}>
      <button type="button" className={styles.dateText}>{formateDateToText(date)}</button>
      <input 
      tabIndex={-1}
      ref={(e)=>{
        inputRef.current = e;
        if (typeof ref === 'function') {
          ref(e);
        } else if (ref) {
          ref.current = e;
        }
      }}
        className={`${styles.input} ${styles.dateInput}`} id={id} {...props} type="date" />
    </div>
    {error && <p className={styles.errorAlert}>{error}</p>}
  </div>
  )
}
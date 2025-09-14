"use client"

import { SelectHTMLAttributes, useId } from "react"

import styles from "./style.module.css"

type PropsSelect = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  name?: string;
  options: string[];
  error?: string | undefined;
}

export default function Select({label, options, error, ...props}: PropsSelect){
  const id = useId();
  return (
  <div className={styles.selectContainer}>
    <label htmlFor={id}>{label}</label>
    
    <select className={styles.select} id={id} {...props}>
             
      {options && options.map((option, index)=>(
        <option key={option+index} value={option}>{option}</option>
      ))}
    </select>
    
    {error && <p className={styles.errorAlert}>{error}</p>}
  </div>
  )
}
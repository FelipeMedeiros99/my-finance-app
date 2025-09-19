"use client"

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


import styles from "./style.module.css";

type Props = {
  date: Date;
  setDate: (date: Date) => void;
}

export default function TopDate({date, setDate}: Props){
  const now = new Date()

  const formatTitle = ()=>{
    if(now.getFullYear()!==date.getFullYear()){
      const month = date.toLocaleString("pt-BR", { month: "short" })
      const year = date.toLocaleString("pt-br", {year: "2-digit"}) 
      return `${month} ${year}`
    }else{
      return `${date.toLocaleString("pt-BR", {month: "long"})}`
    }
  }

  const setMonth = (value: number) => {
    const newData = new Date(date)
    newData.setMonth(date.getMonth()+value)
    setDate(newData)
  }

  return(
    <div className={styles.dateContainer}>
      <FaChevronLeft className={styles.icon} onClick={() => setMonth(-1)}/>
      <h1 className={styles.h1}>{formatTitle()}</h1>
      <FaChevronRight className={styles.icon} onClick={() => setMonth(+1)}/>
    </div>
  )
}
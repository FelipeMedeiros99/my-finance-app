"use client"

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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


return (
  <div className="flex w-full items-center justify-center gap-4 py-4 px-6 bg-white shadow-sm border-b border-gray-100">
    
    <button 
      onClick={() => setMonth(-1)} 
      className="p-2 text-gray-500 hover:text-gray-900 transition duration-150 rounded-full"
      aria-label="Mês Anterior"
    >
      <FaChevronLeft className="text-xl" />
    </button>
    
    <h1 className="text-center text-xl font-semibold text-gray-800 grow">
      {formatTitle()}
    </h1>
    
    <button 
      onClick={() => setMonth(1)} 
      className="p-2 text-gray-500 hover:text-gray-900 transition duration-150 rounded-full"
      aria-label="Próximo Mês"
    >
      <FaChevronRight className="text-xl" />
    </button>
    
  </div>
);  

}
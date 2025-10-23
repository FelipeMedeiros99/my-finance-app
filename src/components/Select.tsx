"use client"

import { SelectHTMLAttributes, useId } from "react"
import { inputContainer, inputStyle } from "./Input";

type PropsSelect = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  name?: string;
  options: string[];
  error?: string | undefined;
}

export default function Select({label, options, error, ...props}: PropsSelect){
  const id = useId();
  
  const baseClasses = `
    h-10 w-full px-3 py-2 
    bg-white 
    border border-gray-300 
    px-2 py-1
    rounded-md 
    shadow-sm 
    focus:outline-none 
    focus:ring
    focus:ring-lime-600 
    text-gray-700 
    sm:text-sm
  `;

  return (
    <div className={inputContainer}>
      
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <select 
        id={id} 
        className={inputStyle}
        {...props}
      >
        <option value="" disabled>Selecione uma opção</option>
        
        {options && options.map((option, index)=>(
          <option key={option+index} value={option}>{option}</option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
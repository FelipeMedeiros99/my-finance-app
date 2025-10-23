"use client"

import { InputHTMLAttributes, useId, useRef } from "react"

import { convertDateToText } from "@/utils/dateFunctions"
import { inputContainer, inputStyle } from "./Input"

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
    <div className={inputContainer}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div 
        className="relative h-10 w-full flex items-center justify-center" 
        onClick={handleClick}
      >
        <button 
          type="button" 
          className={`w-full flex items-start ${inputStyle}`}
        >
          {date ? convertDateToText(date) : "Selecione uma data"}
        </button>

        <input
          tabIndex={-1}
          className={`
            absolute inset-0 
            opacity-0 
            w-full 
            h-full 
            cursor-pointer 
            z-20
          `} 
          id={id} 
          type="date" 
          ref={refFunction}
          {...props} 
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
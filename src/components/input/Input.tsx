"use client"

import { InputHTMLAttributes, useId } from "react"

type PropsInput = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  name?: string
  error?: string | undefined
}

export default function Input({ label, error, ...props }: PropsInput) {
  const id = useId();
  return (
    <div className="grid grid-cols-1">
      <label htmlFor={id}>{label}</label>
      <input
        className='
            shadow-lg
            border border-gray-400
            px-2 py-1
            rounded-md
            focus:outline-none focus:ring-1 focus:ring-lime-600 
          '
        {...props}
      />
      <p className='
          mt-1
          text-xs
          text-red-500
        '
      >{error}</p>
    </div>
  )
}
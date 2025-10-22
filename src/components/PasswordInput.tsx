// components/password-input/PasswordInput.jsx
"use client";

import React, { useState, useId, InputHTMLAttributes } from 'react';
// Importa os ícones do Font Awesome (Fa)
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { inputStyle } from './Input';

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function PasswordInput({ label, error, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className='grid grid-cols-1'>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>{label}</label>
      
      <div className='relative'>
        <input
          className={inputStyle}
          type={showPassword ? "text" : "password"}
          {...props}
          />
        
        <button type='button' onClick={togglePasswordVisibility} 
          className='
            inset-y-0
            absolute right-0
            w-8
            flex items-center justify-center
            hover:cursor-pointer
            focus:outline-none focus:ring focus:ring-lime-600
          '
        >
          {showPassword ? <FaEye /> : <FaEyeSlash/>}
        </button>
      </div>
      {error && 
        <p className='
          mt-1
          text-xs
          text-red-500
        '
        >{error}</p>
      }

    </div>
  );
}
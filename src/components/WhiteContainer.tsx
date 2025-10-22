'use client'

import React from "react";
import { ClipLoader } from "react-spinners";


type Props = {
  children?: React.ReactNode;
  title?: string;
  theme?: "green" | "red" | "neutral",
  isLoading?: boolean;
}

const themeClasses = {
  neutral: "border-gray-500 text-gray-900",
  green: "border-green-600",
  red: "border-red-600",
};

const spinnerColorMap = {
  neutral: "#1f2937",
  green: "#16a34a",
  red: "#dc2626", 
};


export default function WhiteContainer({ children, theme = "neutral", title, isLoading = false }: Props) {
  const currentThemeClasses = themeClasses[theme] || themeClasses.neutral;
  const spinnerColor = spinnerColorMap[theme] || spinnerColorMap.neutral;
  
  return (
    <div 
      className={`
        relative 
        bg-white 
        flex 
        flex-col 
        m-3 
        p-3 
        pb-5
        min-h-32 
        rounded-lg 
        shadow-md 
        border 
        ${currentThemeClasses}
    `}>
      <h3 className="p-4 text-2xl text-gray-800 font-bold text-center mb-6">
        {title}
      </h3>
      
      {isLoading ? (
        <div className="flex grow items-center justify-center min-h-32">
          <ClipLoader size={50} color={spinnerColor} />
        </div>
      ) : (
        <div className="flex flex-col grow">
          {children}
        </div>
      )}
    </div>
  )
}
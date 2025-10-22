import { FormHTMLAttributes } from "react";
import Image from "next/image";

import logo from "@/assets/images/logo.png"

export default function AuthContainer({ children, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className="
      container
      px-8 py-5 
      border border-gray-300 rounded-2xl
      w-full max-w-80
      shadow-sm
      bg-white
      grid-cols-1
      justify-items-center
      " {...props}
      >
      <Image src={logo} alt="Logo do Financial Control" className="h-15 w-15"/>
      <div className="
      grid grid-cols-1 
      gap-6 
      justify-items-center

      ">
      {children}
      </div>
    </form>
  )
}
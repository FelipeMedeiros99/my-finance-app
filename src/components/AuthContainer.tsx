import { FormHTMLAttributes } from "react";

export default function AuthContainer({ children, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className="
      container
      grid grid-cols-1 
      gap-6 
      px-8 py-5 
      border border-gray-300 rounded-2xl
      w-full max-w-80
      justify-items-center
      shadow-sm
      bg-white
      " {...props}
    >
      {children}
    </form>
  )
}
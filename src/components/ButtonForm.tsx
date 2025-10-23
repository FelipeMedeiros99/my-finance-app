import { ButtonHTMLAttributes, FormHTMLAttributes } from "react";

export default function ButtonForm({children, ...props}: ButtonHTMLAttributes<HTMLButtonElement>){
  return(
    <button type="submit" 
      className="
        w-full 
        bg-lime-600 text-white font-bold 
        rounded-xl 
        py-2
        shadow-md
        focus:outline-none focus:ring focus:ring-lime-900
        mt-4
      " 
      {...props}>
      {children}
    </button>
  )
}
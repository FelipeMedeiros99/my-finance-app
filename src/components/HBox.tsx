import React from "react"

type HBoxProps<T extends React.ElementType> ={
  as?: T;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;


export default function HBox<T extends React.ElementType = "div">({children, as, className, ...props}: HBoxProps<T>){
  const Component = as || "div";
  

  const tailwindClasses = "flex h-full w-full justify-center items-baseline gap-3";

  const finalClassName = `${tailwindClasses} ${className || ""}`;

  return(
    <Component className={finalClassName} {...props}>
      {children}
    </Component>
  )
}
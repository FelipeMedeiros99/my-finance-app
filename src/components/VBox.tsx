import React from "react"

// A tipagem está correta para componentes polimórficos
type VBoxProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className" >;


export default function VBox<T extends React.ElementType = "div">({as, className, children, ...props}: VBoxProps<T>){
  const Component = as || "div";
  const tailwindClasses = "flex flex-col h-full w-full items-center gap-3";
    const finalClassName = `${tailwindClasses} ${className || ""}`;

  return(
    <Component className={finalClassName} {...props}>
      {children}
    </Component>
  )
}
import React from "react"

import styles from "./style.module.css"

type VBoxProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className" >;


export default function VBox<T extends React.ElementType = "div">({as, className, children, ...props}: VBoxProps<T>){
  const Component = as || "div";
  const localClassName = `${styles.vbox} ${className}`
  return(
    <Component className={localClassName} {...props}>
      {children}
    </Component>
  )
}
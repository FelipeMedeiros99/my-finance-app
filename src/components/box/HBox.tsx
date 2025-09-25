import React from "react"

import styles from "./style.module.css"

type HBoxProps<T extends React.ElementType> ={
  as?: T;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;


export default function HBox<T extends React.ElementType = "div">({children, as, className, ...props}: HBoxProps<T>){
  const Component = as || "div";
  const localClassName = `${styles.hbox} ${className}`

  return(
    <Component className={localClassName} {...props}>
      {children}
    </Component>
  )
}











// import React from "react"
// import styles from "./style.module.css"

// type VBoxProps<C extends React.ElementType> = {
//   as?: C;
//   children: React.ReactNode;
//   className?: string;
// } & Omit<React.ComponentPropsWithoutRef<C>, "as" | "children" | "className">;

// export default function VBox<C extends React.ElementType = "div">({
//   children,
//   as,
//   className,
//   ...props
// }: VBoxProps<C>) {
  
//   const Component = as || "div";
//   const combinedClassName = `${styles.vbox} ${className || ''}`;

//   return (
//     <Component className={combinedClassName} {...props}>
//       {children}
//     </Component>
//   );
// }
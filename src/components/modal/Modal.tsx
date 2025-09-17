"use client"

import React, { useEffect, useRef } from "react";
import WhiteContainer from "../white-container/WhiteContainer";

import styles from "./style.module.css";



type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  theme?: "green" | "red" | "neutral"
}

export default function Modal({ children, isOpen, setIsOpen, theme }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)
  
  useEffect(()=>{
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen){
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return (()=>{
      document.removeEventListener("click", handleClickOutside);
    })
  }, [setIsOpen, isOpen])
  
  return (
    <React.Fragment>
      {isOpen &&
        <div className={styles.modal}>
          <div ref={modalRef}>
          <WhiteContainer title="Nova categoria" theme={theme}>
            {children}
          </WhiteContainer>
          </div>
        </div>
      }
    </React.Fragment>
  )

}
"use client"

import React, { useEffect, useRef } from "react";
import WhiteContainer from "./WhiteContainer";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  theme?: "green" | "red" | "neutral"
}

export default function Modal({ children, isOpen, setIsOpen, theme }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return (() => {
      document.removeEventListener("click", handleClickOutside);
    })
  }, [setIsOpen, isOpen])

  return (
    <React.Fragment>
      {isOpen && (
        <div className="fixed inset-0 w-full h-screen bg-black/40 flex justify-center items-center z-10">

          <div
            ref={modalRef}
            className="max-w-md w-full mx-4"
          >
            <WhiteContainer title="Nova categoria" theme={theme}>
              {children}
            </WhiteContainer>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
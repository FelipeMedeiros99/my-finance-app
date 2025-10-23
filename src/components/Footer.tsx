
'use client'

import { FaPlus, FaTimes } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { FiMinus, FiPlus } from "react-icons/fi";
import { CiCreditCard1 } from "react-icons/ci";
import { BiTransfer } from "react-icons/bi";

const ICON_COLORS = {
  plus: 'text-green-500 border-green-500',
  minus: 'text-red-500 border-red-500',
  card: 'text-yellow-500 border-yellow-500',
  transfer: 'text-blue-500 border-blue-500',
};

const iconsStyleDefault = "text-3xl p-1 border rounded-full"
export const options = [
  { title: "Receita", url: "/incomes/new", icon: <FiPlus className={`${iconsStyleDefault} ${ICON_COLORS.plus}`} />},
  { title: "Despesa", url: "/expenses/new", icon: <FiMinus className={`${iconsStyleDefault} ${ICON_COLORS.minus}`} />},
  { title: "Despesa de Cartão", url: "/cards/new-expense", icon: <CiCreditCard1 className={`${iconsStyleDefault} ${ICON_COLORS.card}`} />},
  { title: "Transferência", url: "/transfers/new", icon: <BiTransfer className={`${iconsStyleDefault} ${ICON_COLORS.transfer}`} />},
];

export default function Footer() {
  const pathname = usePathname();
  const [isOptionsVisible, setIsOptionVisible] = useState(false);
  const ulRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    setIsOptionVisible(false);
  }, [pathname]);

  useEffect(() => {
    const closeLinks = (e: MouseEvent) => {
      if (isOptionsVisible && ulRef.current !== null) {
        if (!ulRef?.current.contains(e.target as Node)) {
          setIsOptionVisible(false);
        }
      }
    };
    document.addEventListener("click", closeLinks);
    return () => {
      document.removeEventListener("click", closeLinks);
    };
  }, [isOptionsVisible]);

  return (
    <footer>
      {isOptionsVisible &&
        <nav 
          className="absolute bottom-20 right-4 w-max"
        >
          <ul ref={ulRef} className="flex flex-col list-none m-0 p-2 bg-white rounded-lg shadow-xl overflow-hidden">
            {options.map((option) => (
              <Link 
                className="flex items-center gap-2 p-3 text-base text-gray-900 cursor-pointer transition-colors duration-200 hover:bg-gray-100" 
                href={option.url} 
                key={option.title} 
                onClick={() => setIsOptionVisible(false)}
              >
                {option.icon}
                <span>{option.title}</span>
              </Link>
            ))}
          </ul>
        </nav>
      }
      
      <button 
        onClick={() => setIsOptionVisible(!isOptionsVisible)} 
        className={`
          flex items-center justify-center 
          fixed
          bottom-4
          right-4
          z-2
          w-16 h-16 
          bg-green-500 text-white 
          rounded-full shadow-lg 
          text-3xl cursor-pointer 
          transition duration-300 ease-in-out
          hover:bg-green-600 hover:shadow-xl
        `}
        aria-label={isOptionsVisible ? 'Fechar menu de ações' : 'Abrir menu de ações'}
      >
        {isOptionsVisible ? <FaTimes /> : <FaPlus />}
      </button>
    </footer>
  );
}
"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineMenu } from "react-icons/ai";

export const routesSettings = [
  { label: "Resumos", route: "/home" },
  { label: "Entradas", route: "/incomes" },
  { label: "Saídas", route: "/expenses" },
  { label: "Transferências", route: "/transfers" },
  { label: "Cartões", route: "/cards" },
  { label: "Contas", route: "/accounts" },
  { label: "Categorias", route: "/category" }
]

const TAILWIND_COLORS = {
  'primary': 'bg-green-600',
  'primary-text': 'text-white',
  'gray-900': 'text-gray-900',
  'gray-100': 'text-gray-100',
  'analogous-1': 'bg-green-100',
};

export default function Header() {
  const [isLinksVisible, setIsLinksVisible] = useState(false)
  const path = usePathname()
  const ulRef = useRef<HTMLUListElement | null>(null)
  const route = useRouter()

  useEffect(() => {
    const closeLinks = (e: MouseEvent) => {
      if (isLinksVisible && ulRef.current !== null) {
        if (!ulRef?.current.contains(e.target as Node)) {
          setIsLinksVisible(false)
        }
      }
    }
    document.addEventListener("click", closeLinks)
    return () => {
      document.removeEventListener("click", closeLinks)
    }
  }, [isLinksVisible])

  const exit = () => {
    localStorage.removeItem("token");
    route.push("/");
  }

  return (
    <header className={`
      fixed top-0 left-0 w-full h-auto py-4 px-6 z-10
      flex items-center justify-end 
      border-b border-gray-300 shadow-md 
      ${TAILWIND_COLORS.primary}
    `}>
      
      <button onClick={() => setIsLinksVisible(!isLinksVisible)} className="focus:outline-none">
        <AiOutlineMenu className="text-3xl text-white cursor-pointer" />
      </button>

      <nav className={`
        fixed top-0 right-0 w-64 h-screen 
        flex flex-col 
        bg-white shadow-2xl z-30
        transform transition-all duration-500 ease-in-out

        ${!isLinksVisible ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}
      `}>
      
        <div className="flex flex-col items-center justify-center h-32 w-full border-b border-gray-200 bg-white text-gray-900 shrink-0">
          <div className="relative w-12 h-12 mb-2">
            <Image src="/images/logo.png" alt="logo" fill className="object-contain" />
          </div>
          <h2 className="text-xl font-semibold">Finanças</h2>
        </div>
        <ul ref={ulRef} className="flex flex-col overflow-y-auto grow z-30">
          {routesSettings.map((routerSetting) => (
            <Link
              onClick={() => setIsLinksVisible(false)}
              className={`
                px-6 py-4 text-base text-gray-900 cursor-pointer transition-colors duration-200
                ${routerSetting.route === path ? 'bg-green-600 font-bold text-white' : 'hover:bg-gray-100'}
              `}
              href={routerSetting.route}
              key={routerSetting.route}>
                {routerSetting.label}
            </Link>
          ))}
        </ul>
        <div className="w-full h-20 border-t border-gray-200 shrink-0">
          <button 
            onClick={exit}
            className="w-full h-full flex items-center justify-start px-6 text-base font-bold text-gray-900 bg-white hover:bg-gray-100 transition-colors"
          >
            Sair
          </button>
        </div>

      </nav>
    </header>
  )

}
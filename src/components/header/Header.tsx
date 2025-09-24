"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineMenu } from "react-icons/ai";
// import { IoIosLogOut } from "react-icons/io";

import { routesSettings } from "./const";

import styles from "./style.module.css"


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
    <header className={styles.header}>

      <AiOutlineMenu className={styles.iconOpen} onClick={() => setIsLinksVisible(!isLinksVisible)} />

      <nav className={`${styles.nav} ${!isLinksVisible ? styles.hiddem : ""}`}>

        <div className={styles.headerNav}>
          <div className={styles.containerLogo}>
            <Image src="/images/logo.png" alt="logo" fill></Image>
          </div>
          <h2>Finanças</h2>
        </div>

        <ul ref={ulRef} className={styles.ul}>
          {routesSettings.map((routerSetting) => (
            <Link
              onClick={() => setIsLinksVisible(false)}
              className={routerSetting.route === path ? `${styles.link} ${styles.linkActive}` : `${styles.link}`}
              href={routerSetting.route}
              key={routerSetting.route}>{routerSetting.label}
            </Link>
          ))}
        </ul>

        <div className={styles.footer}>
          <button onClick={exit}>
            Sair
            {/* <IoIosLogOut/> */}
            </button>
        </div>

      </nav>
    </header>
  )
}
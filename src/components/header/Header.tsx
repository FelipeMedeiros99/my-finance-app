"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AiOutlineMenu } from "react-icons/ai";

import { routesSettings } from "./const";

import styles from "./style.module.css"

export default function Header() {
  const [isLinksVisible, setIsLinksVisible] = useState(false)
  const path = usePathname()
  const ulRef = useRef<HTMLUListElement | null>(null)

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


  return (
    <header className={styles.header}>
      <AiOutlineMenu className={styles.icon} onClick={() => setIsLinksVisible(!isLinksVisible)} />

      {isLinksVisible &&
        <nav className={styles.nav}>
          <ul ref={ulRef} className={styles.ul}>
            {routesSettings.map((routerSetting) => (
              <Link 
                onClick={()=>setIsLinksVisible(false)}
                className={routerSetting.route===path ? `${styles.link} ${styles.linkActive}` : `${styles.link}`} 
                href={routerSetting.route} 
                key={routerSetting.route}>{routerSetting.label}
              </Link>
            ))}
          </ul>
        </nav>
      }
    </header>
  )
}
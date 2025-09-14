"use client"

import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { options } from "./const";

import styles from "./style.module.css"

export default function Footer() {
  const [isOptionsVisible, setIsOptionVisible] = useState(false);

    const ulRef = useRef<HTMLUListElement | null>(null)
  
    useEffect(() => {
      const closeLinks = (e: MouseEvent) => {
        if (isOptionsVisible && ulRef.current !== null) {
          if (!ulRef?.current.contains(e.target as Node)) {
            setIsOptionVisible(false)
          }
        }
      }
      document.addEventListener("click", closeLinks)
      return () => {
        document.removeEventListener("click", closeLinks)
      }
    }, [isOptionsVisible])

  return (
    <footer className={styles.footer}>
      {isOptionsVisible &&
        <nav className={styles.nav}>
          <ul className={styles.ul} ref={ulRef} onClick={()=>setIsOptionVisible(false)}>
            {options.map((option) => (
              <Link className={styles.link} href={option.url} key={option.title}>{option.icon}{option.title}</Link>
            ))}
          </ul>
        </nav>
      }
      <button onClick={() => setIsOptionVisible(!isOptionsVisible)} className={styles.button}>
        <FaPlus/>
      </button>
    </footer>
  )
}
"use client"

import { FaPlus } from "react-icons/fa6";

import styles from "./style.module.css"
import { useState } from "react";

export default function Footer() {

  return (
    <footer className={styles.footer}>
      <button className={styles.button}>
        <FaPlus className={styles.icon} />
      </button>
    </footer>
  )
}
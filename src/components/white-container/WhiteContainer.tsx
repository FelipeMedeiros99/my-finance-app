"use client"

import React from "react";

import styles from "./style.module.css";

type Props = {
  children?: React.ReactNode;
  title: string;
  theme?: "green" | "red" | "neutral"
}

export default function WhiteContainer({children, theme="neutral", title}: Props){
  return(
    <div className={`${styles.container} ${styles[theme]}`}>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </div>
  )
}
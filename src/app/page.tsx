"use client"

import { useEffect } from "react";
import { ClipLoader } from "react-spinners";

import styles from "./style.module.css"
import { useRouter } from "next/navigation";


export default function Start() {
  const route = useRouter()
  useEffect(() => {
    route.push("/login");
  }, [route])

  return (
    <div className={styles.spinnerContainer}>
      <ClipLoader size="100" color="#16A34A" />
    </div>
  );
}

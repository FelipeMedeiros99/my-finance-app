"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"

import styles from "./style.module.css"


export default function Guard({children}: {children: React.ReactNode}){
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const route = useRouter()
  useEffect(()=>{
    if(!localStorage.getItem("token")){
      route.push("/")
    }else{
      setIsAuthenticated(true)
    }
  },[])


  
  return(
    <>
    {!isAuthenticated && 
    <div className={styles.containerLoader}>
      <ClipLoader size={100} color="var(--theme-color)"/>
    </div>
    }
    {isAuthenticated && children}
    </>
  )
}
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"

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
    <div className="fixed top-1/2 left-1/2 transform -translate-1/2">
      <ClipLoader size={100} color="var(--theme-color)"/>
    </div>
    }
    {isAuthenticated && children}
    </>
  )
}
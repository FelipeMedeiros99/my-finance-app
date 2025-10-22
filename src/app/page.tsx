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
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600">
      <ClipLoader size={100} color="#16A34A" />
    </div>
  );
}

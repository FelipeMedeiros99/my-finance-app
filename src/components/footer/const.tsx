import { CiCreditCard1 } from "react-icons/ci";
import { FiPlus, FiMinus } from "react-icons/fi";
import { BiTransfer } from "react-icons/bi";

import styles from "./style.module.css"

export const options = [
  { title: "Receita", url: "/incomes/new", icon: <FiPlus className={`${styles.icon} ${styles.plus} `}/>},
  { title: "Despesa", url: "/expenses/new", icon: <FiMinus className={`${styles.icon} ${styles.minus} `}/>},
  { title: "Despesa de Cartão", url: "/cards/new", icon: <CiCreditCard1 className={`${styles.icon} ${styles.card} `}/>},
  { title: "Transferência", url: "/trasnfers/new", icon: <BiTransfer className={`${styles.icon} ${styles.transfer} `}/>},
]
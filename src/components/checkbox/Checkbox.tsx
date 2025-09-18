import { InputHTMLAttributes } from "react";

import Input from "../input/Input";

import styles from "./style.module.css"

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
}

export default function Checkbox({label, ...props}: Props) {
  return (
    <div className={styles.checkboxContainer}>
      <Input type="checkbox" id="checkbox" {...props} />
      <label htmlFor="checkbox">{label}</label>
    </div>
  )
}
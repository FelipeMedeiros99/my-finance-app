import { InputHTMLAttributes } from "react";

import Input from "./Input";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
}

export default function Checkbox({label, ...props}: Props) {
  return (
    <div className="flex items-center gap-2">
      <Input type="checkbox" id="checkbox" {...props} />
      <label htmlFor="checkbox">{label}</label>
    </div>
  )
}
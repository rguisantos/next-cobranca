'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { FormEvent } from "react";

interface CheckboxCustomProps{
  id:string;
  checked:boolean;
  name:string;
  text:string;
  onChange: (e: FormEvent) => void;
}

export const CheckboxCustom : React.FC<CheckboxCustomProps> = ({
  id, checked, name, text, onChange
  }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox name={name} id={id} checked={checked} onChange={(e) => onChange(e)} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {text}
      </label>
    </div>
  )
}

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import InputError from "./input-error"

type InputVariants = React.ComponentProps<typeof Input>
type TextareaVariants = React.ComponentProps<typeof Textarea>

interface BaseProps {
  id: string
  label: string
  error?: string
}

type FormFieldProps =
  | (BaseProps & { inputType: "input"; inputProps?: InputVariants })
  | (BaseProps & { inputType: "textarea"; inputProps?: TextareaVariants })
  | (BaseProps & { inputType: "custom"; children: React.ReactNode })

export default function FormField(props: FormFieldProps) {
  const { id, label, error } = props

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>

      {props.inputType === "input" && (
        <Input id={id} {...props.inputProps} />
      )}

      {props.inputType === "textarea" && (
        <Textarea id={id} {...props.inputProps} />
      )}

      {props.inputType === "custom" && props.children}

      <InputError message={error} />
    </div>
  )
}

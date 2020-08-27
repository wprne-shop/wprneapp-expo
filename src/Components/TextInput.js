import React from "react"
import { TextInput as Input } from "react-native"
import { useForm } from "../Hook"

export const TextInput = ({ style, name, ...props }) => {
  const form = useForm()
  const handleChange = (value) => {
    if (form?.handleChange) {
      form.handleChange(name, value)
    }
  }
  return (
    <Input
      style={style}
      onChangeText={handleChange}
      value={form?.values?.[name] ?? ""}
      {...props}
    />
  )
}

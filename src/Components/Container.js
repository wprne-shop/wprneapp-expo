import React from "react"
import { View, TouchableWithoutFeedback } from "react-native"
import { useAction } from "../Hook"

export const Container = ({
  children,
  onPressAction,
  navigateTo,
  ...props
}) => {
  const handleAction = useAction({ navigateTo })

  const { style, ...restProps } = props

  const handleOnPress = () => {
    if (Array.isArray(onPressAction) && onPressAction.length) {
      onPressAction.forEach((action) => {
        handleAction(action)
      })
    }
  }

  if (Array.isArray(onPressAction) && onPressAction.length) {
    return (
      <TouchableWithoutFeedback onPress={handleOnPress}>
        <View style={style} {...restProps}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  return (
    <View style={style} {...restProps}>
      {children}
    </View>
  )
}

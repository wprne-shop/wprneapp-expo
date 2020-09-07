import React from "react"
import { Button as ButtonUi } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"
import { useAction } from "../Hook"
import { getSeparatedStyle } from "../Utility"

export const Button = ({ onPressAction, navigateTo, ...props }) => {
  const handleAction = useAction({ navigateTo })

  const {
    style: { fontSize, color, ...restStyle },
    icon,
    ...restProps
  } = props

  let fontStyle = { fontSize }

  if (color) {
    fontStyle["color"] = color
  }

  const handleOnPress = () => {
    if (Array.isArray(onPressAction) && onPressAction.length) {
      onPressAction.forEach((action) => {
        handleAction(action)
      })
    }
  }

  const { componentStyle, containerStyle } = getSeparatedStyle(restStyle)

  return (
    <ButtonUi
      onPress={handleOnPress}
      buttonStyle={{ ...componentStyle }}
      containerStyle={containerStyle}
      icon={{ ...icon, type: icon.provider }}
      titleStyle={fontStyle}
      {...restProps}
    />
  )
}

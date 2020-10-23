import React from "react"
import { View, ScrollView, TouchableWithoutFeedback } from "react-native"
import { useAction, usePostContent } from "../Hook"

export const Container = ({
  children,
  onPressAction,
  navigateTo,
  ...props
}) => {
  const handleAction = useAction({ navigateTo })
  const dynamicBackgroundColor = usePostContent(
    props.style?.dynamicBackgroundColor
  )

  const { style, ...restProps } = props
  const custStyle = { ...style }
  if (dynamicBackgroundColor) {
    custStyle.backgroundColor = dynamicBackgroundColor
  }
  delete custStyle.dynamicBackgroundColor

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
        <View style={custStyle} {...restProps}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const isHorizontal = style?.flexDirection === "row"
  if (props.scrollable) {
    return (
      <View style={custStyle} {...restProps}>
        <ScrollView horizontal={isHorizontal}>{children}</ScrollView>
      </View>
    )
  }

  return (
    <View style={custStyle} {...restProps}>
      {children}
    </View>
  )
}

import React from "react"
import { View, TouchableWithoutFeedback } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useAction, useProduct, usePost } from "../Hook"

export const Container = ({
  children,
  onPressAction,
  navigateTo,
  ...props
}) => {
  const navigation = useNavigation()
  const globalAction = useAction()
  const { product } = useProduct()
  const { post } = usePost()

  const { style, ...restProps } = props

  const handleOnPress = () => {
    if (Array.isArray(onPressAction) && onPressAction.length) {
      onPressAction.forEach((action) => {
        switch (action) {
          case "navigate":
            navigation.push(navigateTo || "page-0")
            break

          case "selectProduct":
            globalAction("selectProduct", product)
            break

          case "selectPost":
            globalAction("selectPost", post)
            break

          default:
            break
        }
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

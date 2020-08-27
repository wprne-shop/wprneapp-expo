import React from "react"
import { Button as ButtonUi } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"
import { TouchableWithoutFeedback } from "react-native"
import {
  useAction,
  useProduct,
  usePost,
  useCart,
  useCartItem,
  useSingleProduct,
  useSinglePost,
  useForm
} from "../Hook"
import { getSeparatedStyle } from "../Utility"

export const Button = ({ onPressAction, navigateTo, ...props }) => {
  const navigation = useNavigation()
  const globalAction = useAction()
  const form = useForm()
  const { product } = useProduct()
  const { post } = usePost()
  const { addCart, addQty, reduceQty } = useCart()
  const cartItem = useCartItem()
  const { product: singleProduct, setProduct } = useSingleProduct()
  const { setPost } = useSinglePost()

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
        switch (action) {
          case "navigate":
            navigation.push(navigateTo || "page-0")
            break

          case "selectProduct":
            if (globalAction) globalAction("selectProduct", product)
            else setProduct(product)
            break

          case "selectPost":
            if (globalAction) globalAction("selectPost", post)
            else setPost(post)
            break

          case "addToCart":
            if (globalAction)
              globalAction("addToCart", { product: singleProduct, qty: 1 })
            else addCart(singleProduct, 1)
            break

          case "addQty":
            addQty(cartItem?.product?.id)
            break

          case "reduceQty":
            reduceQty(cartItem?.product?.id)
            break

          case "submit":
            if (form) form.handleSubmit()
            break

          default:
            break
        }
      })
    }
  }

  const { componentStyle, containerStyle } = getSeparatedStyle(restStyle)

  return (
    <ButtonUi
      onPress={handleOnPress}
      buttonStyle={{ ...componentStyle, flex: 1 }}
      containerStyle={containerStyle}
      icon={{ ...icon, type: icon.provider }}
      titleStyle={fontStyle}
      TouchableComponent={TouchableWithoutFeedback}
      {...restProps}
    />
  )
}

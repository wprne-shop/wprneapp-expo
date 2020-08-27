import React from "react"
import { View } from "react-native"
import { useCart } from "../Hook"
export const WooCheckout = ({ children, ...props }) => {
  const { cart } = useCart()

  let url = "http://localhost/wordpress/checkout/?add-to-cart="
  Object.keys(cart).forEach((id, index) => {
    if (index === Object.keys(cart).length - 1) {
      url += id
    } else {
      url += id + ","
    }
  })

  return (
    <View style={{ flex: 1 }}>
      <iframe title="Checkout" src={url} height="100%" width="100%" />
    </View>
  )
}

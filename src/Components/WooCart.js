import React from "react"
import { View, Text } from "react-native"
import { useCart, IndexProvider, CartProductRoot } from "../Hook"

export const CartItem = ({ children }) => {
  const { cart } = useCart()

  return Object.keys(cart)?.length ? (
    Object.keys(cart)?.map((id) => (
      <IndexProvider key={id} value={id}>
        {children}
      </IndexProvider>
    ))
  ) : (
    <Text>Cart is empty</Text>
  )
}

export const WooCart = ({ children, ...props }) => {
  return (
    <View style={{ flex: 1 }}>
      <CartProductRoot>{children}</CartProductRoot>
    </View>
  )
}

import React from "react"
import { View, Text } from "react-native"
import { useCart, IndexProvider, CartRoot } from "../Hook"

export const CartItem = ({ children }) => {
  const {
    cart: { items }
  } = useCart()

  return items.length > 0 ? (
    items.map((item, index) => (
      <IndexProvider key={item.id} value={index}>
        {children}
      </IndexProvider>
    ))
  ) : (
    <Text>Cart is empty</Text>
  )
}

export const Cart = ({ children, postType, priceField, ...props }) => {
  return (
    <View style={{ flex: 1 }}>
      <CartRoot postType={postType} priceField={priceField}>
        {children}
      </CartRoot>
    </View>
  )
}

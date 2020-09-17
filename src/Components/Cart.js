import React from "react"
import { View, Text } from "react-native"
import { useCart, ItemProvider, CartRoot } from "../Hook"

export const CartItem = ({ children }) => {
  const { cartItems } = useCart()

  return cartItems.length > 0 ? (
    cartItems.map((item) => (
      <ItemProvider value={item} key={item?.id}>
        {children}
      </ItemProvider>
    ))
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Cart is empty</Text>
    </View>
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

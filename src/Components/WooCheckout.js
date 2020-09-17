import React from "react"
import { View } from "react-native"
import { WebView } from "react-native-webview"
import { useCart } from "../Hook"
import { config } from "../../config"

export const WooCheckout = ({ children, ...props }) => {
  const {
    cart: { items }
  } = useCart()

  let url = config.baseUrl + "checkout/?add-to-cart="
  items.forEach((item, index) => {
    if (index === items?.length - 1) {
      url += item?.id
    } else {
      url += item?.id + ","
    }
  })
  url += "&qty="
  items.forEach((item, index) => {
    if (index === items?.length - 1) {
      url += item?.qty
    } else {
      url += item?.qty + ","
    }
  })

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <WebView source={{ uri: url }} scalesPageToFit={false} />
    </View>
  )
}

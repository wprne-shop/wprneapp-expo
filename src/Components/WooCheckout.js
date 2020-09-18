import React from "react"
import { View } from "react-native"
import { WebView } from "react-native-webview"
import { useCart } from "../Hook"
import { config } from "../../config"
import { useAsyncStorage } from "@react-native-community/async-storage"

export const WooCheckout = ({ children, ...props }) => {
  const {
    cart: { items },
    resetCart
  } = useCart()

  const { getItem, setItem } = useAsyncStorage("userOrders")
  const [orders, setOrders] = React.useState([])

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

  const readItemFromStorage = React.useCallback(async () => {
    const item = await getItem()
    const items = JSON.parse(item)
    setOrders(items || [])
  }, [])

  const writeItemToStorage = async (newValue) => {
    await setItem(JSON.stringify(newValue))
    setOrders(newValue)
  }

  React.useEffect(() => {
    readItemFromStorage()
  }, [readItemFromStorage])

  const handleMessage = (event) => {
    const order_id = event.nativeEvent.data
    if (orders.indexOf(order_id) === -1) {
      console.log("order id", order_id)
      writeItemToStorage([...orders, order_id])
      //resetCart()
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <WebView
        source={{ uri: url }}
        scalesPageToFit={false}
        onMessage={handleMessage}
      />
    </View>
  )
}

import React from "react"
import { useSingleProduct } from "../Woocommerce"
import { useSinglePost } from "../Wordpress"
import { useCart } from "../Cart"
import { useForm } from "../Form"
import { useItem } from "../PostContent"
import { useNavigation } from "@react-navigation/native"

const ActionContext = React.createContext()

function ActionProvider({ value, children }) {
  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  )
}

function useAction({ navigateTo = "" }) {
  const context = React.useContext(ActionContext)
  const navigation = useNavigation()
  const form = useForm()
  const item = useItem()
  const { addCart, addQty, reduceQty } = useCart()
  const { setProduct } = useSingleProduct()
  const { setPost } = useSinglePost()

  const handleAction = (action) => {
    switch (action) {
      case "navigate":
        if (context) {
          navigation.push(navigateTo || "page-0", { item })
        } else {
          navigation.push(navigateTo || "page-0")
        }
        break

      case "goBack":
        navigation.goBack()
        break

      case "selectProduct":
        if (context) context("selectProduct", item)
        else setProduct(item)
        break

      case "selectPost":
        if (context) context("selectPost", item)
        else setPost(item)
        break

      case "addToCart":
        if (context) context("addToCart", { ...item, qty: 1 })
        else addCart(item, 1)
        break

      case "addQty":
        addQty(item?.id)
        break

      case "reduceQty":
        reduceQty(item?.id)
        break

      case "submit":
        if (form) form.handleSubmit()
        break

      default:
        break
    }
  }

  return handleAction
}

function useGridPostAction() {
  const { setProduct } = useSingleProduct()
  const { setPost } = useSinglePost()
  const { addCart } = useCart()

  const handleAction = (action, data) => {
    switch (action) {
      case "selectProduct":
        setProduct(data)
        break

      case "selectPost":
        setPost(data)
        break

      case "addToCart":
        addCart(data, data?.qty)
        break

      default:
        break
    }
  }

  return handleAction
}

export { ActionProvider, useAction, useGridPostAction }

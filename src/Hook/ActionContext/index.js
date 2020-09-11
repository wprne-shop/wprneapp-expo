import React from "react"
import { useProduct, useSingleProduct } from "../Woocommerce"
import { usePost, useSinglePost } from "../Wordpress"
import { useCart, useCartItem } from "../Cart"
import { useForm } from "../Form"
import { usePostType, usePostTypeContent } from "../PostTypeContext"
import { useNavigation } from "@react-navigation/native"

const ActionContext = React.createContext()

function ActionProvider({ value, children }) {
  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  )
}

function useAction({ navigateTo }) {
  const context = React.useContext(ActionContext)
  const navigation = useNavigation()
  const form = useForm()
  const { product } = useProduct()
  const { post } = usePost()
  const { addCart, addQty, reduceQty } = useCart()
  const cartItem = useCartItem()
  const { product: singleProduct, setProduct } = useSingleProduct()
  const { post: singlePost, setPost } = useSinglePost()
  const postType = usePostType()
  const postTypeContent = usePostTypeContent()

  const handleAction = (action, data) => {
    switch (action) {
      case "navigate":
        if (context) {
          const item = postType === "product" ? product : post
          navigation.push(navigateTo || "page-0", { item })
        } else {
          navigation.push(navigateTo || "page-0")
        }
        break

      case "goBack":
        navigation.goBack()
        break

      case "selectProduct":
        if (context) context("selectProduct", product)
        else setProduct(product)
        break

      case "selectPost":
        if (context) context("selectPost", post)
        else setPost(post)
        break

      case "addToCart":
        if (postType === "product") {
          const data =
            postTypeContent === "singleProduct" ? singleProduct : product
          if (context) context("addToCart", { ...data, qty: 1 })
          else addCart(data, 1)
        } else {
          const data = postTypeContent === "singlePost" ? singlePost : post
          if (context) context("addToCart", { ...data, qty: 1 })
          else addCart(data, 1)
        }

        break

      case "addQty":
        addQty(cartItem?.id)
        break

      case "reduceQty":
        reduceQty(cartItem?.id)
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

import React from "react"
import { usePostTypeContent } from "../PostTypeContext"
import { useCartTotal } from "../Cart"

const ItemContext = React.createContext()

export function ItemProvider({ value, children }) {
  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>
}

export function useItem() {
  const context = React.useContext(ItemContext)

  if (context === undefined) {
    return {}
  }

  return context
}

export function usePostContent(postContent) {
  const item = useItem()
  const type = usePostTypeContent()
  const cartTotal = useCartTotal()
  if (type === "cartItem" && postContent === "total") {
    return cartTotal
  }
  return item?.[postContent]?.rendered ?? item?.[postContent]
}

export function usePostImage() {
  const type = usePostTypeContent()
  const item = useItem()

  switch (type) {
    case "post":
    case "singlePost":
      return item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url

    case "product":
    case "singleProduct":
      return item?.images?.[0]?.src

    case "cartItem":
    case "order":
      return item?.image

    default:
      return ""
  }
}

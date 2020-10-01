import React from "react"
import { PostTypeProvider } from "../PostTypeContext"
import { useRoute } from "@react-navigation/native"

function useSingleProduct() {
  const { params } = useRoute()
  const product = params?.item
  const images = params?.item.images
  return { product, images }
}

function SingleProductRoot({ children }) {
  return (
    <PostTypeProvider value={["product", "singleProduct"]}>
      {children}
    </PostTypeProvider>
  )
}

export { SingleProductRoot, useSingleProduct }

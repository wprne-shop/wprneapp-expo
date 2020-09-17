import React from "react"
import { atom, useRecoilState, useRecoilValue } from "recoil"
import { PostTypeProvider } from "../PostTypeContext"
import { ItemProvider } from "../PostContent"

const wooSingleProduct = atom({
  key: "wooSingleProduct",
  default: []
})

function useSingleProduct() {
  const [product, setProduct] = useRecoilState(wooSingleProduct)
  const images = product?.images
  return { product, setProduct, images }
}

function SingleProductRoot({ children }) {
  const singleProduct = useRecoilValue(wooSingleProduct)
  return (
    <PostTypeProvider value={["product", "singleProduct"]}>
      <ItemProvider value={singleProduct}>{children}</ItemProvider>
    </PostTypeProvider>
  )
}

export { SingleProductRoot, useSingleProduct }

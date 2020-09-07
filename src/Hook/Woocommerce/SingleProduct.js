import React from "react"
import { atom, useRecoilState } from "recoil"
import { PostTypeProvider } from "../PostTypeContext"

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
  return (
    <PostTypeProvider value={["product", "singleProduct"]}>
      {children}
    </PostTypeProvider>
  )
}

export { SingleProductRoot, useSingleProduct }

import React from "react"
import { atom, useRecoilState, useRecoilValue } from "recoil"
import { PostTypeProvider, useIndex } from "../index"

const wooCart = atom({
  key: "wooCart",
  default: {}
})

function useWooCart() {
  const [cart, setCart] = useRecoilState(wooCart)

  const addCart = (product, qty) => {
    const isAvailable = typeof cart?.[product?.id] !== "undefined"
    if (isAvailable) {
      const newQty = cart?.[product?.id]?.qty + qty
      setCart((cart) => ({ ...cart, [product?.id]: { qty: newQty, product } }))
    } else {
      setCart((cart) => ({ ...cart, [product?.id]: { qty, product } }))
    }
  }

  const addQty = (itemId) => {
    const isAvailable = typeof cart?.[itemId] !== "undefined"
    if (isAvailable) {
      const newQty = cart?.[itemId]?.qty + 1
      const product = cart?.[itemId]?.product
      setCart((cart) => ({ ...cart, [itemId]: { qty: newQty, product } }))
    }
  }

  const reduceQty = (itemId) => {
    const isAvailable = typeof cart?.[itemId] !== "undefined"
    if (isAvailable) {
      const newQty = cart?.[itemId]?.qty >= 1 ? cart?.[itemId]?.qty - 1 : 0
      const product = cart?.[itemId]?.product

      if (newQty) {
        setCart((cart) => ({ ...cart, [itemId]: { qty: newQty, product } }))
      } else {
        const { [itemId]: deleted, ...rest } = cart
        setCart(rest)
      }
    }
  }

  return { cart, addCart, addQty, reduceQty }
}

function useWooCartItem() {
  const cart = useRecoilValue(wooCart)
  const index = useIndex()
  const item = cart?.[index]
    ? { ...cart?.[index], subtotal: 0 }
    : { qty: null, product: null, subtotal: 0 }

  if (item.qty && item.product) {
    item["subtotal"] = item.qty * item.product.price
  }

  return item
}

function useWooCartTotal() {
  const cart = useRecoilValue(wooCart)

  let total = 0
  Object.keys(cart).forEach((id) => {
    total += cart[id]?.qty * cart[id]?.product?.price
  })

  return total
}

function CartProductRoot({ children }) {
  return <PostTypeProvider value="cartItem">{children}</PostTypeProvider>
}

export { CartProductRoot, useWooCart, useWooCartItem, useWooCartTotal }

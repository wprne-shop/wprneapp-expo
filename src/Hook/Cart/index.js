import React from "react"
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { PostTypeProvider, useIndex } from "../index"

const generalCart = atom({
  key: "generalCart",
  default: {
    items: [],
    priceField: ""
  }
})

function useCart() {
  const [cart, setCart] = useRecoilState(generalCart)
  const items = cart.items

  const addCart = (post, qty) => {
    const index = items.findIndex((item) => item.id === post.id)
    if (index !== -1) {
      const newQty = items[index].qty + qty
      let newItems = [...items]
      newItems[index].qty = newQty
      setCart((cart) => ({ ...cart, items: newItems }))
    } else {
      const newItems = [...items, { ...post, qty }]
      setCart((cart) => ({ ...cart, items: newItems }))
    }
  }

  const addQty = (itemId) => {
    const index = items.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      const newQty = items[index].qty + 1
      let newItems = [...items]
      newItems[index].qty = newQty
      setCart((cart) => ({ ...cart, items: newItems }))
    }
  }

  const reduceQty = (itemId) => {
    const index = items.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      const newQty = items[index].qty > 0 ? items[index].qty - 1 : 0

      let newItems = [...items]
      if (newQty) {
        newItems[index].qty = newQty
        setCart((cart) => ({ ...cart, items: newItems }))
      } else {
        newItems.splice(index, 1)
        setCart((cart) => ({ ...cart, items: newItems }))
      }
    }
  }

  return { cart, addCart, addQty, reduceQty }
}

function useCartItem() {
  const cart = useRecoilValue(generalCart)
  const index = useIndex()
  const priceField = cart.priceField
  const item = cart?.items?.[index]
    ? { ...cart.items[index], subtotal: 0 }
    : { qty: null, post: null, subtotal: 0 }

  if (item.qty && item.post) {
    item["subtotal"] = item.qty * item.post[priceField]
  }

  return item
}

function useCartTotal() {
  const { items, priceField } = useRecoilValue(generalCart)

  let total = 0
  items.forEach((item) => {
    total += item?.qty * item?.post?.[priceField]
  })

  return total
}

function CartRoot({ children, postType, priceField }) {
  const setCart = useSetRecoilState(generalCart)
  React.useEffect(() => {
    setCart((cart) => ({ ...cart, priceField }))
  }, [priceField, setCart])
  return (
    <PostTypeProvider value={[postType, "cart"]}>{children}</PostTypeProvider>
  )
}

export { CartRoot, useCart, useCartItem, useCartTotal }

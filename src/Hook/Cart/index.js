import React from "react"
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { PostTypeProvider } from "../PostTypeContext"
import { useIndex } from "../IndexContext"
import { useMedia } from "../Wordpress"

export const generalCart = atom({
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
    const index = items.findIndex((item) => item?.id === post?.id)
    if (items?.length && index !== -1) {
      const newQty = items[index].qty + qty
      let newItems = items.map((item, id) => {
        if (id === index) {
          return { ...item, qty: newQty }
        }
        return item
      })
      newItems[index].qty = newQty
      setCart((cart) => ({ ...cart, items: newItems }))
    } else {
      const newItems = [...items, { ...post, qty }]
      setCart((cart) => ({ ...cart, items: newItems }))
    }
  }

  const addQty = (itemId) => {
    const index = items.findIndex((item) => item?.id === itemId)
    if (items?.length && index !== -1) {
      const newQty = items[index].qty + 1
      let newItems = items.map((item, id) => {
        if (id === index) {
          return { ...item, qty: newQty }
        }
        return item
      })
      setCart((cart) => ({ ...cart, items: newItems }))
    }
  }

  const reduceQty = (itemId) => {
    const index = items.findIndex((item) => item?.id === itemId)
    if (items?.length && index !== -1) {
      const newQty = items[index].qty > 0 ? items[index].qty - 1 : 0

      if (newQty) {
        let newItems = items.map((item, id) => {
          if (id === index) {
            return { ...item, qty: newQty }
          }
          return item
        })
        setCart((cart) => ({ ...cart, items: newItems }))
      } else {
        let newItems = items.filter((item, id) => id !== index)
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
    : { qty: null, subtotal: 0 }
  const postMedia = useMedia(item?.featured_media)

  if (item.qty) {
    item["subtotal"] = item.qty * item[priceField]
  }

  item["image"] = item?.images?.[0]?.src ?? postMedia

  return item
}

function useCartTotal() {
  const { items, priceField } = useRecoilValue(generalCart)

  let total = 0
  items.forEach((item) => {
    total += item?.qty * item?.[priceField]
  })

  return total
}

function CartRoot({ children, postType = "", priceField = "" }) {
  const setCart = useSetRecoilState(generalCart)
  React.useEffect(() => {
    setCart((cart) => ({ ...cart, priceField }))
  }, [priceField, setCart])
  return (
    <PostTypeProvider value={[postType, "cartItem"]}>
      {children}
    </PostTypeProvider>
  )
}

export { CartRoot, useCart, useCartItem, useCartTotal }

import React from "react"
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { PostTypeProvider } from "../PostTypeContext"
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

  const priceField = cart.priceField

  let total = 0
  cart?.items?.forEach((item) => {
    total += item?.qty * item?.[priceField]
  })

  const cartItems = items?.map((item) => {
    return {
      ...item,
      subtotal: item.qty * item[priceField],
      image:
        item?.images?.[0]?.src ??
        item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
      total
    }
  })

  return { cart, cartItems, addCart, addQty, reduceQty }
}

function useCartItem(index) {
  const cart = useRecoilValue(generalCart)
  const priceField = cart.priceField
  const item = cart?.items?.[index]
    ? { ...cart.items[index], subtotal: 0 }
    : { qty: null, subtotal: 0 }
  const postMedia = useMedia(item?.featured_media)

  if (item.qty) {
    item["subtotal"] = item.qty * item[priceField]
  }

  item["image"] = item?.images?.[0]?.src ?? postMedia

  let total = 0
  cart?.items?.forEach((item) => {
    total += item?.qty * item?.[priceField]
  })

  item["total"] = total

  return item
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

export { CartRoot, useCart, useCartItem }

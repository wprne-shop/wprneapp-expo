import React from "react"
import { RecoilRoot } from "recoil"
import useSWR from "swr"
import { PostTypeProvider } from "../PostTypeContext"
import { useSetItems } from "../PostContent"
import { wooapi } from "../../Api"

async function fetchData(json) {
  const param = JSON.parse(json)
  let { postType, ...query } = param

  const response = await wooapi.get(postType + "s", query)
  return response.data
}

function SetItems({ orders, products }) {
  const setItems = useSetItems()

  React.useEffect(() => {
    const items = orders?.map((order) => {
      const line_items = order?.line_items?.map((line_item) => {
        const product_id = line_item?.product_id
        const product = products?.find((product) => product?.id === product_id)
        return { ...line_item, image: product?.images?.[0]?.src }
      })

      const line_item = line_items?.reduce(
        (acc, item) => `${acc} ${item?.name} x ${item?.quantity} \n`,
        ""
      )

      return { ...order, line_items, line_item, image: line_items?.[0]?.image }
    })

    setItems(items)
  }, [orders, setItems, products])

  return null
}

function OrderRoot({ children, onLoading, query = {} }) {
  const json = JSON.stringify({ postType: "order", ...query })
  const { data: orders, isValidating } = useSWR(json, fetchData)
  const { data: products } = useSWR(() => {
    let ids = []
    if (Array.isArray(orders)) {
      orders.forEach((order) => {
        order.line_items.forEach((item) => {
          ids.push(item?.product_id)
        })
      })
    }

    return (
      ids.length &&
      JSON.stringify({
        postType: "product",
        include: ids.join()
      })
    )
  }, fetchData)

  React.useEffect(() => {
    if (typeof onLoading === "function") {
      onLoading(isValidating)
    }
  }, [isValidating, onLoading])

  return (
    <RecoilRoot>
      <SetItems orders={orders} products={products} />
      <PostTypeProvider value="order">{children}</PostTypeProvider>
    </RecoilRoot>
  )
}

export { OrderRoot }

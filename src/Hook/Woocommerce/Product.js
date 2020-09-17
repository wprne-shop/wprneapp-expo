import React from "react"
import useSWR from "swr"
import { PostTypeProvider } from "../PostTypeContext"
import { wooapi } from "../../Api"

async function fetchProduct(query) {
  const response = await wooapi.get("products", query)
  return response
}

async function fetchData(json) {
  const param = JSON.parse(json)
  let { postType, ...query } = param

  let products = []
  if (query?.bestSeller) {
    let response = await wooapi.get("reports/top_sellers", { period: "year" })
    let bestSellerQuery = { ...query }
    if (response?.length) {
      const include = response?.map((item) => item.product_id)
      bestSellerQuery = { ...query, include }
    }
    products = await fetchProduct(bestSellerQuery)
  } else {
    products = await fetchProduct(query)
  }

  return products
}

function ProductRoot({ children, onLoading, onSetData, query = {} }) {
  const json = JSON.stringify({ postType: "product", ...query })
  const { data, isValidating } = useSWR(json, fetchData)

  React.useEffect(() => {
    if (typeof onLoading === "function") {
      onLoading(isValidating)
    }
  }, [isValidating, onLoading])

  React.useEffect(() => {
    onSetData(data)
  }, [data, onSetData])

  return <PostTypeProvider value="product">{children}</PostTypeProvider>
}

export { ProductRoot }

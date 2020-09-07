import React from "react"
import {
  RecoilRoot,
  atom,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState
} from "recoil"
import { PostTypeProvider } from "../PostTypeContext"
import { useIndex } from "../IndexContext"
import { wooapi } from "../../Api"

const wooProducts = atom({
  key: "wooProducts",
  default: []
})

const wooProductsCache = atom({
  key: "wooProductsCache",
  default: []
})

const wooProductsStatus = atom({
  key: "wooProductsStatus",
  default: null
})

const isWooProductsLoading = atom({
  key: "isWooProductsLoading",
  default: true
})

function ProductFetch({ query, cache, onSetCache }) {
  const setProducts = useSetRecoilState(wooProducts)
  const setStatus = useSetRecoilState(wooProductsStatus)
  const setIsLoading = useSetRecoilState(isWooProductsLoading)

  const fetchProduct = React.useCallback(
    (query) => {
      const key = query ? JSON.stringify(query) : "noParam"
      wooapi
        .get("products", query)
        .then((response) => {
          setProducts(response)
          setStatus("ok")
          onSetCache(key, response)
        })
        .catch((error) => {
          setProducts([])
          setStatus("error")
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [setProducts, setStatus, setIsLoading]
  )

  React.useEffect(() => {
    const key = query ? JSON.stringify(query) : "noParam"

    if (cache[key]) {
      setProducts(cache[key])
    } else {
      setIsLoading(true)

      if (query?.bestSeller) {
        wooapi
          .get("reports/top_sellers", { period: "year" })
          .then((response) => {
            let bestSellerQuery = { ...query }
            if (response?.length) {
              const include = response?.map((item) => item.product_id)
              bestSellerQuery = { ...query, include }
            }
            fetchProduct(bestSellerQuery)
          })
          .catch((error) => {
            fetchProduct(query)
          })
          .finally(() => {
            setIsLoading(false)
          })
      } else {
        fetchProduct(query)
      }
    }
  }, [query, fetchProduct, setProducts, setIsLoading])

  return null
}

function ProductRoot({ children, query }) {
  const [cache, setCache] = useRecoilState(wooProductsCache)

  const handleSetCache = (key, data) => {
    setCache((cache) => ({ ...cache, [key]: data }))
  }

  return (
    <RecoilRoot>
      <ProductFetch query={query} cache={cache} onSetCache={handleSetCache} />
      <PostTypeProvider value="product">{children}</PostTypeProvider>
    </RecoilRoot>
  )
}

function useProducts() {
  const products = useRecoilValue(wooProducts)
  const status = useRecoilValue(wooProductsStatus)
  const isLoading = useRecoilValue(isWooProductsLoading)

  return { products, status, isLoading }
}

function useProduct() {
  const products = useRecoilValue(wooProducts)
  const status = useRecoilValue(wooProductsStatus)
  const isLoading = useRecoilValue(isWooProductsLoading)
  const index = useIndex()
  const product = products?.[index]

  return { product, status, isLoading }
}

export { ProductRoot, useProducts, useProduct }

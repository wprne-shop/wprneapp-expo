import React from 'react'
import { RecoilRoot, atom, useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { PostTypeProvider, useIndex } from '../index'
import { wooapi } from '../../Api'

const wooProducts = atom({
  key: 'wooProducts', 
  default: [], 
})

const wooProductsCache = atom({
  key: 'wooProductsCache', 
  default: [], 
})

const wooProductsStatus = atom({
  key: 'wooProductsStatus', 
  default: null, 
})

const isWooProductsLoading = atom({
  key: 'isWooProductsLoading', 
  default: true, 
})

function ProductFetch({query, cache, onSetCache}){  
  const setProducts = useSetRecoilState(wooProducts)
  const setStatus = useSetRecoilState(wooProductsStatus)
  const setIsLoading = useSetRecoilState(isWooProductsLoading)

  React.useEffect(()=>{

    const key = query ? JSON.stringify(query) : 'noParam'
    
    if(cache[key]){
      setProducts(cache[key])
    } else{
      setIsLoading(true)

      wooapi.get("products", query)
        .then((response) => {
          setProducts(response.data)
          setStatus(response.status)
          onSetCache(key, response.data)
        })
        .catch((error) => {
          setProducts([])
          setStatus(error.status)
        })
        .finally(() => {
          setIsLoading(false)
        });
    }
    
  },[query])

  return null

}

function ProductRoot({children, query}) {
  const [cache, setCache] = useRecoilState(wooProductsCache)
  
  const handleSetCache = (key, data) => {
    setCache(cache => ({...cache, [key]:data}))
  }

  return (
    <RecoilRoot>  
      <ProductFetch query={query} cache={cache} onSetCache={handleSetCache}/>    
      <PostTypeProvider value="product">        
        {children}     
      </PostTypeProvider>
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
import React from "react"
import { FlatList, View } from "react-native"
import {
  PostRoot,
  ProductRoot,
  IndexProvider,
  ActionProvider,
  usePosts,
  useProducts,
  useCart,
  useSingleProduct,
  useSinglePost
} from "../Hook"

const FlatListComp = ({ children, style, ...props }) => {
  const { numColumns, ...horizontalProps } = props
  const { showsHorizontalScrollIndicator, ...verticalProps } = props
  const flatListProps = props?.horizontal ? horizontalProps : verticalProps
  const { posts } = usePosts()
  const { products } = useProducts()

  const postData = props.postType === "product" ? products : posts

  return (
    postData &&
    Array.isArray(postData) && (
      <FlatList
        data={postData}
        keyExtractor={(item) => item.id.toString()}
        {...flatListProps}
        renderItem={({ item, index }) => (
          <IndexProvider value={index}>
            <View style={style}>{children}</View>
          </IndexProvider>
        )}
      />
    )
  )
}

export const GridPost = ({ postType, ...props }) => {
  const { setProduct } = useSingleProduct()
  const { setPost } = useSinglePost()
  const { addCart } = useCart()

  const globalAction = (action, data) => {
    switch (action) {
      case "selectProduct":
        setProduct(data)
        break

      case "selectPost":
        setPost(data)
        break

      case "addToCart":
        addCart(data?.product, data?.qty)
        break

      default:
        break
    }
  }

  if (postType === "product") {
    return (
      <ProductRoot query={props.query}>
        <ActionProvider value={globalAction}>
          <FlatListComp {...props} />
        </ActionProvider>
      </ProductRoot>
    )
  }

  return (
    <PostRoot query={props.query} postType={postType}>
      <ActionProvider value={globalAction}>
        <FlatListComp {...props} />
      </ActionProvider>
    </PostRoot>
  )
}

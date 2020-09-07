import React from "react"
import { FlatList, View } from "react-native"
import {
  PostRoot,
  ProductRoot,
  IndexProvider,
  ActionProvider,
  usePosts,
  useProducts,
  useGridPostAction
} from "../Hook"

const FlatListComp = ({ children, style, ...props }) => {
  const { numColumns, ...horizontalProps } = props
  const { showsHorizontalScrollIndicator, ...verticalProps } = props
  const flatListProps = props?.horizontal ? horizontalProps : verticalProps
  const { posts } = usePosts()
  const { products } = useProducts()

  const postData = props.postType === "product" ? products : posts

  return (
    !!postData?.length &&
    Array.isArray(postData) && (
      <View style={style}>
        <FlatList
          data={postData}
          keyExtractor={(item) => item.id.toString()}
          {...flatListProps}
          renderItem={({ item, index }) => (
            <IndexProvider value={index}>{children}</IndexProvider>
          )}
        />
      </View>
    )
  )
}

export const GridPost = ({ postType, ...props }) => {
  const gridPostAction = useGridPostAction()

  if (postType === "product") {
    return (
      <ProductRoot query={props.productQuery}>
        <ActionProvider value={gridPostAction}>
          <FlatListComp postType={postType} {...props} />
        </ActionProvider>
      </ProductRoot>
    )
  }

  return (
    <PostRoot query={props.postQuery} postType={postType}>
      <ActionProvider value={gridPostAction}>
        <FlatListComp postType={postType} {...props} />
      </ActionProvider>
    </PostRoot>
  )
}

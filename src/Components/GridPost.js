import React from "react"
import { FlatList, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import {
  PostRoot,
  ProductRoot,
  OrderRoot,
  ItemProvider,
  useGetOrderData,
  useGetProductData,
  useGetPostData
} from "../Hook"

export const FlatListComp = ({ data, children, style, ...props }) => {
  const { numColumns, ...horizontalProps } = props
  const { showsHorizontalScrollIndicator, ...verticalProps } = props
  const flatListProps = props?.horizontal ? horizontalProps : verticalProps

  return (
    !!data?.length &&
    Array.isArray(data) && (
      <View style={style}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          {...flatListProps}
          renderItem={({ item }) => (
            <ItemProvider value={item}>{children}</ItemProvider>
          )}
        />
      </View>
    )
  )
}

const OrderList = ({ orderQuery, postType, ...props }) => {
  const { data, mutateData } = useGetOrderData()

  useFocusEffect(
    React.useCallback(() => {
      mutateData()
    }, [mutateData])
  )

  return (
    <OrderRoot query={orderQuery}>
      <FlatListComp data={data} postType={postType} {...props} />
    </OrderRoot>
  )
}

const ProductList = ({ productQuery, postType, ...props }) => {
  const { data } = useGetProductData(productQuery)

  return (
    <ProductRoot query={productQuery}>
      <FlatListComp data={data} postType={postType} {...props} />
    </ProductRoot>
  )
}

const PostList = ({ postQuery, postType, ...props }) => {
  const { data } = useGetPostData(postQuery, postType)

  return (
    <PostRoot query={postQuery} postType={postType}>
      <FlatListComp data={data} postType={postType} {...props} />
    </PostRoot>
  )
}

export const GridPost = (props) => {
  const postType = props?.postType

  if (postType === "product") {
    return <ProductList {...props} />
  }

  if (postType === "order") {
    return <OrderList {...props} />
  }

  return <PostList {...props} />
}

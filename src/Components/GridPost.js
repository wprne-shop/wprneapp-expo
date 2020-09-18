import React, { useState } from "react"
import { FlatList, View } from "react-native"
import {
  PostRoot,
  ProductRoot,
  OrderRoot,
  ItemProvider,
  ActionProvider,
  useGridPostAction,
  useGetOrderData
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

const OrderList = (props) => {
  const { items: data } = useGetOrderData()

  return (
    <OrderRoot query={props.orderQuery}>
      <ActionProvider value={props.gridPostAction}>
        <FlatListComp data={data} postType={props.postType} {...props} />
      </ActionProvider>
    </OrderRoot>
  )
}

export const GridPost = ({ postType, ...props }) => {
  const gridPostAction = useGridPostAction()
  const [data, setData] = useState()

  const handleSetData = (data) => {
    setData(data)
  }

  if (postType === "product") {
    return (
      <ProductRoot query={props.productQuery} onSetData={handleSetData}>
        <ActionProvider value={gridPostAction}>
          <FlatListComp data={data} postType={postType} {...props} />
        </ActionProvider>
      </ProductRoot>
    )
  }

  if (postType === "order") {
    return (
      <OrderList
        gridPostAction={gridPostAction}
        postType={postType}
        {...props}
      />
    )
  }

  return (
    <PostRoot
      query={props.postQuery}
      postType={postType}
      onSetData={handleSetData}
    >
      <ActionProvider value={gridPostAction}>
        <FlatListComp data={data} postType={postType} {...props} />
      </ActionProvider>
    </PostRoot>
  )
}

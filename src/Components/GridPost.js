import React, { useState } from "react"
import { FlatList, View } from "react-native"
import {
  PostRoot,
  ProductRoot,
  OrderRoot,
  ItemProvider,
  ActionProvider,
  useGridPostAction
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
      <OrderRoot query={props.orderQuery} onSetData={handleSetData}>
        <ActionProvider value={gridPostAction}>
          <FlatListComp data={data} postType={postType} {...props} />
        </ActionProvider>
      </OrderRoot>
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

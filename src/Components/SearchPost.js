import React from "react"
import { View } from "react-native"
import { SearchBar } from "react-native-elements"
import debounce from "lodash.debounce"
import {
  PostRoot,
  ProductRoot,
  ActionProvider,
  useGridPostAction
} from "../Hook"
import { FlatListComp } from "./GridPost"

export const SearchPostComp = ({
  postType,
  searchQuery,
  onLoading,
  ...props
}) => {
  const gridPostAction = useGridPostAction()
  const [data, setData] = React.useState()

  const handleSetData = (data) => {
    setData(data)
  }

  return postType === "product" ? (
    <ProductRoot
      query={{ ...props.productQuery, search: searchQuery }}
      onLoading={onLoading}
      onSetData={handleSetData}
    >
      <ActionProvider value={gridPostAction}>
        <FlatListComp postType={postType} data={data} {...props} />
      </ActionProvider>
    </ProductRoot>
  ) : (
    <PostRoot
      query={{ ...props.postQuery, search: searchQuery }}
      postType={postType}
      onLoading={onLoading}
      onSetData={handleSetData}
    >
      <ActionProvider value={gridPostAction}>
        <FlatListComp postType={postType} data={data} {...props} />
      </ActionProvider>
    </PostRoot>
  )
}

export const SearchPost = (props) => {
  const [search, setSearch] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const debounceHandleChange = React.useCallback(
    debounce((value) => setSearchQuery(value), 1000),
    []
  )

  const updateSearch = (search) => {
    setSearch(search)
    debounceHandleChange(search)
  }

  const handleShowLoading = (value) => {
    setIsLoading(value)
  }

  return (
    <View>
      <SearchBar
        onChangeText={updateSearch}
        value={search}
        lightTheme
        showLoading={isLoading}
      />
      <SearchPostComp
        searchQuery={searchQuery}
        {...props}
        onLoading={handleShowLoading}
      />
    </View>
  )
}

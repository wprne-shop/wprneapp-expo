import React from "react"
import * as components from "../Components"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView, RefreshControl } from "react-native"
import { useRoute } from "@react-navigation/native"
import { useGetPages } from "../Hook"

const buildChild = (parent, page) => {
  let child = page[parent]?.nodes?.length
    ? page[parent].nodes.map((node) => {
        return buildComponent(node, page)
      })
    : typeof page[parent].linkedNodes === "object" &&
      Object.values(page[parent].linkedNodes)?.length
    ? Object.values(page[parent].linkedNodes).map((node) => {
        return buildComponent(node, page)
      })
    : null

  return child
}

const buildComponent = (parent, page) => {
  let child = buildChild(parent, page)
  let props =
    parent === "ROOT"
      ? { isRoot: true, key: parent, ...page[parent].props }
      : { key: parent, ...page[parent].props }

  return (
    components[page[parent]?.type?.resolvedName] &&
    React.createElement(
      components[page[parent].type.resolvedName],
      props,
      child
    )
  )
}

const Page = ({ navigation, route }) => {
  const pages = useGetPages()
  const { name } = useRoute()
  const index = name.split("-")[1]
  const json = pages?.[index]?.json
  const data = json && JSON.parse(json)

  React.useLayoutEffect(() => {
    const params = route.params
    const title = params?.item?.title?.rendered ?? params?.item?.name
    if (title) {
      navigation.setOptions({ title })
    }
  }, [navigation, route])

  return buildComponent("ROOT", data) || null

  // if (pages?.[index]?.showHeaderBar) {
  //   return (
  //     <ScrollView
  //       contentContainerStyle={{ flexGrow: 1 }}
  //       // refreshControl={
  //       //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  //       // }
  //     >
  //       {buildComponent("ROOT", data) || null}
  //     </ScrollView>
  //   )
  // }

  // return (
  //   <SafeAreaView style={{ flex: 1 }}>
  //     <ScrollView
  //       contentContainerStyle={{ flexGrow: 1 }}
  //       // refreshControl={
  //       //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  //       // }
  //     >
  //       {buildComponent("ROOT", data) || null}
  //     </ScrollView>
  //   </SafeAreaView>
  // )
}

export default Page

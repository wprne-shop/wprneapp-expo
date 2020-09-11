import React from "react"
import * as components from "../Components"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView, RefreshControl } from "react-native"
import { useRoute } from "@react-navigation/native"
import { useGetPages } from "../Hook"

const buildChild = (parent, page) => {
  let child =
    typeof page[parent].nodes !== "undefined"
      ? page[parent].nodes.map((node) => {
          return buildComponent(node, page)
        })
      : typeof page[parent].linkedNodes !== "undefined"
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

  return React.createElement(
    components[page[parent].type.resolvedName],
    props,
    child
  )
}

const Page = () => {
  const pages = useGetPages()
  const { name } = useRoute()
  const index = name.split("-")[1]
  const json = pages?.[index]?.json
  const data = json && JSON.parse(json)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        {buildComponent("ROOT", data) || null}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Page

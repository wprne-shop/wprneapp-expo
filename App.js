import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text as TextNative } from "react-native"
import { Container, Image, Text, GridPost, Button } from "./src/Components"
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { RecoilRoot } from "recoil"
import { config } from "./config"
import { Icon } from "react-native-elements"
import * as components from "./src/Components"

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

const Page = ({ json }) => {
  const data = JSON.parse(json)
  console.log("json data", data)
  return buildComponent("ROOT", data) || null
}

function getOptions(route, pages) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "page-0"
  const index = routeName.split("-")[1]

  const title = pages?.[index].name || ""
  const headerShown = pages?.[index].showHeaderBar

  return { title, headerShown }
}

const Tab = createBottomTabNavigator()

function BottomBar({ pages, navigation, route }) {
  React.useLayoutEffect(() => {
    const options = getOptions(route, pages)
    console.log("options", options)
    navigation.setOptions({ ...options })
  }, [navigation, route, pages])

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const index = route.name.split("-")[1]
          const icon = pages?.[index]?.icon
          const { name, provider, size, activeColor, inactiveColor } = icon
          // You can return any component that you like here!
          return (
            <Icon
              name={name}
              type={provider}
              size={size}
              color={focused ? activeColor : inactiveColor}
            />
          )
        },
        tabBarLabel: ""
      })}
    >
      {Array.isArray(pages) &&
        pages.map(
          (page, id) =>
            page?.addToBottomNav && (
              <Tab.Screen key={id} name={`bottom-${id}`}>
                {(props) => (
                  <Page {...props} json={page.json} title={page.name} />
                )}
              </Tab.Screen>
            )
        )}
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator()

export default function App() {
  const [pages, setPages] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(config.baseUrl + "wp-json/wprne/v1/pages/get_page")
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setPages(data?.pages)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TextNative>Loading....</TextNative>
      </View>
    )
  }

  console.log("pages", pages)

  const firstBottomNav = pages.find((page) => page?.addToBottomNav)

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator>
          {firstBottomNav && (
            <Stack.Screen name="BottomBar">
              {(props) => <BottomBar {...props} pages={pages} />}
            </Stack.Screen>
          )}
          {Array.isArray(pages) &&
            pages.map((page, id) => (
              <Stack.Screen
                key={id}
                name={`page-${id}`}
                options={{
                  title: page.name,
                  headerShown: page.showHeaderBar
                }}
              >
                {(props) => (
                  <Page {...props} json={page.json} title={page.name} />
                )}
              </Stack.Screen>
            ))}
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
})
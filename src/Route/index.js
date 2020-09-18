/* eslint-disable react/display-name */
import React from "react"
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  StackActions
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createSharedElementStackNavigator } from "react-navigation-shared-element"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Icon } from "react-native-elements"
import { useGetPages } from "../Hook"
import Page from "../Page"

function getOptions(route, pages) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "page-0"
  const index = routeName.split("-")[1]

  const title = pages?.[index].name || ""
  const headerShown = pages?.[index].showHeaderBar

  return { title, headerShown }
}

const Tab = createBottomTabNavigator()

function BottomBar({ navigation, route }) {
  const pages = useGetPages()
  React.useLayoutEffect(() => {
    const options = getOptions(route, pages)
    navigation.setOptions({ ...options })
  }, [navigation, route, pages])

  const bottomNavPages = []
  pages.forEach((page, index) => {
    if (page?.addToBottomNav) {
      bottomNavPages.push({ page, index })
    }
  })

  return (
    <Tab.Navigator
      lazy={false}
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
      {Array.isArray(bottomNavPages) &&
        bottomNavPages.map(({ page, index: id }) => {
          return <Tab.Screen key={id} name={`bottom-${id}`} component={Page} />
        })}
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator()
//const Stack = createSharedElementStackNavigator()

export default function Route() {
  const pages = useGetPages()
  const firstBottomNav = pages?.find((page) => page?.addToBottomNav)
  if (!pages.length) return null
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {firstBottomNav && (
          <Stack.Screen name="BottomBar" component={BottomBar} />
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
              // sharedElements={(route, otherRoute, showing) => {
              //   const { item } = route.params
              //   if (item?.id) {
              //     return [
              //       {
              //         id: `item.${item.id}.image`,
              //         animation: "move",
              //         resize: "clip"
              //       }
              //     ]
              //   }
              //   return undefined
              // }}
              component={Page}
            />
          ))}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

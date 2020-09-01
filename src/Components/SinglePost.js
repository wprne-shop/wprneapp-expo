import React from "react"
import { SinglePostRoot } from "../Hook"
import { View } from "react-native"

export const SinglePost = ({ style, children }) => {
  return (
    <View style={style}>
      <SinglePostRoot>{children}</SinglePostRoot>
    </View>
  )
}

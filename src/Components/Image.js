import React from "react"
import { Image as ImageUi } from "react-native"
import { SharedElement } from "react-navigation-shared-element"
import { usePostImage, usePostItem } from "../Hook"
import { useRoute } from "@react-navigation/native"

export const Image = ({ source, postContent, ...props }) => {
  const image = usePostImage(postContent)
  const postItem = usePostItem()
  const { params } = useRoute()

  source = postContent !== "disable" ? image : source
  source = source?.replace("localhost", "192.168.43.56")
  const { style, children, ...restProps } = props
  const imgSrc = source
    ? { uri: source }
    : require("../../assets/Images/placeholder.png")

  const item = params?.item ?? postItem

  if (item) {
    return (
      <SharedElement id={`item.${item.id}.image`}>
        <ImageUi style={style} source={imgSrc} {...restProps} />
      </SharedElement>
    )
  }

  return <ImageUi style={style} source={imgSrc} {...restProps} />
}

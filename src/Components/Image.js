import React from "react"
import { Image as ImageUi } from "react-native"
import { SharedElement } from "react-navigation-shared-element"
import { usePostImage, useItem } from "../Hook"
import { useRoute } from "@react-navigation/native"
import placeholder from "../../assets/Images/placeholder.png"

export const Image = ({ source, postContent, ...props }) => {
  const postImage = usePostImage()
  const postItem = useItem()
  const { params } = useRoute()

  source = postContent !== "disable" ? postImage : source
  source = source?.replace("localhost", "192.168.43.56")
  const { style, ...restProps } = props
  const imgSrc = source ? { uri: source } : placeholder

  const item = params?.item ?? postItem

  // if (item) {
  //   return (
  //     <SharedElement id={`item.${item.id}.image`} style={{ flex: 1 }}>
  //       <ImageUi style={style} source={imgSrc} {...restProps} />
  //     </SharedElement>
  //   )
  // }

  return <ImageUi style={style} source={imgSrc} {...restProps} />
}

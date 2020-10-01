import React from "react"
import { Image as ImageUi } from "react-native"
import { SharedElement } from "react-navigation-shared-element"
import { usePostImage, useItem } from "../Hook"
import placeholder from "../../assets/Images/placeholder.png"
import { getSeparatedStyle } from "../Utility"

export const Image = ({ source, postContent, ...props }) => {
  const postImage = usePostImage()
  const item = useItem()

  source = postContent !== "disable" ? postImage : source
  source = source?.replace("localhost", "192.168.43.56")
  const { style, ...restProps } = props
  const imgSrc = source ? { uri: source } : placeholder
  const { componentStyle, containerStyle } = getSeparatedStyle(style)

  // if (item) {
  //   return (
  //     <SharedElement id={`item.${item.id}.image`} style={containerStyle}>
  //       <ImageUi style={style} source={imgSrc} {...restProps} />
  //     </SharedElement>
  //   )
  // }

  return <ImageUi style={style} source={imgSrc} {...restProps} />
}

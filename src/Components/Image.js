import React from "react"
import { Image as ImageUi } from "react-native"
import { usePostImage } from "../Hook"

export const Image = ({ source, postContent, ...props }) => {
  const image = usePostImage(postContent)

  source = postContent !== "disable" ? image : source
  source = source?.replace("localhost", "192.168.43.56")
  const { style, children, ...restProps } = props
  const imgSrc = source
    ? { uri: source }
    : require("../../assets/Images/placeholder.png")

  return <ImageUi style={style} source={imgSrc} {...restProps} />
}

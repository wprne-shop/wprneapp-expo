import React from "react"
import { Image as ImageUi } from "react-native"
import { usePostImage } from "../Hook"
import placeholder from "../../assets/Images/placeholder.png"

export const Image = ({ source, postContent, ...props }) => {
  const postImage = usePostImage()

  source = postContent !== "disable" ? postImage : source
  // source = source?.replace("localhost", "192.168.43.56")
  const { style, ...restProps } = props
  const imgSrc = source ? { uri: source } : placeholder

  return <ImageUi style={style} source={imgSrc} {...restProps} />
}

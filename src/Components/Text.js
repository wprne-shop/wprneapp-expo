import React from "react"
import { Text as TextUi } from "react-native"
import { usePostContent } from "../Hook"

export const Text = ({ title, postContent, ...props }) => {
  const content = usePostContent(postContent)
  title = postContent !== "disable" ? content : title
  title = props.charLength
    ? title.length > props.charLength
      ? title.substring(0, props.charLength) + "..."
      : title.substring(0, props.charLength)
    : title

  const { style, ...restProps } = props

  return props.isHtml ? (
    <div dangerouslySetInnerHTML={{ __html: title }} style={style} />
  ) : (
    <TextUi style={style} {...restProps}>
      {title}
    </TextUi>
  )
}

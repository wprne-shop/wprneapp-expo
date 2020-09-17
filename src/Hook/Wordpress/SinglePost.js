import React from "react"
import { atom, useRecoilState, useRecoilValue } from "recoil"
import { PostTypeProvider } from "../PostTypeContext"
import { ItemProvider } from "../PostContent"

const wpSinglePost = atom({
  key: "wpSinglePost",
  default: []
})

function useSinglePost() {
  const [post, setPost] = useRecoilState(wpSinglePost)
  return { post, setPost }
}

function SinglePostRoot({ children, postType }) {
  const singlePost = useRecoilValue(wpSinglePost)
  return (
    <PostTypeProvider value={[postType, "singlePost"]}>
      <ItemProvider value={singlePost}>{children}</ItemProvider>
    </PostTypeProvider>
  )
}

export { SinglePostRoot, useSinglePost }

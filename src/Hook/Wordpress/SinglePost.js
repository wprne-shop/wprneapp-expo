import React from "react"
import { atom, useRecoilState } from "recoil"
import { PostTypeProvider } from "../index"

const wpSinglePost = atom({
  key: "wpSinglePost",
  default: []
})

function useSinglePost() {
  const [post, setPost] = useRecoilState(wpSinglePost)
  return { post, setPost }
}

function SinglePostRoot({ children, postType }) {
  return (
    <PostTypeProvider value={[postType, "singlePost"]}>
      {children}
    </PostTypeProvider>
  )
}

export { SinglePostRoot, useSinglePost }

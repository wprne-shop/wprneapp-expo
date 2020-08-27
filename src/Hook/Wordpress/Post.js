import React from "react"
import {
  RecoilRoot,
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilState
} from "recoil"
import { PostTypeProvider, useIndex } from "../index"
import { wpapi } from "../../Api"
import { config } from "../../../config"

const wpPosts = atom({
  key: "wpPosts",
  default: []
})

const wpPostsCache = atom({
  key: "wpPostsCache",
  default: []
})

const postsStatus = atom({
  key: "postsStatus",
  default: null
})

const isPostsLoading = atom({
  key: "isPostsLoading",
  default: true
})

function PostFetch({ query, postType, cache, onSetCache, onSetPostFields }) {
  const setPosts = useSetRecoilState(wpPosts)
  const setStatus = useSetRecoilState(postsStatus)
  const setIsLoding = useSetRecoilState(isPostsLoading)

  postType = postType === "post" ? "posts" : postType

  React.useEffect(() => {
    const key = query ? JSON.stringify({ postType, ...query }) : "noParam"

    if (cache[key]) {
      setPosts(cache[key])
    } else {
      if (wpapi[postType]) {
        let fetcher = wpapi[postType]()
        query &&
          Object.keys(query).forEach((key) => {
            const value = query[key]
            if (value) {
              fetcher = fetcher?.[key](value)
            }
          })

        setIsLoding(true)

        fetcher
          .then((response) => {
            //get acf custom field value
            if (Array.isArray(response)) {
              const ids = response.map((item) => item?.id)

              fetch(config.baseUrl + "wp-json/wprne/v1/acf/get_fields", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids })
              })
                .then((res) => res.json())
                .then((data) => {
                  const newPosts = response.map((post) => ({
                    ...post,
                    ...data?.fields?.[post.id]
                  }))

                  setPosts(newPosts)
                  setStatus("ok")
                  setIsLoding(false)
                  onSetCache(key, newPosts)
                })
                .catch((error) => {
                  setPosts(response)
                  setStatus("ok")
                  setIsLoding(false)
                })
            }
          })
          .catch((error) => {
            setPosts([])
            setStatus("error")
            setIsLoding(false)
          })
      }
    }
  }, [query, postType, setPosts, setStatus, setIsLoding])

  return null
}

function PostRoot({ children, query, postType = "post" }) {
  const [cache, setCache] = useRecoilState(wpPostsCache)

  const handleSetCache = (key, data) => {
    setCache((cache) => ({ ...cache, [key]: data }))
  }

  return (
    <RecoilRoot>
      <PostFetch
        query={query}
        postType={postType}
        cache={cache}
        onSetCache={handleSetCache}
      />
      <PostTypeProvider value={postType}>{children}</PostTypeProvider>
    </RecoilRoot>
  )
}

function usePosts() {
  const posts = useRecoilValue(wpPosts)
  const status = useRecoilValue(postsStatus)
  const isLoading = useRecoilValue(isPostsLoading)

  return { posts, status, isLoading }
}

function usePost() {
  const posts = useRecoilValue(wpPosts)
  const status = useRecoilValue(postsStatus)
  const isLoading = useRecoilValue(isPostsLoading)
  const index = useIndex()
  const post = posts?.[index]

  return { post, status, isLoading }
}

export { PostRoot, usePosts, usePost }

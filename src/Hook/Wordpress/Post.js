import React from "react"
import useSWR from "swr"
import { PostTypeProvider } from "../PostTypeContext"
import { wpapi } from "../../Api"
import { config } from "../../../config"

async function fetchPost(json) {
  const param = JSON.parse(json)
  let { postType, ...query } = param

  if (!postType) return []

  postType = postType === "post" ? "posts" : postType
  if (typeof wpapi[postType] === "undefined") {
    wpapi[postType] = wpapi.registerRoute(
      "wp/v2",
      "/" + postType + "/(?P<id>\\d+)",
      {
        params: ["categories", "order", "orderby"]
      }
    )
  }

  let fetcher = wpapi[postType]()
  query &&
    Object.keys(query).forEach((key) => {
      const value = query[key]
      if (fetcher?.[key] && value) {
        fetcher = fetcher?.[key](value)
      }
    })

  fetcher = fetcher.embed()

  const response = await fetcher
  if (Array.isArray(response) && response.length) {
    const ids = response.map((item) => item?.id)

    const result = await fetch(
      config.baseUrl + "wp-json/wprne/v1/acf/get_fields",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
      }
    )
    const data = result.json()
    return response.map((post) => ({
      ...post,
      ...data?.fields?.[post.id]
    }))
  }
  return []
}

function PostRoot({
  children,
  query = {},
  onLoading,
  onSetData,
  postType = "post"
}) {
  const json = JSON.stringify({ postType, ...query })
  const { data, isValidating } = useSWR(json, fetchPost)

  React.useEffect(() => {
    if (typeof onLoading === "function") {
      onLoading(isValidating)
    }
  }, [isValidating, onLoading])

  React.useEffect(() => {
    onSetData(data)
  }, [data, onSetData])

  return <PostTypeProvider value={postType}>{children}</PostTypeProvider>
}

export { PostRoot }

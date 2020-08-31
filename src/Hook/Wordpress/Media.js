import React from "react"
import { atom, useRecoilState, useSetRecoilState } from "recoil"
import { wpapi } from "../../Api"

const wpMedias = atom({
  key: "wpMedias",
  default: []
})

const isWpMediasLoading = atom({
  key: "isWpMediasLoading",
  default: true
})

const wpMediasStatus = atom({
  key: "wpMediasStatus",
  default: null
})

function useMedias() {
  const [medias, setMedias] = useRecoilState(wpMedias)
  const [isLoading, setIsLoading] = useRecoilState(isWpMediasLoading)
  const setStatus = useSetRecoilState(wpMediasStatus)

  React.useEffect(() => {
    if (isLoading) {
      wpapi
        .media()
        .then((response) => {
          setMedias(response)
          setStatus("ok")
          setIsLoading(false)
        })
        .catch((error) => {
          setStatus(error)
          setIsLoading(false)
        })
    }
  }, [isLoading, setMedias, setStatus, setIsLoading])

  return { medias, setMedias }
}

function useMedia(id) {
  const [media, setMedia] = React.useState("")

  React.useEffect(() => {
    if (id) {
      wpapi
        .media()
        .id(id)
        .then((response) => {
          setMedia(response?.source_url)
        })
        .catch((error) => {
          setMedia("")
        })
    }
  }, [setMedia, id])

  return media
}

export { useMedias, useMedia }

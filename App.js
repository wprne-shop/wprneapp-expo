import React, { useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SplashScreen } from "expo"
import { View } from "react-native"
import { config } from "./config"
import Route from "./src/Route"
import { useSetPages, useIsLoadingPages } from "./src/Hook"
import { RecoilRoot } from "recoil"
import { SWRConfig } from "swr"

function Init() {
  const [isLoading, setIsLoading] = useIsLoadingPages()
  const setPages = useSetPages()

  useEffect(() => {
    SplashScreen.preventAutoHide()

    if (isLoading) {
      fetch(config.baseUrl + "wp-admin/admin-ajax.php", {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "action=wprne_get_page"
      })
        .then((res) => {
          return res.json()
        })
        .then((data) => {
          if (data?.pages) {
            setPages(data?.pages)
            setIsLoading(false)
          }
          SplashScreen.hide()
        })
    }
  }, [isLoading, setPages, setIsLoading])

  return null
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <RecoilRoot>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            refreshInterval: 0,
            errorRetryCount: 3
          }}
        >
          <Init />
          <SafeAreaProvider>
            <Route />
          </SafeAreaProvider>
        </SWRConfig>
      </RecoilRoot>
    </View>
  )
}

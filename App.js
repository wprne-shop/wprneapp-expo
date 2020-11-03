import React, { useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SplashScreen } from "expo"
import { View } from "react-native"
import { config } from "./config"
import Route from "./src/Route"
import { RecoilRoot } from "recoil"
import useSWR, { SWRConfig } from "swr"

const fetcher = (key) =>
  fetch(config.baseUrl + "wp-json/wprne/v1/" + key).then((r) => r.json())

function Init() {
  const { data } = useSWR("page/get_pages")
  const isLoading = !!data

  useEffect(() => {
    SplashScreen.preventAutoHide()

    if (!isLoading) {
      SplashScreen.hide()
    }
  }, [isLoading])

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
            errorRetryCount: 3,
            fetcher
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

import React from "react"
import { View, Image } from "react-native"
import { SingleProductRoot, useSingleProduct } from "../Hook"
import { Carousel } from "./Carousel"
import { useRoute } from "@react-navigation/native"

export const WooImageCarousel = (props) => {
  const { images } = useSingleProduct()
  const { params } = useRoute()
  const { carouselWidth, carouselHeight, style, ...restProps } = props

  const item = params?.item

  return (
    <Carousel
      style={{ padding: 0, width: carouselWidth, height: carouselHeight }}
      {...restProps}
    >
      {!!images?.length &&
        images.map(({ src }, index) => {
          if (index === 0 && item) {
            return <Image source={{ uri: src }} style={style} />
          }
          return <Image key={index} source={{ uri: src }} style={style} />
        })}
    </Carousel>
  )
}

export const WooSingleProduct = ({ children, ...props }) => {
  return (
    <View style={{ flex: 1 }}>
      <SingleProductRoot>{children}</SingleProductRoot>
    </View>
  )
}

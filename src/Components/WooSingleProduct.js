import React from "react"
import { View, Image } from "react-native"
import { SingleProductRoot, useSingleProduct } from "../Hook"
import { Carousel } from "./Carousel"

export const WooImageCarousel = (props) => {
  const { images } = useSingleProduct()
  const { carouselWidth, carouselHeight, style, children, ...restProps } = props

  return (
    <Carousel
      style={{ padding: 0, width: carouselWidth, height: carouselHeight }}
      {...restProps}
    >
      {!!images?.length &&
        images.map(({ src }, index) => {
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

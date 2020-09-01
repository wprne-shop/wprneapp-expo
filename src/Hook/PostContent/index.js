import { usePost, useSinglePost, useMedia } from "../Wordpress"
import {
  useProduct,
  useSingleProduct,
  useCartItem,
  useCartTotal,
  usePostTypeContent
} from "../index.js"

export function usePostContent(postContent) {
  const type = usePostTypeContent()
  const { post } = usePost()
  const { post: singlePost } = useSinglePost()
  //const { product } = useProduct()
  //const { product: singleProduct } = useSingleProduct()
  const { qty, subtotal, product: cartProduct } = useCartItem()
  const total = useCartTotal()

  let content = ""
  if (postContent !== "disable") {
    let postTitle = post?.[postContent]?.rendered ?? post?.[postContent]
    let singlePostTitle =
      singlePost?.[postContent]?.rendered ?? singlePost?.[postContent]
    //let productTitle = product?.[postContent]
    //let singleProductTitle = singleProduct?.[postContent]
    let cartItemTitle = { qty, subtotal, total, ...cartProduct }?.[postContent]

    const contents = {
      post: postTitle,
      singlePost: singlePostTitle,
      //product: productTitle,
      //singleProduct: singleProductTitle,
      cartItem: cartItemTitle
    }

    content = contents[type] ?? contents.post
  }

  return content
}

export function usePostImage(postContent) {
  const type = usePostTypeContent()
  const { post } = usePost()
  const { post: singlePost } = useSinglePost()
  const { product } = useProduct()
  const { product: singleProduct } = useSingleProduct()
  const { product: cartProduct } = useCartItem()
  const postMedia = useMedia(post?.featured_media)
  const singlePostMedia = useMedia(singlePost?.featured_media)
  const productImage = product?.images?.[0]?.src
  const singleProductImage = singleProduct?.images?.[0]?.src
  const cartImage = cartProduct?.images?.[0]?.src

  let image = ""
  if (postContent !== "disable") {
    const images = {
      post: postMedia,
      singlePost: singlePostMedia,
      product: productImage,
      singleProduct: singleProductImage,
      cartItem: cartImage
    }

    image = images[type] ?? images.post
  }

  return image
}

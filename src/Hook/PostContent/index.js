import { usePost, useSinglePost, useMedia } from "../Wordpress"
import { useProduct, useSingleProduct } from "../Woocommerce"
import { useCartItem, useCartTotal } from "../Cart"
import { usePostTypeContent } from "../PostTypeContext"

export function usePostContent(postContent) {
  const type = usePostTypeContent()
  const { post } = usePost()
  const { post: singlePost } = useSinglePost()
  const { product } = useProduct()
  const { product: singleProduct } = useSingleProduct()
  let cartItem = useCartItem()
  const total = useCartTotal()

  let content = ""
  if (postContent !== "disable") {
    let postTitle = post?.[postContent]?.rendered ?? post?.[postContent]
    let singlePostTitle =
      singlePost?.[postContent]?.rendered ?? singlePost?.[postContent]
    let productTitle = product?.[postContent]
    let singleProductTitle = singleProduct?.[postContent]
    cartItem = { ...cartItem, total }
    let cartItemTitle =
      cartItem?.[postContent]?.rendered ?? cartItem?.[postContent]

    const contents = {
      post: postTitle,
      singlePost: singlePostTitle,
      product: productTitle,
      singleProduct: singleProductTitle,
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
  const cartItem = useCartItem()
  const postMedia = useMedia(post?.featured_media)
  const singlePostMedia = useMedia(singlePost?.featured_media)
  const productImage = product?.images?.[0]?.src
  const singleProductImage = singleProduct?.images?.[0]?.src
  const cartImage = cartItem?.image

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

export function usePostItem() {
  const type = usePostTypeContent()
  const { post } = usePost()
  const { post: singlePost } = useSinglePost()
  const { product } = useProduct()
  const { product: singleProduct } = useSingleProduct()
  const cartItem = useCartItem()

  const items = {
    post,
    singlePost,
    product,
    singleProduct,
    cartItem
  }

  return items?.[type]
}

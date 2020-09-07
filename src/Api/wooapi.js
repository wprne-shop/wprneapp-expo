import WooCommerceApi from "./WoocommerceApi"
import { config } from "../../config"

export const wooapi = new WooCommerceApi({
  url: config.baseUrl,
  isSsl: true,
  consumerKey: config.ck,
  consumerSecret: config.cs,
  version: "wc/v3",
  queryStringAuth: false
})

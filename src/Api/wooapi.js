import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { config } from "../../config"

export const wooapi = new WooCommerceRestApi({
  url: config.baseUrl,
  consumerKey: config.ck,
  consumerSecret: config.cs,
  version: "wc/v3"
})

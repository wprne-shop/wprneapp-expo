import WooCommerceRestApi from "./WoocommerceApi"
//import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { config } from "../../config"

const wooapiConfig = {
  url: config.baseUrl,
  isSsl: false,
  consumerKey: config.ck,
  consumerSecret: config.cs,
  version: "wc/v3",
  queryStringAuth: true
}

export const wooapi = new WooCommerceRestApi(wooapiConfig)

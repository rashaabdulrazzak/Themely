import { type EmptyData } from "../modules/app.modules";
import storeImage from "../assets/log.png";
import itemImage from "../assets/log.png";

export const emptyData: EmptyData = {
  products: {
    image: storeImage,
    message: "No products found.",
  },
  search: {
    image: storeImage,
    message: "No search found.",
  },
  filter: {
    image: storeImage,
    message: "Filter result not found.",
  },
  importlist: {
    image: itemImage,
    message: "Yor Import list is empty.",
  },

  showcart: {
    image: itemImage,
    message: "Your cart is empty.",
  },
  connect_store: {
    image: storeImage,
    message: "No connected store found.",
  },
  plans: {
    image: itemImage,
    message: "No plans available.",
  },
  wallet: {
    image: itemImage,
    message: "Your wallet is empty.",
  },
  banks: {
    image: itemImage,
    message: "Your wallet is empty.",
  },
  // complaints: {
  //   image: itemImage,
  //   message: "You don't have  any open or closed complaints yet.",
  // },
  coupons: {
    image: itemImage,
    message: "Your wallet is empty.",
  },
  liveproduct: {
    image: itemImage,
    message: "Your store is empty.",
  },
  orders: {
    image: itemImage,
    message: "You do not have order!",
  },
};

export const mainRequestNeededEmptyData = [
  "importlist",
  "coupons",
  "cart",
  "products",
  "wallet",
  "plans",
  "connect_store",
  "support",
  "banks",
  "liveproduct",
  "orders",
  "search",
  "filter",
];

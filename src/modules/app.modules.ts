/* eslint-disable @typescript-eslint/no-explicit-any */
//import { number } from "yup";

export class RegisterDTO {
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  password: string = "";
  password_confirmation: string = "";
}
export class LoginDTO {
  email: string = "";
  password: string = "";
}

export class otpVerfiyDTO {
  email: string = "";
  code: string = "";
}

export interface IPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  has_more: boolean;
}

export class FilterDTO {
  minPrice?: number = 0;
  maxPrice?: number = 0;
  available: number = 0;
  publishedOnStore: number = 0;
}

export interface CartItem {
  id: string | any;
  sub_product_id: number;
  product_title: string;
  product_id: number;
  image: string;
  quantity: number;
  price: number;
  created_at: Date;
}

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
  totalPages: number;
  has_more: boolean;
}


export interface EmptyData {
  [key: string]: PropertyEmptyData;
}
export interface PropertyEmptyData {
  image: string;
  message: string;
}
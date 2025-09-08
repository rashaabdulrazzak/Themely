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

export class CountryDTO {
  id: number = 0;
  name: string = "";
  code: string = "";
}
export class CityDTO {
  id: number = 0;
  name: string = "";
}

export class MunicipalityDTO {
  id: number = 0;
  name: string = "";
}

export type Adress = {
  id: number;
  user_id: number;
  apartment: string | any;
  building: string | any;
  city: CityDTO | any;
  country: CountryDTO | any;
  floor: string | any;
  street: string | any;
  postal_code: string;
  more_details: string;
  latitude: number;
  longitude: number;
  municipality: MunicipalityDTO | any;
  neighborhood: any;
};
export type Retailer = {
  id: number;
  name: string | any;
  created_at: string;
  contact_number: string | any;
};

export class UserDTO {
  id: number = 0;
  first_name: string = "";
  fullName: string = "";
  last_name: string = "";
  status: string = "";
  wallet?: string | any;
  address?: Adress;
  retailer?: Retailer;
  email: string = "";
  municipalities: number = 0;
  cities: number = 0;
  countries: number = 0;
  apartment: number = 0;
  floor: number = 0;
  building: number = 0;
  street: number = 0;
  password: string = "";
  supplier_logo?: any;
  supplier_cover?: any;
  retailer_name: string = "";
  supplier_contact_number: number = 0;
}
export class SubProductDTO {
  id?: string = "";
  price?: number = 0;
  sku?: string = "";
  ratio?: number = 0;
}
export class ProductEditDTO {
  title?: string = "";
  description?: string = "";
  price?: number = 0;
  sub_products?: Array<SubProductDTO> = [];
  sku?: string = "";
}
export class ChargeWalletDTO {
  amount: number = 0;
  bank_account_id?: number = 0;
  note: string = "";
  redirect_success: string = `${window.location.origin}/${process.env.REACT_APP_PAYMENT_REDIRECT_SUCCESS}`;
  redirect_failure: string = `${window.location.origin}/${process.env.REACT_APP_PAYMENT_REDIRECT_FAILURE}`;
}

export class BankDTO {
  account_number: string = "";
  bank_name: string = "";
  account_holder_name: string = "";
  account_type: string = "";
  branch_name: string = "";
  iban: string = "";
  ifsc_code: string = "";
  swift_code: string = "";
  currency?: any;
  balance: number = 0;
  is_primary: boolean = false;
}

export class CatalogueCustomEditDTO {
  showLogo?: boolean = false;
  showPrice?: boolean = false;
  showColor?: string = "#f50c44";
  subProducts?: Array<string> = [];
}

export class AddComplaintDTO {
  type?: any;
  description: string = "";
  attachments?: any[];
}

export class CreateOrderDTO {
  cart_id: number = 0;
  type: string = "WEBSITE";
  end_customer_full_name: string = "";
  end_customer_email: string = "";
  end_customer_phone_number: string = "";
  end_customer_notes: string = "";
  end_customer_address: string = "";
}
export interface EmptyData {
  [key: string]: PropertyEmptyData;
}
export interface PropertyEmptyData {
  image: string;
  message: string;
}

export interface IPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  has_more: boolean;
}
export class EmplyeeRoleDTO {}

export class EmployeeDTO {
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  role?: EmplyeeRoleDTO;
  password: string = "";
  status: string = "ACTIVE";
  country_id: number = 0;
  city_id: number = 0;
  municipality_id: number = 0;
  neighborhood_id: number = 0;
  street: string = "";
  building: string = "";
  floor: string = "";
  apartment: string = "";
  postal_code: string = "";
  more_details: string = "";
}
export class Employee {
  id?: string = "";
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  role?: EmplyeeRoleDTO;
  password: string = "";
  status: string = "";
  country_id: number = 0;
  city_id: number = 0;
  municipality_id: number = 0;
  neighborhood_id: number = 0;
  street: string = "";
  building: string = "";
  floor: string = "";
  apartment: string = "";
  postal_code: string = "";
  more_details: string = "";
}
export interface PlanCardItem {
  id?: string;
  price?: number;
  title?: string;
  description?: string;
  interval?: string;
  trial_days?: number;
  active?: number;
  order?: number;
  image?: string;
  created_at?: string;
  type?: TypePlan;
}

export interface TypePlan {
  [key: string]: string[];
}

export interface subCategory {
  appears_on_suggestions: number;
  title: string;
  commission: number;
  logo: string;
  parent_id: string;
  description: string;
  level: number;
  id: string;
}
export interface Category {
  appears_on_suggestions: number;
  title: string;
  commission: number;
  logo: string;
  parent_id: string;
  description: string;
  level: number;
  id: string;
  childrens?: subCategory[];
}
export interface Store {
  id: string;
  logo: string;
  name: string;
}
export interface selectStoreOption {
  name: string;
  value: string;
}

export interface subCategory {
  appears_on_suggestions: number;
  title: string;
  commission: number;
  logo: string;
  parent_id: string;
  description: string;
  level: number;
  id: string;
}
export interface Category {
  appears_on_suggestions: number;
  title: string;
  commission: number;
  logo: string;
  parent_id: string;
  description: string;
  level: number;
  id: string;
  childrens?: subCategory[];
}
export interface Store {
  id: string;
  logo: string;
  name: string;
}
export interface selectStoreOption {
  name: string;
  value: string;
}
export interface Item {
  id: string | any;
  title: string;
  description: string;
  slug: string;
  supplier: string;
  category: Category;
  active?: string;
  sku: string;
  quantity: number;
  // base_price: number;
  listing_price: number;
  ratio: number;
  publish_status: string;
  currency?: string;
  published_in_stores: Store[];
  images: string[];
  subProducts: any[];
  names: any[];
  retailer_products_temporary?: ItemTemp;
  retailer_products: ItemStore;
}
export interface ItemStore {
  id: string;
  connect_store_id: string;
  product_id: string;
  title: string;
  description: string;
  price: Category;
  currency?: string;
  created_at: string;
  sub_products: any[];
}
export interface ItemRetailer {
  item: Item;
}
export interface ItemTemp {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  sub_products_temporary: subProductTemp[];
}
export interface subProductTemp {
  sub_product_id?: string;
  ratio: number;
  price?: number;
  sku?: string;
}

export interface subProductAttributes {
  id: string | any;
  name: string;
  value: string;
}
export interface subProductsItem {
  id: string | any;
  images: string[];
  active?: string;
  sku: string;
  quantity: number;
  price?: number;
  listing_price?: number;
  recommended_price?: number;
  ratio?: number;
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  attribute_text_style?: string;
  subProductAttributes: subProductAttributes[];
}

export class FilterDTO {
  categories?: Array<Category> = [];
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

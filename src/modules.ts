export class RegisterDTO
{
    first_name: string = '';
    last_name: string ='';
    email: string = '';
    password: string = '';
    password_confirmation: string = '';
}
export class LoginDTO
{
    email: string = '';
    password: string = '';
}
export type Category = 
  | 'MARRIAGE'
  | 'BIRTHDAY'
  | 'GRADUATION'
  | 'EID'
  | 'NATIONALDAY'
  | 'OTHER';

/* export interface Template {
  id: string;
  name: string;
  image: string;
  price: number;
  category: Category;
  userId: string;
  createdAt: string;
  isAdminTemplate: boolean;
} */
export type Template = {
  id: number;
  name: string;
  image: string;   // URL
  price: number;
  category: Category;
  userId: string;

};
export interface IPagination {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    has_more: boolean;
    }

  export  type Canvas = {
    id: number;
    name: string;
    user: string;
    createdAt: string;
};
export type Download = {
  id: string | number;
  fileName: string;
  created: string;   // derived from createdAt (yyyy-mm-dd)
  userId?: string | number;
  user?: string;
};
export interface Payment {
  id: string | number;
  amount: number;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
  created: string;   // derived from createdAt (yyyy-mm-dd)
  userId?: string | number;
  user?: string;
}

export interface Review  {
  id: string | number;
  comment: string;
  rate: number; // Using 'rate' to match your Prisma schema
  created: string;   // derived from createdAt (yyyy-mm-dd)
  userId?: string | number;
  user?: string;
};
export interface User  {
    id: string | number;
    username: string;
    email: string;
    role: string;
    status: string;
    created: string;   // derived from createdAt (yyyy-mm-dd)
     createdAt?: string;
};
export type Role = 'ADMIN' | 'TemplateCreator' | 'USER';
export type Status = 'ACTIVE' | 'INACTIVE' | 'BANNED';

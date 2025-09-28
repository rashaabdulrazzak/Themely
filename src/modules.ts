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
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
  nameEn: string;
  nameAr?: string;
  image: string; // URL
  price: number;
  category: Category;
  userId: string;
};
export interface IPagination {
    totalItems: number;
    count: number;
    limit: number;
    page: number;
    totalPages: number;
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
export type  User = {
    id: string | number;
    username: string;
    email: string;
    role: Role;
    status: string;
    created: string;   // derived from createdAt (yyyy-mm-dd)
     createdAt?: string;
     Avatar?: string;
};



export type Role = 'ADMIN' | 'TEMPLATECREATOR' | 'USER' |'DESIGNER';
export type Status = 'ACTIVE' | 'INACTIVE' | 'BANNED';
export  interface AuthUser {
    id: string | number;
    username: string;
    email: string;
    role: Role;
    status: Status;
    name?: string;
    created: string;   // derived from createdAt (yyyy-mm-dd)
    createdAt?: string;
    Avatar?: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

export interface PermissionContextType {
    userRole: Role | null;
    userId: string | null;
    hasPermission: (permission: string) => boolean;
    loading: boolean;
}

export type DialogState =
  | { type: 'edit'; data: Template  }
  | { type: 'deleteSingle'; data: Template | null }
  | { type: 'deleteBulk'; data: Template[] }
  | { type: null; data?: null };


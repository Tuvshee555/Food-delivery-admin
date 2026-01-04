/* shared types + constants used by the admin orders UI */
export type OrderStatus =
  | "PENDING"
  | "WAITING_PAYMENT"
  | "COD_PENDING"
  | "PAID"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELLED";

export type FoodItem = {
  id?: string;
  quantity: number;
  food?: {
    id?: string;
    foodName?: string;
    price?: number;
    image?: string | null;
    categoryId?: string | null;
  } | null;
};

export type RawOrder = {
  id: string;
  orderNumber?: string;
  totalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: OrderStatus;
  paymentMethod?: string;
  user?: { id?: string; email?: string; address?: string | null } | null;
  delivery?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    city?: string | null;
    district?: string | null;
    khoroo?: string | null;
    address?: string | null;
    notes?: string | null;
  };
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  city?: string | null;
  district?: string | null;
  khoroo?: string | null;
  address?: string | null;
  notes?: string | null;
  foodOrderItems?: Array<{
    id?: string;
    quantity: number;
    food?: {
      id?: string;
      foodName?: string;
      price?: number;
      image?: string | null;
      categoryId?: string | null;
    } | null;
  }>;
  items?: FoodItem[];
};

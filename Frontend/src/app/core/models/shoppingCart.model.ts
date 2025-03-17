import { CartItem } from "./cartItem.model";

export interface ShoppingCart {
    id: number;
    clientId: number;
    cartItems: CartItem[];
  }
import { CartItem } from './cartItem.model';

export interface ShoppingCart {
    id: number;
    username: string;
    cartItems: CartItem[];
    status: string;
    totalCartPrice: number;
}

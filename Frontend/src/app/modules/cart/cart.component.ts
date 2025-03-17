import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../core/services/shoppingCart.service';
import { ShoppingCart } from '../../core/models/shoppingCart.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  shoppingCarts: ShoppingCart[] = [];
  cartTotals: { [cartId: number]: number } = {};
  errorMessage: string | null = null;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.loadShoppingCarts();
  }

  // Cargar todos los carritos
  loadShoppingCarts(): void {
    this.shoppingCartService.getShoppingCarts().subscribe(
      (data: ShoppingCart[]) => {
        this.shoppingCarts = data;
        this.errorMessage = null;
      },
      (error) => {
        this.errorMessage = 'Error al cargar los carritos. Inténtalo de nuevo más tarde.';
        console.error('Error fetching shopping carts', error);
      }
    );
  }

  // Calcular el total de un carrito
  calculateTotal(cartId: number): void {
    this.shoppingCartService.calculateCartTotal(cartId).subscribe(
      (total: number) => {
        this.cartTotals[cartId] = total;
        this.errorMessage = null;
      },
      (error) => {
        this.errorMessage = 'Error al calcular el total del carrito.';
        console.error('Error calculating cart total', error);
      }
    );
  }
}
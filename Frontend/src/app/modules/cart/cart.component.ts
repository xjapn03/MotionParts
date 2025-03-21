import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from '../../core/services/shoppingCart.service';
import { ShoppingCart } from '../../core/models/shoppingCart.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule]
})
export class ShoppingCartComponent implements OnInit {
  shoppingCart: ShoppingCart | null = null; //Ahora solo manejamos un carrito

  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService //Inyectamos AuthService para obtener el usuario
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user?.id) {
        // Usuario autenticado: cargar carrito desde backend
        this.shoppingCartService.getUserShoppingCart(user.id).subscribe({
          next: (data) => {
            this.shoppingCart = data;
          },
          error: (error) => {
            console.error('❌ Error al obtener el carrito del usuario', error);
          }
        });
      } else {
        // Usuario invitado: cargar carrito desde localStorage
        const guestCartItems = this.shoppingCartService.getGuestCart();

        this.shoppingCart = {
          id: 0,
          username: 'Invitado',
          cartItems: guestCartItems, // ✅ Ahora sí carga los productos del localStorage
          status: 'PENDING',
          totalCartPrice: this.calculateTotal(guestCartItems)
        };

        console.warn('⚠️ No se encontró un usuario autenticado.');
      }
    });
  }

  // Método para calcular el total del carrito de invitados
  calculateTotal(cartItems: any[]): number {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }


  trackByItemId(index: number, item: any): number {
    return item.id;
  }
}

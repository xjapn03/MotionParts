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
        this.shoppingCartService.getUserShoppingCart(user.id).subscribe({
          next: (data) => {
            this.shoppingCart = data;
          },
          error: (error) => {
          }
        });
      } else {
        console.warn('No se encontró un usuario autenticado.');
      }
    });
  }

  trackByItemId(index: number, item: any): number {
    return item.id;
  }
}

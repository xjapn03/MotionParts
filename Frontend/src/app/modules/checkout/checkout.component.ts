import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Importar FormsModule para [(ngModel)]
import { ShoppingCartService } from '../../core/services/shoppingCart.service';
import { CartItem } from '../../core/models/cartItem.model';  // Asegúrate de importar el modelo correcto


@Component({
  selector: 'app-checkout',
  standalone: true, // 🔹 Para componentes independientes
  imports: [CommonModule, FormsModule], // ✅ Agregar FormsModule para ngModel
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  currentStep: number = 1; // Iniciar en el paso 1
  enviarADireccionDiferente: boolean = false; // ✅ Controla si se muestra el formulario de dirección
  cartItems: CartItem[] = [];
  total: number = 0;

  //constructor(private router: Router) {}
  constructor(
    private router: Router, // ✅ Inyectar Router
    private shoppingCartService: ShoppingCartService
  
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.shoppingCartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.calculateTotal();
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }


  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }

  onSubmit(): void {
    console.log('Pedido confirmado');
    // 🚀 Aquí puedes agregar la lógica de pago con Wompi
  }
}

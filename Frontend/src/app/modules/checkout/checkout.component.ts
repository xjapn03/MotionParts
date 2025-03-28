import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Importar FormsModule para [(ngModel)]
import { ShoppingCartService } from '../../core/services/shoppingCart.service';
import { CartItem } from '../../core/models/cartItem.model';
import { LOCATIONS } from './locations'
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';
import { OrderDetail } from '../../core/models/orderDetail.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Asegurar FormsModule para [(ngModel)]
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {

  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService // ✅ Agregado para poder enviar la orden
  ) {}

  currentStep: number = 1; // 🔹 Inicia en el paso 1
  enviarADireccionDiferente: boolean = false;
  cartItems: CartItem[] = [];
  total: number = 0;

  // Datos del formulario de facturación
  billingData = {
    nombre: '',
    apellidos: '',
    tipoIdentificacion: '',
    numeroIdentificacion: '',
    direccion: '',
    direccionDetalle: '',
    pais: '',
    departamento: '',
    ciudad: '',
    codigoPostal: '',
    telefono: '',
    email: ''
  };

  // Datos de la dirección de envío (si es diferente)
  shippingData = {
    nombre: '',
    apellidos: '',
    direccion: '',
    direccionDetalle: '',
    pais: '',
    departamento: '',
    ciudad: '',
    codigoPostal: '',
    notas: ''
  };

  orderData = {
    cupon: '', // Código de cupón (si aplica)
    metodoEnvio: '', // Método de envío seleccionado
    metodoPago: '', // Método de pago seleccionado
    aceptoTerminos: false, // Confirmación de términos y condiciones
  };

  paises = Object.keys(LOCATIONS); // Lista de países
  regiones: string[] = []; // Lista de regiones según país seleccionado
  ciudades: string[] = []; // Lista de ciudades según región seleccionada
  regionesEnvio: string[] = [];
  ciudadesEnvio: string[] = [];

  onCountryChange(tipo: 'billing' | 'shipping'): void {
    const paisSeleccionado = tipo === 'billing' ? this.billingData.pais : this.shippingData.pais;

    if (tipo === 'billing') {
      this.regiones = paisSeleccionado ? Object.keys(LOCATIONS[paisSeleccionado].regiones) : [];
      this.billingData.departamento = "";
      this.ciudades = [];
    } else {
      this.regionesEnvio = paisSeleccionado ? Object.keys(LOCATIONS[paisSeleccionado].regiones) : [];
      this.shippingData.departamento = "";
      this.ciudadesEnvio = [];
    }
  }

  onRegionChange(tipo: 'billing' | 'shipping'): void {
    const paisSeleccionado = tipo === 'billing' ? this.billingData.pais : this.shippingData.pais;
    const regionSeleccionada = tipo === 'billing' ? this.billingData.departamento : this.shippingData.departamento;

    if (tipo === 'billing') {
      this.ciudades = regionSeleccionada ? LOCATIONS[paisSeleccionado].regiones[regionSeleccionada] : [];
      this.billingData.ciudad = "";
    } else {
      this.ciudadesEnvio = regionSeleccionada ? LOCATIONS[paisSeleccionado].regiones[regionSeleccionada] : [];
      this.shippingData.ciudad = "";
    }
  }



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
    console.log('Intentando avanzar al siguiente paso... Paso actual:', this.currentStep);

    if (this.validateStep(this.currentStep)) {
      this.currentStep++;
      console.log('Nuevo paso:', this.currentStep);
    } else {
      console.log('❌ No se pudo avanzar, datos incompletos.');
    }
  }


  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateStep(step: number): boolean {
    console.log('Validando paso:', step);

    switch (step) {
      case 1: // 🔹 Validación de Datos de Facturación
        const isValidBilling = this.billingData.nombre.trim() !== '' &&
          this.billingData.apellidos.trim() !== '' &&
          this.billingData.tipoIdentificacion.trim() !== '' &&
          this.billingData.numeroIdentificacion.trim() !== '' &&
          this.billingData.direccion.trim() !== '' &&
          this.billingData.direccionDetalle.trim() !== '' &&
          this.billingData.pais.trim() !== '' &&
          this.billingData.departamento.trim() !== '' &&
          this.billingData.ciudad.trim() !== '' &&
          this.billingData.telefono.trim() !== '' &&
          this.billingData.email.trim() !== '';

        console.log('¿Paso 1 válido?', isValidBilling);
        return isValidBilling;

      case 2: // 🔹 Validación de Dirección de Envío (si aplica)
        if (this.enviarADireccionDiferente) {
          const isValidShipping = this.shippingData.nombre.trim() !== '' &&
            this.shippingData.apellidos.trim() !== '' &&
            this.shippingData.direccion.trim() !== '' &&
            this.shippingData.direccionDetalle.trim() !== '' && // Se agregó el detalle de la dirección
            this.shippingData.pais.trim() !== '' &&
            this.shippingData.departamento.trim() !== '' &&
            this.shippingData.ciudad.trim() !== '' &&
            this.shippingData.codigoPostal.trim() !== ''; // Se agregó el código postal

          console.log('¿Paso 2 válido?', isValidShipping);
          return isValidShipping;
        }
        return true;

      case 3: // 🔹 Validación de Método de Pago y Términos
        const isValidPayment = this.orderData.metodoPago.trim() !== '' &&
          this.orderData.metodoEnvio.trim() !== '' &&
          this.orderData.aceptoTerminos; // Se verifica que haya aceptado los términos

        console.log('¿Paso 3 válido?', isValidPayment);
        return isValidPayment;

      default:
        return true;
    }
  }

  toggleShippingAddress(): void {
    console.log('Estado de envío diferente:', this.enviarADireccionDiferente);
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }

  onSubmit(): void {
    if (this.validateStep(3)) {
        // 🔹 Construimos los detalles de la orden basándonos en los productos del carrito
        const orderDetails: OrderDetail[] = this.cartItems.map(item => ({
            id: 0, // Se asignará en el backend
            orderId: 0, // Se asignará en el backend
            productId: item.product.id,
            productName: item.product.name, // Ajusta según tu modelo de producto
            quantity: item.quantity,
            unitPrice: item.product.price,
            subtotal: item.quantity * item.product.price
        }));

        const orderData: Order = {
            id: 0, // Se asignará en el backend
            userId: 1, // 🔹 Esto debe venir de la sesión del usuario autenticado
            orderDetails, // ✅ Se agregan los detalles de la orden
            total: this.total,
            paymentMethod: this.orderData.metodoPago,
            pickupLocation: this.orderData.metodoEnvio === 'Recoger en tienda' ? 'Bogotá, Carrera 27a #63g-46' : null,
            status: 'PENDING', // Estado inicial de la orden
            createdAt: new Date().toISOString() // Fecha actual en formato ISO
        };

        // 🔍 Logs para depuración
        console.log('💳 Método de pago seleccionado:', this.orderData.metodoPago);
        console.log('📦 Método de envío seleccionado:', this.orderData.metodoEnvio);
        console.log('📤 Enviando orden al backend:', orderData);

        this.orderService.createOrder(orderData)
        .subscribe({
            next: (response) => {
                console.log('✅ Pedido guardado con éxito:', response);
                alert('¡Pedido realizado con éxito!');
                this.router.navigate(['/order-confirmation']); // Redirigir a la página de confirmación
            },
            error: (error) => {
                console.error('❌ Error al guardar el pedido:', error);
                console.log('⚠️ Datos enviados al backend:', orderData);
                alert('Hubo un error al procesar tu pedido.');
            }
        });

    } else {
        console.log('❌ Falta información en el pedido.');
    }
}

}

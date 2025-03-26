import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/products.service';
import { Product } from '../../../app/core/models/product.model';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { ShoppingCartService } from '../../core/services/shoppingCart.service'; // Importa el servicio
import { CartItem } from '../../core/models/cartItem.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  searchTerm = new FormControl('');
  categoriaPadreFiltro = new FormControl(null);
  subcategoriaFiltro = new FormControl(null);
  precioFiltro = new FormControl(null);
  ordenarPor = new FormControl(null);

  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  productoSeleccionado: Product | null = null;
  cantidad: number = 1;

  categorias: Category[] = [];
  categoriasPadre: Category[] = [];
  subcategorias: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private shoppingCartService: ShoppingCartService // Inyecta el servicio del carrito
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();

    // Aplicar filtros automáticamente cuando cambian los valores
    this.searchTerm.valueChanges.subscribe(() => this.aplicarFiltros());
    this.categoriaPadreFiltro.valueChanges.subscribe(() => this.cargarSubcategorias());
    this.subcategoriaFiltro.valueChanges.subscribe(() => this.aplicarFiltros());
    this.precioFiltro.valueChanges.subscribe(() => this.aplicarFiltros());
    this.ordenarPor.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  cargarCategorias() {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categorias = data;
        this.categoriasPadre = this.categorias.filter(cat => !cat.parent);
      },
      error: (error: any) => {
        console.error('Error al obtener categorías', error);
      }
    });
  }

  cargarSubcategorias() {
    const categoriaSeleccionada = this.categoriaPadreFiltro.value;
    this.subcategorias = categoriaSeleccionada ? this.categorias.filter(cat => cat.parent?.id === categoriaSeleccionada) : [];
    this.subcategoriaFiltro.setValue(null);
    this.aplicarFiltros();
  }

  cargarProductos() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data.map(producto => ({
          ...producto,
          image: producto.image_url ? `assets/products/${producto.image_url}` : 'assets/products/productDefault.jpg',
          categories: producto.categories || []
        }));
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al obtener productos', error);
      }
    });
  }

  aplicarFiltros() {
    const categoriaId = this.categoriaPadreFiltro.value;
    const subcategoriaId = this.subcategoriaFiltro.value;

    let subcategoriasIds: number[] = categoriaId ? this.categorias.filter(cat => cat.parent?.id === categoriaId).map(cat => cat.id) : [];

    this.productosFiltrados = this.productos.filter(producto => {
      const categoryIds = producto.categories ? producto.categories.map(cat => cat.id) : [];
      return (
        (!this.searchTerm.value || producto.name.toLowerCase().includes(this.searchTerm.value.toLowerCase())) &&
        (!categoriaId || categoryIds.some(catId => catId === categoriaId || subcategoriasIds.includes(catId))) &&
        (!subcategoriaId || categoryIds.includes(subcategoriaId)) &&
        (!this.precioFiltro.value || producto.price <= +this.precioFiltro.value)
      );
    });

    if (this.ordenarPor.value === 'asc') {
      this.productosFiltrados.sort((a, b) => a.price - b.price);
    } else if (this.ordenarPor.value === 'desc') {
      this.productosFiltrados.sort((a, b) => b.price - a.price);
    }
  }

  verDetalles(producto: Product) {
    this.productoSeleccionado = { ...producto, categories: producto.categories || [] };
    this.cantidad = 1;
  }

  cerrarModal() {
    this.productoSeleccionado = null;
  }

  increaseQuantity() {
    this.cantidad++;
  }

  decreaseQuantity() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  buyNow() {
    console.log(`Comprando ${this.cantidad} unidad(es) de ${this.productoSeleccionado?.name}`);
  }

  addToCart() {
    if (!this.productoSeleccionado) return;

    const userId = this.getAuthenticatedUserId();

    if (!userId) {
      // 🟢 Usuario no autenticado → Agregar al carrito de invitados
      const guestCartItem: CartItem = {
        id: 0, // Se usa solo en backend
        product: this.productoSeleccionado,
        quantity: this.cantidad,
        unitPrice: this.productoSeleccionado.price,
        totalPrice: this.cantidad * this.productoSeleccionado.price
      };

      this.shoppingCartService.addToGuestCart(guestCartItem);
      alert('✅ Producto agregado al carrito de invitados');
      location.reload(); // 🔄 Recarga la página para reflejar el cambio
      return;
    }

    // 🟢 Usuario autenticado → Agregar al carrito del backend
    const shoppingCartId = this.getShoppingCartId(userId);
    if (!shoppingCartId) {
      console.error('❌ No se pudo obtener el ID del carrito');
      alert('Error al obtener el carrito de compras.');
      return;
    }

    const cartItem: CartItem = {
      id: 0, // O dejar que el backend lo asigne
      shoppingCartId: shoppingCartId,
      product: this.productoSeleccionado,
      quantity: this.cantidad,
      unitPrice: this.productoSeleccionado.price,
      totalPrice: this.cantidad * this.productoSeleccionado.price
    };

    this.shoppingCartService.addToCart(cartItem).subscribe({
      next: () => {
        console.log('✅ Producto agregado al carrito');
        alert('✅ Producto agregado al carrito con éxito');
        location.reload(); // 🔄 Recarga la página para actualizar el estado
      },
      error: (err: any) => {
        console.error('❌ Error al agregar al carrito', err);
        alert('❌ Error al agregar al carrito');
      }
    });
  }

  getShoppingCartId(userId: number): number | null {
    // Aquí deberías hacer una llamada real al backend para obtener el carrito del usuario.
    // Simulación de ID de carrito:
    return userId ? 1 : null; // Reemplaza con una llamada real
  }


  getAuthenticatedUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }


  getCategoryNames(producto: Product | null): string {
    return producto?.categories?.length ? producto.categories.map(cat => cat.name).join(', ') : 'Sin categoría';
  }

  onImageError(event: any) {
    if (!event.target.dataset.errorHandled) {
      event.target.dataset.errorHandled = "true";
      event.target.src = 'assets/products/productDefault.jpg';
    }
  }
}

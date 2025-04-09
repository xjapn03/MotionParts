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
import { environment } from '../../../environments/environment';


// ... Importaciones (igual que antes)

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

  imagenActual: number = 0;

  imageUrl(url: string): string {
    return url ? `${environment.apiUrl}${url}` : 'assets/products/productDefault.jpg';
  }


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();

    this.searchTerm.valueChanges.subscribe(() => this.aplicarFiltros());
    this.categoriaPadreFiltro.valueChanges.subscribe(() => this.cargarSubcategorias());
    this.subcategoriaFiltro.valueChanges.subscribe(() => this.aplicarFiltros());
    this.precioFiltro.valueChanges.subscribe(() => this.aplicarFiltros());
    this.ordenarPor.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  cambiarImagen(direccion: number) {
    if (!this.productoSeleccionado?.gallery) return;

    const total = this.productoSeleccionado.gallery.length;
    this.imagenActual = (this.imagenActual + direccion + total) % total;
  }



  cargarCategorias() {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categorias = data;
        console.log('Todas las categorías:', this.categorias);
        this.categoriasPadre = this.categorias.filter(cat => !cat.parentId);
        console.log('Categorías padre:', this.categoriasPadre);
      },
      error: (error: any) => {
        console.error('Error al obtener categorías', error);
      }
    });
  }


  cargarSubcategorias() {
    const categoriaSeleccionada = this.categoriaPadreFiltro.value;
    this.subcategorias = categoriaSeleccionada
      ? this.categorias.filter(cat => cat.parentId === categoriaSeleccionada)
      : [];
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

    let subcategoriasIds: number[] = categoriaId
      ? this.categorias
          .filter(cat => cat.parentId === categoriaId)
          .map(cat => cat.id!)
          .filter(id => id !== undefined)
      : [];

    this.productosFiltrados = this.productos.filter(producto => {
      const categoryIds = producto.categories?.map(cat => cat.id).filter(id => id !== undefined) as number[] ?? [];

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
    this.cantidad = 1;
    this.imagenActual = 0;

    this.productService.getProductById(producto.id!).subscribe({
      next: (detalle) => {
        this.productoSeleccionado = {
          ...detalle,
          categories: detalle.categories || [],
          gallery: detalle.gallery || []
        };
      },
      error: (err) => {
        console.error('Error cargando detalles del producto', err);
      }
    });
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
      const guestCartItem: CartItem = {
        id: 0,
        product: this.productoSeleccionado,
        quantity: this.cantidad,
        unitPrice: this.productoSeleccionado.price,
        totalPrice: this.cantidad * this.productoSeleccionado.price
      };

      this.shoppingCartService.addToGuestCart(guestCartItem);
      alert('✅ Producto agregado al carrito de invitados');
      location.reload();
      return;
    }

    const shoppingCartId = this.getShoppingCartId(userId);
    if (!shoppingCartId) {
      console.error('❌ No se pudo obtener el ID del carrito');
      alert('Error al obtener el carrito de compras.');
      return;
    }

    const cartItem: CartItem = {
      id: 0,
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
        location.reload();
      },
      error: (err: any) => {
        console.error('❌ Error al agregar al carrito', err);
        alert('❌ Error al agregar al carrito');
      }
    });
  }

  getShoppingCartId(userId: number): number | null {
    return userId ? 1 : null;
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

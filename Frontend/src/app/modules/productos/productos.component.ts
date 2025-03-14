import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/products.service';
import { Product } from '../../../app/core/models/product.model';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';



@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Asegura que CommonModule está importado
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  searchTerm = new FormControl('');
  categoriaFiltro = new FormControl('');
  precioFiltro = new FormControl('');
  ordenarPor = new FormControl('');

  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  productoSeleccionado: Product | null = null;
  cantidad: number = 1;

  categorias: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias(); // ✅ Cargar categorías desde el backend

    // Aplicar filtros automáticamente cuando cambian los valores de los filtros
    this.searchTerm.valueChanges.subscribe(() => this.aplicarFiltros());
    this.categoriaFiltro.valueChanges.subscribe(() => this.aplicarFiltros());
    this.precioFiltro.valueChanges.subscribe(() => this.aplicarFiltros());
    this.ordenarPor.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  cargarCategorias() {
    this.categoryService.getCategories().subscribe({
      next: (data: any[]) => { // Asegurar que `data` es un array
        this.categorias = data.map(categoria => ({
          id: categoria.id_category, // 👈 Renombramos id_category a id
          name: categoria.name,
          description: categoria.description
        }));
        console.log("Categorías obtenidas:", this.categorias); // Verificar transformación
      },
      error: (error: any) => {
        console.error('Error al obtener categorías', error);
      }
    });
  }

  onImageError(event: any) {
    if (!event.target.dataset.errorHandled) {
      event.target.dataset.errorHandled = "true"; // Evita bucle
      event.target.src = 'assets/products/productDefault.jpg'; // ✅ Ruta corregida
    }
  }

  cargarProductos() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data.map(producto => ({
          ...producto,
          image: producto.image
            ? `assets/products/${producto.image}`
            : 'assets/products/productDefault.jpg' // ✅ Ruta corregida
        }));
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al obtener productos', error);
      }
    });
  }

  aplicarFiltros() {
    console.log("Productos antes de filtrar:", this.productos);

    // Asegurar que `categoriaFiltro.value` tenga un valor válido
    const categoriaSeleccionada = this.categoriaFiltro.value ?? ''; // 👈 Evitar undefined
    console.log("Categoría seleccionada después de validar:", categoriaSeleccionada);
    console.log("Tipo de categoría seleccionada:", typeof categoriaSeleccionada);

    this.productosFiltrados = this.productos.filter(producto => {
        const coincideBusqueda = this.searchTerm.value
            ? producto.name.toLowerCase().includes(this.searchTerm.value.toLowerCase())
            : true;

        const coincideCategoria = categoriaSeleccionada !== ''
            ? Number(producto.category_id) === Number(categoriaSeleccionada)
            : true;

        const coincidePrecio = this.precioFiltro.value
            ? producto.price <= +this.precioFiltro.value
            : true;

        return coincideBusqueda && coincideCategoria && coincidePrecio;
    });

    console.log("Productos después de filtrar:", this.productosFiltrados);

    // Ordenar productos
    if (this.ordenarPor.value === 'asc') {
        this.productosFiltrados.sort((a, b) => a.price - b.price);
    } else if (this.ordenarPor.value === 'desc') {
        this.productosFiltrados.sort((a, b) => b.price - a.price);
    }
  }

  verDetalles(producto: Product) {
    this.productoSeleccionado = producto;
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
    console.log(`Agregado al carrito: ${this.cantidad} unidad(es) de ${this.productoSeleccionado?.name}`);
  }

  // Obtener el nombre de la categoría en base al ID
  getCategoryName(category_id: number): string {
    return this.categorias.find(cat => cat.id === category_id)?.name || 'Desconocida'; // ✅ Usar `name`
  }

}

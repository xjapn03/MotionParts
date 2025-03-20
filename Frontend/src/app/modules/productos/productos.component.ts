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
    private categoryService: CategoryService
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
          image: producto.image ? `assets/products/${producto.image}` : 'assets/products/productDefault.jpg',
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
      const categoryIds = producto.categories.map(cat => cat.id);
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
    console.log(`Agregado al carrito: ${this.cantidad} unidad(es) de ${this.productoSeleccionado?.name}`);
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

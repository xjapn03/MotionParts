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
  categoriaPadreFiltro = new FormControl('');
  subcategoriaFiltro = new FormControl('');
  precioFiltro = new FormControl('');
  ordenarPor = new FormControl('');

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
        // Filtrar solo categorías padre (las que no tienen `parent`)
        this.categoriasPadre = this.categorias.filter(cat => !cat.parent);
        console.log("Categorías obtenidas:", this.categorias);
      },
      error: (error: any) => {
        console.error('Error al obtener categorías', error);
      }
    });
  }

  cargarSubcategorias() {
    const categoriaSeleccionada = Number(this.categoriaPadreFiltro.value);

    if (!categoriaSeleccionada) {
      this.subcategorias = [];
      this.subcategoriaFiltro.setValue(''); // Resetear subcategoría si no hay categoría padre
      this.aplicarFiltros();
      return;
    }

    this.subcategorias = this.categorias.filter(cat => cat.parent?.id === categoriaSeleccionada);
    this.subcategoriaFiltro.setValue('');
    this.aplicarFiltros();
  }

  onImageError(event: any) {
    if (!event.target.dataset.errorHandled) {
      event.target.dataset.errorHandled = "true";
      event.target.src = 'assets/products/productDefault.jpg';
    }
  }

  cargarProductos() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data.map(producto => ({
          ...producto,
          image: producto.image
            ? `assets/products/${producto.image}`
            : 'assets/products/productDefault.jpg'
        }));
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al obtener productos', error);
      }
    });
  }

  aplicarFiltros() {
    const categoriaId = Number(this.categoriaPadreFiltro.value) || null;
    const subcategoriaId = Number(this.subcategoriaFiltro.value) || null;

    // Obtener todas las subcategorías de la categoría padre seleccionada
    let subcategoriasIds: number[] = [];
    if (categoriaId) {
      subcategoriasIds = this.categorias
        .filter(cat => cat.parent?.id === categoriaId)
        .map(cat => cat.id);
    }

    this.productosFiltrados = this.productos.filter(producto => {
      const coincideBusqueda = this.searchTerm.value
        ? producto.name.toLowerCase().includes(this.searchTerm.value.toLowerCase())
        : true;

      // Verificar si el producto pertenece a la categoría padre o alguna de sus subcategorías
      const coincideCategoria = categoriaId
        ? producto.categoryIds.some(catId => catId === categoriaId || subcategoriasIds.includes(catId))
        : true;

      const coincideSubcategoria = subcategoriaId
        ? producto.categoryIds.includes(subcategoriaId)
        : true;

      const coincidePrecio = this.precioFiltro.value
        ? producto.price <= +this.precioFiltro.value
        : true;

      return coincideBusqueda && coincideCategoria && coincideSubcategoria && coincidePrecio;
    });

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
  getCategoryName(categoryIds: number[]): string {
    if (!categoryIds || categoryIds.length === 0) return "Sin categoría";

    // Filtra las categorías que coinciden con los IDs del producto
    const categoryNames = this.categorias
      .filter(cat => categoryIds.includes(cat.id))
      .map(cat => cat.name);

    // Devuelve los nombres separados por comas
    return categoryNames.join(", ");
  }
}

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/product.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimiza la detección de cambios
})
export class ProductsComponent implements OnInit {
  searchId: number | null = null;
  products: Product[] = [];
  product: Product = { id: null, reference: '', name: '', price: 0, stock: 0, description: '', image_url: '', categories: [], gallery: [] };
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;
  subcategories: Category[] = [];
  mainImageFile: File | null = null;
  galleryFiles: File[] = [];
  mainImagePreview: string | null = null;
  galleryPreviews: string [] = [];
  activeTab: string = 'form'; // Agregada la propiedad faltante

  // Propiedades para el manejo de alertas
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'warning' | '' = '';
  showAlert: boolean = false;
  showDeleteConfirm: boolean = false;
  productToDelete: number | null = null;
  isLoading: boolean = false;
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef // Inyecta ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  // Método para cambiar entre pestañas
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  // Función trackBy para optimizar el ngFor
  trackByProductId(index: number, item: Product): number {
    return item.id!;
  }

  trackByCategoryId(index: number, item: Category): number {
    return item.id!;
  }

  onMainImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.mainImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = reader.result as string;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para limpiar la imagen principal
  clearMainImage(): void {
    this.mainImageFile = null;
    this.mainImagePreview = null;
    this.cdr.markForCheck();
  }

  onGalleryImagesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.galleryFiles = [];
    this.galleryPreviews = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.galleryFiles.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          this.galleryPreviews.push(reader.result as string);
          this.cdr.markForCheck();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // Método para limpiar todas las imágenes de la galería
  clearGalleryImages(): void {
    this.galleryFiles = [];
    this.galleryPreviews = [];
    this.cdr.markForCheck();
  }

  // Método para eliminar una imagen específica de la galería
  removeGalleryImage(index: number): void {
    this.galleryFiles.splice(index, 1);
    this.galleryPreviews.splice(index, 1);
    this.cdr.markForCheck();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/products/productDefault.jpg'; // Asegúrate de que esta imagen exista
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = [...data]; // Crea una nueva referencia
        this.applyFilters();
        this.isLoading = false;
        this.cdr.markForCheck(); // Marca para revisión de cambios
      },
      error: (error) => {
        this.displayAlert('Error al cargar productos', 'error');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = [...data]; // Crea una nueva referencia
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.displayAlert('Error al cargar categorías', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  onCategoryChange() {
    if (this.selectedCategoryId !== null) {
      this.subcategories = this.categories.filter(cat => cat.id !== this.selectedCategoryId);
    } else {
      this.subcategories = [];
    }
    this.selectedSubcategoryId = null;
    this.cdr.markForCheck();
  }

  applyFilters() {
    // Usa una función pura para filtrar
    const filtered = this.products.filter(product => {
      // Filtrar por ID si se ha especificado
      if (this.searchId !== null && product.id !== this.searchId) {
        return false;
      }

      // Filtrar por término de búsqueda si existe
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const term = this.searchTerm.toLowerCase();
        return product.name.toLowerCase().includes(term) ||
              product.description.toLowerCase().includes(term);
      }

      return true;
    });

    // Asigna los resultados filtrados de una sola vez
    this.filteredProducts = [...filtered];
    this.cdr.markForCheck();
  }

  onSearch() {
    this.applyFilters();
  }

  displayAlert(message: string, type: 'success' | 'error' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    this.cdr.markForCheck();

    // Auto-ocultar la alerta después de 3 segundos
    setTimeout(() => {
      this.showAlert = false;
      this.alertMessage = '';
      this.alertType = '';
      this.cdr.markForCheck();
    }, 3000);
  }

  onSubmit() {
    if (!this.validateForm()) return;

    this.isLoading = true;
    this.cdr.markForCheck();

    const selectedCategory = this.categories.find(cat => Number(cat.id) === Number(this.selectedCategoryId));
    const selectedSubcategory = this.categories.find(cat => Number(cat.id) === Number(this.selectedSubcategoryId));

    const productToSave = {
      ...this.product,
      categories: [
        ...(selectedCategory ? [selectedCategory] : []),
        ...(selectedSubcategory ? [selectedSubcategory] : [])
      ]
    };

    const saveAndUploadImages = (savedProduct: Product) => {
      const imageUpload$ = [];

      // 🟢 SUBIR IMAGEN PRINCIPAL
      if (this.mainImageFile) {
        const formData = new FormData();
        formData.append('image', this.mainImageFile); // 👈🏼 importante que sea 'image'
        console.log('[MAIN IMG] FormData contiene:', formData.get('image'));

        imageUpload$.push(this.productService.uploadMainImage(savedProduct.id!, formData));
      } else {
        console.warn('⚠️ No hay imagen principal para subir.');
      }

      // 🟢 SUBIR GALERÍA DE IMÁGENES
      if (this.galleryFiles.length > 0) {
        imageUpload$.push(this.productService.uploadImages(savedProduct.id!, this.galleryFiles));
      } else {
        console.warn('⚠️ No hay imágenes de galería para subir.');
      }

      // 🧵 Ejecutar uploads
      if (imageUpload$.length > 0) {
        forkJoin(imageUpload$).subscribe({
          next: (responses) => {
            console.log('Respuestas al subir imágenes:', responses);
            this.displayAlert('¡Producto e imágenes subidos correctamente!', 'success');
            this.resetForm();
            this.loadProducts();
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error al subir imágenes (forkJoin):', JSON.stringify(err, null, 2));
            this.displayAlert('Producto guardado, pero error al subir imágenes', 'warning');
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
      } else {
        this.displayAlert('¡Producto guardado correctamente!', 'success');
        this.resetForm();
        this.loadProducts();
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    };

    // Crear o actualizar producto
    if (productToSave.id && productToSave.id !== 0) {
      this.productService.updateProduct(productToSave).subscribe({
        next: saveAndUploadImages,
        error: () => {
          this.displayAlert('Error al actualizar producto', 'error');
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.productService.createProduct(productToSave).subscribe({
        next: saveAndUploadImages,
        error: () => {
          this.displayAlert('Error al crear producto', 'error');
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.product.name ||
        !this.product.reference ||
        this.product.price <= 0 ||
        this.product.stock < 0 ||
        !this.product.description ||
        !this.mainImageFile || // Usamos la imagen principal cargada
        !this.selectedCategoryId) {
      this.displayAlert('Por favor, complete todos los campos obligatorios', 'warning');
      return false;
    }
    return true;
  }

  resetForm() {
    // Crea un nuevo objeto para evitar referencias
    this.product = { id: 0, reference: '', name: '', price: 0, stock: 0, description: '', image_url: '', categories: [], gallery: [] };
    this.mainImageFile = null;
    this.mainImagePreview = null;
    this.galleryFiles = [];
    this.galleryPreviews = [];
  }

  onEdit(product: Product) {
    // Cambiar a la pestaña de formulario cuando se edita
    this.switchTab('form');
    
    // Desplazar al formulario cuando se edita
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Crea una copia profunda para evitar cambios no deseados
    this.product = JSON.parse(JSON.stringify(product));

    if (product.categories && product.categories.length > 0) {
      const mainCategory = product.categories.find(cat => !cat.parentId) ?? null;
    const subCategory = product.categories.find(cat => cat.parentId) ?? null;

      this.selectedCategoryId = mainCategory?.id ?? null;
      this.onCategoryChange();
      this.selectedSubcategoryId = subCategory?.id ?? null;
    } else {
      this.selectedCategoryId = null;
      this.selectedSubcategoryId = null;
    }

    this.cdr.markForCheck();
  }

  initiateDelete(productId: number) {
    this.productToDelete = productId;
    this.showDeleteConfirm = true;
    this.cdr.markForCheck();
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.isLoading = true;
      this.cdr.markForCheck();

      this.productService.deleteProduct(this.productToDelete).subscribe({
        next: () => {
          this.displayAlert('Producto eliminado correctamente', 'success');
          this.loadProducts();
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.displayAlert('Error al eliminar el producto', 'error');
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
      this.cancelDelete();
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.productToDelete = null;
    this.cdr.markForCheck();
  }
}
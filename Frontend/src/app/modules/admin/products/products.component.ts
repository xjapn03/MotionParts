import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/product.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-products',
  standalone: true, // Importante para proyectos standalone
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule, FormsModule] // Asegura que se importen correctamente
})
export class ProductsComponent implements OnInit {
  searchId: number | null = null;
  products: Product[] = [];
  product: Product = { id: 0, reference: '', name: '', price: 0, stock: 0, description: '', image_url: '', categories: [] };
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;
  subcategories: Category[] = [];

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = this.products;
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onCategoryChange() {
    if (this.selectedCategoryId !== null) {
      // Simplemente asigna todas las categorías como subcategorías
      this.subcategories = this.categories.filter(cat => cat.id !== this.selectedCategoryId);
    } else {
      this.subcategories = [];
    }
    this.selectedSubcategoryId = null;
  }
  
  onSubmit() {
    // Verificación de que los IDs de categorías seleccionadas existen
    console.log('selectedCategoryId:', this.selectedCategoryId);
    console.log('selectedSubcategoryId:', this.selectedSubcategoryId);
  
    const selectedCategory = this.categories.find(cat => Number(cat.id) === Number(this.selectedCategoryId));
    const selectedSubcategory = this.categories.find(cat => Number(cat.id) === Number(this.selectedSubcategoryId));
  
    console.log('selectedCategory:', selectedCategory);
    console.log('selectedSubcategory:', selectedSubcategory);
  
    if (selectedCategory || selectedSubcategory) {
      this.product.categories = [
        ...(selectedCategory ? [{
          id: selectedCategory.id,
          name: selectedCategory.name,
          description: selectedCategory.description
        }] : []),
        ...(selectedSubcategory ? [{
          id: selectedSubcategory.id,
          name: selectedSubcategory.name,
          description: selectedSubcategory.description
        }] : []),
      ];
    }
    
    console.log('Producto a enviar:', this.product);  // Verifica el objeto 'product' completo antes de enviarlo.
  
    if (this.product.id && this.product.id !== 0) {
      this.productService.updateProduct(this.product).subscribe(() => {
        console.log("✅ Producto actualizado correctamente");
        this.resetForm();
        this.loadProducts();
      }, error => {
        console.error("❌ Error al actualizar el producto:", error);
      });
    } else {
      this.productService.createProduct(this.product).subscribe(() => {
        console.log("✅ Producto creado correctamente");
        this.resetForm();
        this.loadProducts();
      }, error => {
        console.error("❌ Error al crear el producto:", error);
      });
    }
  }        

  resetForm() {
    this.product = { id: 0, reference: '', name: '', price: 0, stock: 0, description: '', image_url: '', categories: [] };
    this.selectedCategoryId = null;
    this.selectedSubcategoryId = null;
  }

  onEdit(product: Product) {
    this.product = { ...product };
  
    if (product.categories && product.categories.length > 0) {
      // Asumimos que una categoría principal no tiene 'parent' y la subcategoría tiene 'parent'
      const mainCategory = product.categories.find(cat => !cat.parent) ?? null;
      const subCategory = product.categories.find(cat => cat.parent) ?? null;
  
      this.selectedCategoryId = mainCategory?.id ?? null;
      this.onCategoryChange(); // Esto actualiza las subcategorías disponibles
      this.selectedSubcategoryId = subCategory?.id ?? null;
    } else {
      this.selectedCategoryId = null;
      this.selectedSubcategoryId = null;
    }
  }   
  
  onDelete(productId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}


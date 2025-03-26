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
      this.subcategories = this.categories.filter(cat => cat.parent && cat.parent.id === this.selectedCategoryId);
    } else {
      this.subcategories = [];
    }
    this.selectedSubcategoryId = null;
  }
  
  onSubmit() {
    if (this.selectedCategoryId || this.selectedSubcategoryId) {
      const selectedCategory = this.categories.find(cat => cat.id === this.selectedCategoryId) ?? null;
      const selectedSubcategory = this.categories.find(cat => cat.id === this.selectedSubcategoryId) ?? null;

      this.product.categories = [
        ...(selectedCategory ? [{ id: selectedCategory.id, name: selectedCategory.name, description: '', parent: selectedCategory.parent }] : []),
        ...(selectedSubcategory ? [{ id: selectedSubcategory.id, name: selectedSubcategory.name, description: '', parent: selectedSubcategory.parent }] : [])
      ];
    }

    if (this.product.id && this.product.id !== 0) {
      this.productService.updateProduct(this.product).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    } else {
      this.productService.createProduct(this.product).subscribe(() => {
        this.resetForm();
        this.loadProducts();
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
      this.selectedCategoryId = product.categories[0]?.id ?? null;
      this.onCategoryChange(); 
      this.selectedSubcategoryId = product.categories.length > 1 ? product.categories[1]?.id ?? null : null;
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

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ⬅ Importar FormsModule
import { CommonModule } from '@angular/common'; // ⬅ Importar CommonModule

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  searchId: number | null = null; 
  products = [
    { id: 1, name: 'Laptop Gamer', price: 3500000, stock: 10 },
    { id: 2, name: 'Teclado Mecánico', price: 250000, stock: 25 },
    { id: 3, name: 'Mouse Inalámbrico', price: 150000, stock: 30 }
  ];

  product = { id: 0, name: '', price: 0, stock: 0 };

  get filteredProducts() {
    if (this.searchId) {
      return this.products.filter(p => p.id === this.searchId);
    }
    return this.products;
  }

  onSubmit() {
    if (this.product.id !== null) {
      // Editar producto existente
      const index = this.products.findIndex(p => p.id === this.product.id);
      if (index !== -1) {
        this.products[index] = { ...this.product };
      }
    } else {
      // Crear nuevo producto
      this.product.id = this.products.length + 1;
      this.products.push({ ...this.product });
    }
    this.resetForm();
  }

  onEdit(product: any) {
    this.product = { ...product };
  }

  onDelete(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }

  resetForm() {
    this.product = { id: 0, name: '', price: 0, stock: 0 };
  }
}

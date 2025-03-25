import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ⬅ Importar FormsModule
import { CommonModule, getLocaleEraNames } from '@angular/common'; // ⬅ Importar CommonModule

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  searchId: number | null = null; 
  products = [
    { id: 1, reference: 1204, name: 'Motor Hamer', price: 3500000, stock: 10, description: 'Un motor es una máquina que transforma energía en movimiento. Puede ser eléctrico, de combustión interna o externa, y se utiliza en diversos sistemas y dispositivo', image_url: 'https://media.gettyimages.com/id/95757561/es/foto/rueda-de-coche.jpg?s=612x612&w=gi&k=20&c=HbLBW-yihmtM1AVKqVpB8nzFy_uOzfnswJUukoT3RXc=' },
    { id: 2, reference: 1744, name: 'Teclado Mecánico', price: 250000, stock: 25, description:'Hola', image_url: 'https://media.gettyimages.com/id/95757561/es/foto/rueda-de-coche.jpg?s=612x612&w=gi&k=20&c=HbLBW-yihmtM1AVKqVpB8nzFy_uOzfnswJUukoT3RXc=' },
    { id: 3, reference: 1314, name: 'Mouse Inalámbrico', price: 150000, stock: 30, description:'Hola', image_url: 'https://media.gettyimages.com/id/95757561/es/foto/rueda-de-coche.jpg?s=612x612&w=gi&k=20&c=HbLBW-yihmtM1AVKqVpB8nzFy_uOzfnswJUukoT3RXc=' }
  ];

  product = { id: 0, reference: 0, name: '', price: 0, stock: 0, description: '', image_url: '' };

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
      this.product.id = new Date().getTime();  // Usar el timestamp como ID único
      this.products = [...this.products, { ...this.product }];  // Usamos una nueva referencia para forzar la actualización
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
    this.product = { id: 0, reference: 0, name: '', price: 0, stock: 0, description: '', image_url: '' };
  }
}

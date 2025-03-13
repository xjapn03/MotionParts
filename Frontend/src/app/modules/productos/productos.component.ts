import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  searchTerm = new FormControl('');
  categoriaFiltro = new FormControl('');
  precioFiltro = new FormControl('');
  ordenarPor = new FormControl('');

  productoSeleccionado: any = null;
  cantidad: number = 1; // Cantidad por defecto

  productos = [
    { 
      nombre: 'Filtros de aire', 
      precio: 2500, 
      categoria: 'Motor y Componentes', 
      descripcion: 'Potente laptop con procesador de última generación y pantalla HD.',
      imagenes: [
        'https://www.rodi.es/blog/wp-content/uploads/2018/03/filtro-aire-coche-revision.jpg',
      ]
    },
    { 
      nombre: 'Filtros de aire', 
      precio: 2500, 
      categoria: 'Motor y Componentes', 
      descripcion: 'Potente laptop con procesador de última generación y pantalla HD.',
      imagenes: [
        'https://www.rodi.es/blog/wp-content/uploads/2018/03/filtro-aire-coche-revision.jpg',
      ]
    },
    { 
      nombre: 'Filtros de aire', 
      precio: 2500, 
      categoria: 'Motor y Componentes', 
      descripcion: 'Potente laptop con procesador de última generación y pantalla HD.',
      imagenes: [
        'https://www.rodi.es/blog/wp-content/uploads/2018/03/filtro-aire-coche-revision.jpg',
      ]
    },
    { 
      nombre: 'Filtros de aire', 
      precio: 2500, 
      categoria: 'Motor y Componentes', 
      descripcion: 'Potente laptop con procesador de última generación y pantalla HD.',
      imagenes: [
        'https://www.rodi.es/blog/wp-content/uploads/2018/03/filtro-aire-coche-revision.jpg',
      ]
    },
    // Resto de productos...
  ];

  get productosFiltrados() {
    let productosFiltrados = this.productos;

    // Filtrar por nombre
    if (this.searchTerm.value) {
      productosFiltrados = productosFiltrados.filter(p =>
        p.nombre.toLowerCase().includes(this.searchTerm.value!.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (this.categoriaFiltro.value) {
      productosFiltrados = productosFiltrados.filter(p =>
        p.categoria === this.categoriaFiltro.value
      );
    }

    // Filtrar por precio
    if (this.precioFiltro.value) {
      const precioMax = parseInt(this.precioFiltro.value, 10);
      productosFiltrados = productosFiltrados.filter(p => p.precio <= precioMax);
    }

    // Ordenar alfabéticamente
    if (this.ordenarPor.value === 'asc') {
      productosFiltrados = productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.ordenarPor.value === 'desc') {
      productosFiltrados = productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    return productosFiltrados;
  }

  verDetalles(producto: any) {
    this.productoSeleccionado = producto;
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

  setMainImage(index: number) {
    this.productoSeleccionado.imagenes[0] = this.productoSeleccionado.imagenes[index];
  }

  buyNow() {
    alert('Compra realizada');
    this.cerrarModal();
  }

  addToCart() {
    alert('Producto agregado al carrito');
  }
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
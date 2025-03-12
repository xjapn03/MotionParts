import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  searchTerm = new FormControl('');
  categoriaFiltro = new FormControl('');
  precioFiltro = new FormControl('');
  ordenarPor = new FormControl('');

  productoSeleccionado: any = null;

  productos = [
    { 
      nombre: 'Laptop', 
      precio: 2500, 
      categoria: 'Electrónica', 
      descripcion: 'Potente laptop con procesador de última generación y pantalla HD.',
      imagenes: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqrIaOoNLKb_PGfc_nS4s3IVBC8x7x9nYOqQ&s',
        'https://m.media-amazon.com/images/I/81ZKz5D1t2L._AC_SX679_.jpg'
      ]
    },
    { 
      nombre: 'Teléfono', 
      precio: 1200, 
      categoria: 'Electrónica', 
      descripcion: 'Teléfono inteligente con cámara de alta resolución y batería de larga duración.',
      imagenes: [
        'https://m.media-amazon.com/images/I/71S8U9VzLTL._AC_UF894,1000_QL80_.jpg',
        'https://m.media-amazon.com/images/I/71pVZ6DdOVL._AC_SX679_.jpg'
      ]
    },
    { 
      nombre: 'Tablet', 
      precio: 800, 
      categoria: 'Electrónica', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-2022-hero-blue-wifi-select',
        'https://m.media-amazon.com/images/I/61i8Vjb17SL._AC_SX679_.jpg'
      ]
    },
    { 
      nombre: 'Tablet', 
      precio: 800, 
      categoria: 'Electrónica', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-2022-hero-blue-wifi-select',
        'https://m.media-amazon.com/images/I/61i8Vjb17SL._AC_SX679_.jpg'
      ]
    },
    { 
      nombre: 'Tablet', 
      precio: 800, 
      categoria: 'Electrónica', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-2022-hero-blue-wifi-select',
        'https://m.media-amazon.com/images/I/61i8Vjb17SL._AC_SX679_.jpg'
      ]
    },
    { 
      nombre: 'Tablet', 
      precio: 800, 
      categoria: 'Electrónica', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-2022-hero-blue-wifi-select',
        'https://m.media-amazon.com/images/I/61i8Vjb17SL._AC_SX679_.jpg'
      ]
    },
    { 
      nombre: 'Tablet', 
      precio: 800, 
      categoria: 'Electrónica', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-2022-hero-blue-wifi-select',
        'https://m.media-amazon.com/images/I/61i8Vjb17SL._AC_SX679_.jpg'
      ]
    },
    { 
      nombre: 'Tablet', 
      precio: 800, 
      categoria: 'Electrónica', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-2022-hero-blue-wifi-select',
        'https://m.media-amazon.com/images/I/61i8Vjb17SL._AC_SX679_.jpg'
      ]
    }
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
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


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
      nombre: 'Filtros de aire', 
      precio: 2500, 
      categoria: 'Motor y Componentes', 
      descripcion: 'Potente laptop con procesador de última generación y pantalla HD.',
      imagenes: [
        'https://www.rodi.es/blog/wp-content/uploads/2018/03/filtro-aire-coche-revision.jpg',
      ]
    },
    { 
      nombre: 'Baterias', 
      precio: 1200, 
      categoria: 'Sistema Eléctrico y Electrónico', 
      descripcion: 'Teléfono inteligente con cámara de alta resolución y batería de larga duración.',
      imagenes: [
        'https://walmartsv.vtexassets.com/arquivos/ids/298572/Bateria-LTH-24r530-amp-12-v-1-4194.jpg?v=638145022476200000',
        
      ]
    },
    { 
      nombre: 'Radiadores', 
      precio: 800, 
      categoria: 'Enfriamiento y Calefacción', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://i5.walmartimages.com/seo/Ledkingdomus-Radiator-For-2010-2016-Chevy-Cruze-Eco-LTZ-LS-LT-1-4L-1-8L-Aluminum_670507b6-8abf-4307-8612-37c70465f223.6c569cfac453652d2f54e72b213ca67e.jpeg'
      ]
    },
    { 
      nombre: 'Llantas', 
      precio: 800, 
      categoria: 'Llantas y Rines', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://www.rojassa.com/wp-content/uploads/2014/10/medida-de-llantas-para-su-carro.jpg'
      ]
    },
    { 
      nombre: 'Faros delanteros', 
      precio: 800, 
      categoria: 'Iluminación y Carrocería', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://m.media-amazon.com/images/I/71dMY0fvyDL._AC_UF894,1000_QL80_.jpg'
      ]
    },
    { 
      nombre: 'Cajas de cambios', 
      precio: 800, 
      categoria: 'Transmisión y Embrague', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://static.motor.es/fotos-diccionario/2019/07//caja-de-cambios_1564050378.jpg'
      ]
    },
    { 
      nombre: 'Bombas de freno', 
      precio: 800, 
      categoria: 'Frenos y Seguridad', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnwUOWcio9OHJYqHu_1DWw0AZMxy6CgfsBWw&s'
      ]
    },
    { 
      nombre: 'Rótulas', 
      precio: 800, 
      categoria: 'Suspensión y Dirección', 
      descripcion: 'Tablet con pantalla táctil de 10 pulgadas y almacenamiento de 128GB.',
      imagenes: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTArwG26C4dQPYLCYCOz6lUuNN-Ccy-AQtdlg&s'
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


import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { RouterModule } from '@angular/router'; // 👈 Importa esto

@Component({
  selector: 'app-home',
  standalone: true, // 👈 importante
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterModule], // 👈 agrega esto
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  private countersInitialized = false;
  private backgroundInterval: any;
  private currentBgIndex = 0;

  // Array de imágenes de fondo para el hero
  private backgroundImages = [
    'https://www.namesnack.com/images/namesnack-auto-parts-supply-business-names-5996x3374-20200915.jpeg?crop=16:9,smart&width=1200&dpr=2',
    'https://media.istockphoto.com/id/1212230930/es/foto/piezas-del-motor-del-coche.jpg?s=612x612&w=0&k=20&c=daAYnYTg85HJyouT02HM_EHidoRp9UUaJJDnwFVmtbs=',
    'https://media.istockphoto.com/id/478107962/es/foto/auto-parts.jpg?s=612x612&w=0&k=20&c=fH2_LD5qLZHEagkxoc1jSZD-wPH8xr6jG4fWTh_E7zQ=',
    'https://media.istockphoto.com/id/1347150429/es/foto/mec%C3%A1nico-profesional-trabajando-en-el-motor-del-coche-en-el-garaje.jpg?s=612x612&w=0&k=20&c=hJdl6vyH7go842-F2-vnyueNQwlOMY-en-oSJOWKfqM=',
    'https://media.istockphoto.com/id/1150507732/es/foto/varias-piezas-de-autom%C3%B3viles-y-accesorios-sobre-fondo-negro.jpg?s=612x612&w=0&k=20&c=NM9tMNi6Pmlbs6B2i4_L95Yxr7XvXw7s9wyBabRYaxE='
  ];

  constructor() {}

  ngOnInit(): void {
    // Iniciar el carrusel de imágenes de fondo
    this.startBackgroundSlider();

    // Initialize counter animations when page loads
    window.addEventListener('load', () => {
      this.initCounters();
    });

    // Also initialize counters if the user scrolls to the stats section
    window.addEventListener('scroll', () => {
      const statsSection = document.querySelector('.stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible && !this.countersInitialized) {
          this.initCounters();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize Swiper with enhanced options
    new Swiper('.swiper', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruye
    if (this.backgroundInterval) {
      clearInterval(this.backgroundInterval);
    }
  }

  /**
   * Inicia el slider de imágenes de fondo que cambia cada 5 segundos
   */
  private startBackgroundSlider(): void {
    this.changeBackgroundImage();

    // Cambiar la imagen cada 5 segundos
    this.backgroundInterval = setInterval(() => {
      this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
      this.changeBackgroundImage();
    }, 5000);
  }

  /**
   * Cambia la imagen de fondo con una transición suave
   */
  private changeBackgroundImage(): void {
    const heroSection = document.querySelector('.hero-section') as HTMLElement;
    if (heroSection) {
      // Primero bajamos la opacidad
      heroSection.style.transition = 'background-image 1s ease-in-out';
      heroSection.style.backgroundImage = `url('${this.backgroundImages[this.currentBgIndex]}')`;
    }
  }

  /**
   * Animates the counter elements with a counting effect
   */
  private initCounters(): void {
    if (this.countersInitialized) {
      return; // Only initialize once
    }

    this.animateCounter('clientes-contador', 0, 5000, 2000);
    this.animateCounter('ventas-contador', 0, 12000, 2000);
    this.animateCounter('experiencia-contador', 0, 10, 1500);

    this.countersInitialized = true;
  }

  /**
   * Animates a counter from start to end value over a specified duration
   */
  private animateCounter(id: string, start: number, end: number, duration: number): void {
    const element = document.getElementById(id);
    if (!element) return;

    let current = start;
    const range = end - start;
    const increment = range / (duration / 50);
    const prefix = id === 'experiencia-contador' ? '' : '+';
    const suffix = id === 'experiencia-contador' ? ' años' : '';

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        element.textContent = `${prefix}${end}${suffix}`;
        clearInterval(timer);
      } else {
        element.textContent = `${prefix}${Math.floor(current)}${suffix}`;
      }
    }, 50);
  }
}

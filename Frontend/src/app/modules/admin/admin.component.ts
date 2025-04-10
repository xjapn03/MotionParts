import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  sidebarOpen = false;
  isDesktop = false;
  showWelcome = false; // Inicializar como false por defecto
  currentRoute = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkScreenSize();
    
    // Comprueba la ruta actual al inicio
    this.checkCurrentRoute(this.router.url);
    
    // Detectar cambios de ruta para controlar el mensaje de bienvenida
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkCurrentRoute(event.url);
    });
  }
  
  // Método para verificar la ruta actual
  checkCurrentRoute(url: string) {
    this.currentRoute = url;
    // Mostrar el mensaje de bienvenida SOLO cuando estemos exactamente en /admin
    this.showWelcome = (this.currentRoute === '/admin');
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  // Para cerrar el sidebar al hacer scroll en móviles
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Solo en dispositivos móviles
    if (!this.isDesktop) {
      this.closeSidebar();
    }
  }

  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 1024;
    
    // En modo escritorio, siempre mostrar el sidebar
    if (this.isDesktop) {
      this.sidebarOpen = true;
    }
  }

  openSidebar() {
    this.sidebarOpen = true;
  }

  closeSidebar() {
    if (!this.isDesktop) {
      this.sidebarOpen = false;
    }
  }
  
  // Método para navegar a una ruta
  navigateTo(route: string) {
    this.router.navigate([route]);
    
    // En dispositivos móviles, cerrar el sidebar después de la navegación
    if (!this.isDesktop) {
      this.closeSidebar();
    }
  }
}
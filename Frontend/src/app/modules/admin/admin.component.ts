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
  showWelcome = true;
  currentRoute = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkScreenSize();
    
    // Detectar cambios de ruta para controlar el mensaje de bienvenida
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      
      // Mostrar el mensaje de bienvenida solo cuando estemos en /admin
      if (this.currentRoute === '/admin') {
        this.showWelcome = true;
      } else {
        this.showWelcome = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
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
  
  // Método para navegar a una ruta y ocultar el mensaje de bienvenida
  navigateTo(route: string) {
    this.showWelcome = false;
    this.router.navigate([route]);
    
    // En dispositivos móviles, cerrar el sidebar después de la navegación
    if (!this.isDesktop) {
      this.closeSidebar();
    }
  }
}
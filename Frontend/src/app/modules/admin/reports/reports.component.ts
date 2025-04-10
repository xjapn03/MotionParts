// Actualiza la lógica en reports.component.ts para garantizar que 
// los datos para los gráficos se generen correctamente

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  registrationDate: Date;
  lastLogin: Date;
}

interface SaleData {
  month: string;
  revenue: number;
  transactions: number;
}

interface PageVisit {
  page: string;
  views: number;
  uniqueVisitors: number;
}

interface ChartDataPoint {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  // Exponer Math para usarlo en la plantilla
  Math = Math;
  
  // Datos para métricas
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;
  newUsersToday: number = 0;
  totalPageVisits: number = 0;
  totalSales: number = 0;
  revenueThisMonth: number = 0;
  
  // Datos para gráficos
  userRegistrationData: ChartDataPoint[] = [];
  userStatusData: ChartDataPoint[] = [];
  salesData: SaleData[] = [];
  pageVisitsData: PageVisit[] = [];
  
  // Variables para los valores máximos de los gráficos
  maxUserRegistration: number = 0;
  maxSalesRevenue: number = 0;
  
  // Estado UI
  isLoading: boolean = true;
  showMobileFilters: boolean = false;
  selectedTimeRange: string = 'month';
  
  // Métodos auxiliares para cálculos SVG
  getActiveArc(): string {
    const ratio = this.activeUsers / (this.activeUsers + this.inactiveUsers);
    return `M 50 50 L 50 0 A 50 50 0 ${ratio > 0.5 ? 1 : 0} 1 ${50 + 50 * Math.sin(2 * Math.PI * ratio)} ${50 - 50 * Math.cos(2 * Math.PI * ratio)} Z`;
  }
  
  getInactiveArc(): string {
    const ratio = this.activeUsers / (this.activeUsers + this.inactiveUsers);
    return `M 50 50 L ${50 + 50 * Math.sin(2 * Math.PI * ratio)} ${50 - 50 * Math.cos(2 * Math.PI * ratio)} A 50 50 0 ${ratio > 0.5 ? 0 : 1} 1 50 0 Z`;
  }
  
  // Método para calcular la altura relativa de las barras de registro de usuarios
  getUserRegistrationHeight(value: number): string {
    if (this.maxUserRegistration === 0) return '0%';
    return (value / this.maxUserRegistration) * 100 + '%';
  }
  
  // Método para calcular la altura relativa de las barras de ventas
  getSalesBarHeight(revenue: number): string {
    if (this.maxSalesRevenue === 0) return '0%';
    return (revenue / this.maxSalesRevenue) * 100 + '%';
  }
  
  constructor() {}

  ngOnInit(): void {
    // Simular carga de datos
    setTimeout(() => {
      this.loadMockData();
      this.isLoading = false;
    }, 800);
  }

  loadMockData(): void {
    // Generar datos de usuarios
    const users = this.generateMockUsers(100);
    this.totalUsers = users.length;
    this.activeUsers = users.filter(u => u.status === 'active').length;
    this.inactiveUsers = this.totalUsers - this.activeUsers;
    this.newUsersToday = users.filter(u => {
      const today = new Date();
      return u.registrationDate.toDateString() === today.toDateString();
    }).length;

    // Datos para el gráfico de estado de usuarios
    this.userStatusData = [
      { name: 'Activos', value: this.activeUsers },
      { name: 'Inactivos', value: this.inactiveUsers }
    ];
    
    // Generar datos de registro de usuarios por mes
    this.userRegistrationData = this.generateUserRegistrationData();
    // Calculamos el valor máximo para escalar el gráfico correctamente
    this.maxUserRegistration = Math.max(...this.userRegistrationData.map(item => item.value));
    
    // Generar datos de ventas
    this.salesData = this.generateMockSalesData();
    this.totalSales = this.salesData.reduce((sum, item) => sum + item.transactions, 0);
    this.revenueThisMonth = this.salesData[this.salesData.length - 1].revenue;
    // Calculamos el valor máximo para escalar el gráfico correctamente
    this.maxSalesRevenue = Math.max(...this.salesData.map(item => item.revenue));
    
    // Generar datos de visitas a páginas
    this.pageVisitsData = this.generateMockPageVisits();
    this.totalPageVisits = this.pageVisitsData.reduce((sum, item) => sum + item.views, 0);
  }

  generateMockUsers(count: number): User[] {
    const users: User[] = [];
    const now = new Date();
    
    for (let i = 1; i <= count; i++) {
      const registrationDate = new Date(now);
      registrationDate.setDate(now.getDate() - Math.floor(Math.random() * 60));
      
      const lastLogin = new Date(registrationDate);
      lastLogin.setDate(registrationDate.getDate() + Math.floor(Math.random() * 30));
      
      users.push({
        id: i,
        name: `Usuario ${i}`,
        email: `usuario${i}@example.com`,
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        registrationDate,
        lastLogin
      });
    }
    
    return users;
  }

  generateUserRegistrationData(): ChartDataPoint[] {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const data: ChartDataPoint[] = [];
    
    const currentMonth = new Date().getMonth();
    
    // Generar datos para los últimos 6 meses con valores más significativos
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      data.push({
        name: months[monthIndex],
        value: Math.floor(Math.random() * 40) + 10
      });
    }
    
    return data;
  }

  generateMockSalesData(): SaleData[] {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const data: SaleData[] = [];
    
    const currentMonth = new Date().getMonth();
    
    // Generar datos para los últimos 6 meses con ventas progresivas para una mejor visualización
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      // Generamos números más variados para mejor visualización
      data.push({
        month: months[monthIndex],
        revenue: Math.floor(Math.random() * 10000) + 5000,
        transactions: Math.floor(Math.random() * 200) + 50
      });
    }
    
    return data;
  }

  generateMockPageVisits(): PageVisit[] {
    return [
      { page: 'Página de inicio', views: 12500, uniqueVisitors: 8200 },
      { page: 'Catálogo de productos', views: 9800, uniqueVisitors: 6100 },
      { page: 'Página de ofertas', views: 7400, uniqueVisitors: 5300 },
      { page: 'Blog', views: 4300, uniqueVisitors: 3200 },
      { page: 'Contacto', views: 3200, uniqueVisitors: 2800 }
    ];
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;
    this.isLoading = true;
    
    // Simular carga de datos con el nuevo rango de tiempo
    setTimeout(() => {
      this.loadMockData();
      this.isLoading = false;
      this.showMobileFilters = false;
    }, 500);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('es-ES').format(num);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'Col' }).format(amount);
  }
  
  // Método para calcular el promedio de tiempo
  getAverageTime(views: number, visitors: number): number {
    return Math.round(views / visitors * 60);
  }
}
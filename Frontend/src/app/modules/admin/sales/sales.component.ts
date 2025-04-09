  import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
  import { Chart, registerables } from 'chart.js';
  import { DatePipe } from '@angular/common';
  import { CommonModule } from '@angular/common';

  // Registrar todos los componentes necesarios de Chart.js
  Chart.register(...registerables);

  interface Sale {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
    date: Date;
    productId: number;
  }

  interface ProductSummary {
    id: number;
    name: string;
    quantity: number;
    revenue: number;
  }

  @Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.scss',
    imports: [CommonModule],
    providers: [DatePipe]
  })
  export class SalesComponent implements OnInit, AfterViewInit {
    @ViewChild('salesChart') salesChartCanvas!: ElementRef;
    @ViewChild('productChart') productChartCanvas!: ElementRef;
    
    // Mock data
    allSales: Sale[] = [];
    
    // Filtered data
    filteredSales: Sale[] = [];
    
    // Summary data
    topSellingProducts: ProductSummary[] = [];
    leastSellingProducts: ProductSummary[] = [];
    totalProductsSold: number = 0;
    totalRevenue: number = 0;
    
    // Charts
    salesChart: Chart | undefined;
    productChart: Chart | undefined;
    
    // Filtros
    selectedFilter: string = 'week';
    startDate: Date = new Date();
    endDate: Date = new Date();
    
    constructor(private datePipe: DatePipe) {}

    ngOnInit(): void {
      this.generateMockData();
      this.applyFilter();
    }
    
    ngAfterViewInit(): void {
      setTimeout(() => {
        this.initCharts();
      }, 0);
    }
    
    generateMockData(): void {
      const productNames = [
        'Laptop HP 15"', 'Monitor Samsung 24"', 'Teclado Mecánico', 
        'Mouse Inalámbrico', 'Audífonos Bluetooth', 'Impresora Láser', 
        'Webcam HD', 'Disco Duro SSD 1TB', 'Memoria RAM 16GB', 'Tablet 10"'
      ];
      
      // Generar datos para los últimos 30 días
      for (let i = 0; i < 100; i++) {
        const productIndex = Math.floor(Math.random() * productNames.length);
        const quantity = Math.floor(Math.random() * 5) + 1;
        const price = Math.floor(Math.random() * 1000) + 100;
        
        // Fecha aleatoria en los últimos 30 días
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        
        this.allSales.push({
          id: i + 1,
          name: productNames[productIndex],
          quantity: quantity,
          price: price,
          total: quantity * price,
          date: date,
          productId: productIndex + 1
        });
      }
      
      // Ordenar por fecha descendente
      this.allSales.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    
    applyFilter(): void {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      this.endDate = new Date(today);
      
      switch (this.selectedFilter) {
        case 'day':
          this.startDate = new Date(today);
          this.startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          this.startDate = new Date(today);
          this.startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          this.startDate = new Date(today);
          this.startDate.setMonth(today.getMonth() - 1);
          break;
        default:
          this.startDate = new Date(today);
          this.startDate.setDate(today.getDate() - 7);
      }
      
      this.filterSales();
      this.calculateSummaries();
      this.updateCharts();
    }
    
    setCustomDateRange(startDate: Date, endDate: Date): void {
      this.startDate = new Date(startDate);
      this.endDate = new Date(endDate);
      this.filterSales();
      this.calculateSummaries();
      this.updateCharts();
    }
    
    filterSales(): void {
      this.filteredSales = this.allSales.filter(sale => {
        return sale.date >= this.startDate && sale.date <= this.endDate;
      });
    }
    
    calculateSummaries(): void {
      // Calcular total de productos vendidos y total de ingresos
      this.totalProductsSold = this.filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
      this.totalRevenue = this.filteredSales.reduce((sum, sale) => sum + sale.total, 0);
      
      // Agrupar por producto
      const productSummary = new Map<number, ProductSummary>();
      
      this.filteredSales.forEach(sale => {
        if (productSummary.has(sale.productId)) {
          const product = productSummary.get(sale.productId);
          if (product) {
            product.quantity += sale.quantity;
            product.revenue += sale.total;
          }
        } else {
          productSummary.set(sale.productId, {
            id: sale.productId,
            name: sale.name,
            quantity: sale.quantity,
            revenue: sale.total
          });
        }
      });
      
      // Convertir a array y ordenar
      const productArray = Array.from(productSummary.values());
      
      // Productos más vendidos (por cantidad)
      this.topSellingProducts = [...productArray]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      
      // Productos menos vendidos (por cantidad)
      this.leastSellingProducts = [...productArray]
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5);
    }
    
    initCharts(): void {
      // Crear el gráfico de ventas por fecha
      this.createSalesChart();
      
      // Crear el gráfico de productos
      this.createProductChart();
    }
    
    updateCharts(): void {
      if (this.salesChart) {
        this.salesChart.destroy();
      }
      
      if (this.productChart) {
        this.productChart.destroy();
      }
      
      setTimeout(() => {
        this.createSalesChart();
        this.createProductChart();
      }, 0);
    }
    
    createSalesChart(): void {
      if (!this.salesChartCanvas?.nativeElement) return;
      
      // Agrupar ventas por día
      const salesByDate = new Map<string, number>();
      
      this.filteredSales.forEach(sale => {
        const dateStr = this.datePipe.transform(sale.date, 'yyyy-MM-dd') as string;
        if (salesByDate.has(dateStr)) {
          salesByDate.set(dateStr, (salesByDate.get(dateStr) || 0) + sale.total);
        } else {
          salesByDate.set(dateStr, sale.total);
        }
      });
      
      // Ordenar las fechas
      const sortedDates = Array.from(salesByDate.keys()).sort();
      
      const labels = sortedDates.map(date => this.datePipe.transform(date, 'dd/MM/yyyy'));
      const data = sortedDates.map(date => salesByDate.get(date) || 0);
      
      this.salesChart = new Chart(this.salesChartCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Ventas Diarias',
            data: data,
            backgroundColor: 'rgba(147, 51, 234, 0.2)',
            borderColor: 'rgba(147, 51, 234, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Ventas en el Periodo Seleccionado',
              font: {
                size: 16
              }
            },
            legend: {
              position: 'top' as const
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Ventas ($)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Fecha'
              }
            }
          }
        }
      });
    }
    
    createProductChart(): void {
      if (!this.productChartCanvas?.nativeElement) return;
      
      // Tomar los 5 productos más vendidos para el gráfico
      const labels = this.topSellingProducts.map(p => p.name);
      const quantityData = this.topSellingProducts.map(p => p.quantity);
      const revenueData = this.topSellingProducts.map(p => p.revenue);
      
      this.productChart = new Chart(this.productChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cantidad Vendida',
              data: quantityData,
              backgroundColor: 'rgba(147, 51, 234, 0.6)',
              borderColor: 'rgba(147, 51, 234, 1)',
              borderWidth: 1
            },
            {
              label: 'Ingresos ($)',
              data: revenueData,
              backgroundColor: 'rgba(56, 189, 248, 0.6)',
              borderColor: 'rgba(56, 189, 248, 1)',
              borderWidth: 1,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Productos Más Vendidos',
              font: {
                size: 16
              }
            },
            legend: {
              position: 'top' as const
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad'
              }
            },
            y1: {
              beginAtZero: true,
              position: 'right' as const,
              title: {
                display: true,
                text: 'Ingresos ($)'
              },
              grid: {
                drawOnChartArea: false
              }
            },
            x: {
              title: {
                display: true,
                text: 'Producto'
              }
            }
          }
        }
      });
    }
    
    // Función para aplicar filtro con fechas personalizadas
    applyCustomFilter(startDateStr: string, endDateStr: string): void {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        endDate.setHours(23, 59, 59, 999);
        this.setCustomDateRange(startDate, endDate);
      }
    }
  }

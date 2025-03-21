import { Component, AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions, Chart } from 'chart.js';

@Component({
  selector: 'app-sales',
  imports: [CommonModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements AfterViewInit {
  selectedFilter: 'day' | 'week' | 'month' = 'day';
  totalProductsSold: number = 0;
  totalRevenue: number = 0;
  filteredSales: any[] = [];

  salesData = [
    { name: 'Filtro de aceite', price: 50000, quantity: 15, date: new Date() },
    { name: 'Batería 12V', price: 200000, quantity: 8, date: new Date() },
    { name: 'Pastillas de freno', price: 150000, quantity: 10, date: new Date() },
    { product: 'Bujía', quantity: 5, price: 30, date: new Date() },
    { product: 'Pastillas de freno', quantity: 2, price: 100, date: new Date() }
  ];

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Ventas por Producto',
      data: [],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
    }]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true
  };

  constructor() {
    this.applyFilter();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  applyFilter() {
    const now = new Date();
    this.filteredSales = this.salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      if (this.selectedFilter === 'day') {
        return saleDate.toDateString() === now.toDateString();
      } else if (this.selectedFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return saleDate >= weekAgo;
      } else {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return saleDate >= monthAgo;
      }
    });

    this.totalProductsSold = this.filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
    this.totalRevenue = this.filteredSales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);

    this.updateChartData();
  }

  updateChartData() {
    this.chartData.labels = this.filteredSales.map(sale => sale.name || sale.product);
    this.chartData.datasets[0].data = this.filteredSales.map(sale => sale.quantity);
    this.createChart();
  }

  createChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: this.chartData,
      options: this.chartOptions
    });
  }

  cambiarFiltro(filtro: 'day' | 'week' | 'month') {
    this.selectedFilter = filtro;
    this.applyFilter();
  }

  get topSellingProducts() {
    return [...this.salesData].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }

  get leastSellingProducts() {
    return [...this.salesData].sort((a, b) => a.quantity - b.quantity).slice(0, 5);
  }
}

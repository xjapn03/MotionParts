import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ⬅ Importar CommonModule


@Component({
  selector: 'app-invoices',
  imports: [ CommonModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent implements OnInit {
  invoices = [
    {
      id: 'INV-001',
      date: '2025-03-20',
      customer: 'Juan Pérez',
      items: [
        { description: 'Frenos de disco', price: 50 },
        { description: 'Bujías', price: 15 },
      ],
      total: 65,
      shippingAddress: 'Calle Ficticia 123, Ciudad X',
      paymentMethod: 'Tarjeta de Crédito'
    },
    {
      id: 'INV-002',
      date: '2025-03-21',
      customer: 'Carlos Díaz',
      items: [
        { description: 'Aceite motor', price: 30 },
        { description: 'Filtro de aire', price: 10 },
      ],
      total: 40,
      shippingAddress: 'Avenida Principal 456, Ciudad Y',
      paymentMethod: 'PayPal'
    }
  ];

  // Aquí declaramos el objeto `showDetails` como un objeto vacío
  showDetails: { [key: string]: boolean } = {};

  constructor() { }

  ngOnInit(): void {
    // Inicializamos el estado de visibilidad de los detalles de cada factura
    this.invoices.forEach(invoice => {
      this.showDetails[invoice.id] = false; // Por defecto, los detalles están ocultos
    });
  }

  toggleDetails(invoiceId: string): void {
    // Alternar la visibilidad de los detalles de la factura
    this.showDetails[invoiceId] = !this.showDetails[invoiceId];
  }
}

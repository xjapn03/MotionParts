import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class FaqComponent {
  faqItems = [
    { 
      question: '¿Cómo sé si una pieza es compatible con mi vehículo?', 
      answer: 'Puedes usar nuestro buscador de compatibilidad ingresando la marca, modelo y año de tu vehículo. El sistema te mostrará todas las piezas compatibles disponibles en nuestro catálogo.', 
      open: false 
    },
    { 
      question: '¿Cuál es el tiempo de entrega de los productos?', 
      answer: 'El tiempo de entrega estándar es de 3 a 5 días hábiles para zonas urbanas y de 5 a 8 días para zonas rurales o alejadas. Ofrecemos seguimiento en tiempo real de tu pedido.', 
      open: false 
    },
    { 
      question: '¿Ofrecen garantía en sus autopartes?', 
      answer: 'Sí, todas nuestras autopartes cuentan con garantía de fabricación. Dependiendo del producto, la garantía puede variar entre 6 meses y 2 años. Puedes revisar los detalles específicos en la descripción de cada producto.', 
      open: false 
    },
    { 
      question: '¿Tienen servicio de instalación?', 
      answer: 'Sí, contamos con una red de talleres asociados donde puedes programar la instalación de las piezas que compres con nosotros. Este servicio tiene un costo adicional que varía según la complejidad de la instalación.', 
      open: false 
    },
    { 
      question: '¿Puedo devolver una pieza si no me sirve?', 
      answer: 'Ofrecemos política de devolución de 30 días para productos sin usar y en su empaque original. Para piezas que no sean compatibles con tu vehículo, cubrimos el costo de envío de la devolución.', 
      open: false 
    },
    { 
      question: '¿Venden repuestos originales y alternativos?', 
      answer: 'Sí, ofrecemos tanto repuestos originales (OEM) como alternativas aftermarket de alta calidad. En cada producto indicamos claramente si es original o alternativo para que puedas elegir según tus necesidades y presupuesto.', 
      open: false 
    }
  ];

  contactForm = {
    name: '',
    email: '',
    question: ''
  };

  toggleFAQ(index: number) {
    // Cierra todas las demás preguntas
    this.faqItems.forEach((item, i) => {
      if (i !== index) item.open = false;
    });
    
    // Abre/cierra la pregunta seleccionada
    this.faqItems[index].open = !this.faqItems[index].open;
  }

  submitQuestion() {
    // Aquí iría la lógica para enviar la pregunta
    console.log('Pregunta enviada:', this.contactForm);
    
    // Reset del formulario después de enviar
    this.contactForm = {
      name: '',
      email: '',
      question: ''
    };
    
    // Aquí podrías mostrar un mensaje de confirmación
    alert('¡Gracias por tu pregunta! Te responderemos a la brevedad.');
  }
}
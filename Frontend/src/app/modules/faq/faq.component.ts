import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqItems = [
    { question: '¿Qué es este servicio?', answer: 'Este servicio proporciona asistencia sobre tecnología, programación y automatización.', open: false },
    { question: '¿Cómo puedo hacer una pregunta?', answer: 'Escribe tu pregunta en el chat y recibirás una respuesta detallada.', open: false },
    { question: '¿En qué temas puedes ayudarme?', answer: 'Puedo ayudarte con programación (Python, SQL, Power BI, automatización, etc.), tecnología y más.', open: false },
    { question: '¿Cuánto tiempo tardas en responder?', answer: 'Las respuestas suelen ser inmediatas, pero pueden tardar más si la pregunta es compleja.', open: false },
    { question: '¿Cómo puedo mejorar mis preguntas?', answer: 'Sé claro y específico, proporciona ejemplos o detalles sobre tu problema para obtener una mejor respuesta.', open: false },
    { question: '¿Es este servicio gratuito?', answer: 'Sí, puedes hacer preguntas sin costo alguno.', open: false }
  ];

  toggleFAQ(index: number) {
    this.faqItems[index].open = !this.faqItems[index].open;
  }
}


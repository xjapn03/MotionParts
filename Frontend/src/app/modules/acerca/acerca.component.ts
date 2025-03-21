import { Component } from '@angular/core';

@Component({
  selector: 'app-acerca',
  imports: [],
  templateUrl: './acerca.component.html',
  styleUrl: './acerca.component.css'
})
export class AcercaComponent {

  // Método para abrir un archivo en una nueva pestaña
  openInNewTab(filePath: string): void {
    const url = `assets/${filePath}`;  // Ruta al archivo dentro de la carpeta assets
    window.open(url, '_blank');
  }
}

import { Component, Input, OnChanges } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-buscar-actividades',
  imports: [
    NgForOf,
    NgIf
  ],
  standalone: true,
  templateUrl: './buscar-actividades.component.html'
})
export class BuscarActividadesComponent {
  @Input() query: string = '';
  resultadosFiltrados: any[] = [];

  actividades = [
    { titulo: 'Senderismo en los Andes' },
    { titulo: 'Clase de cocina italiana' },
    { titulo: 'Maratón de lectura' },
  ];

  ngOnChanges() {
    this.resultadosFiltrados = this.actividades.filter(act =>
      act.titulo.toLowerCase().includes(this.query.toLowerCase())
    );
  }
}

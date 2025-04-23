import { Component, Input, OnChanges } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-buscar-grupos',
  imports: [
    NgIf,
    NgForOf
  ],
  standalone: true,
  templateUrl: './buscar-grupos.component.html'
})
export class BuscarGruposComponent {
  @Input() query: string = '';
  resultadosFiltrados: any[] = [];

  grupos = [
    { nombre: 'Amantes del café' },
    { nombre: 'Club de lectura' },
    { nombre: 'Programadores Full Stack' },
  ];

  ngOnChanges() {
    this.resultadosFiltrados = this.grupos.filter(grupo =>
      grupo.nombre.toLowerCase().includes(this.query.toLowerCase())
    );
  }
}

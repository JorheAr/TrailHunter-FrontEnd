import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaceriaService } from '../../services/caceria.service';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-buscar-actividades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginatorModule,
    CardModule,
    ProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './buscar-actividades.component.html'
})
export class BuscarActividadesComponent implements OnInit {
  actividadesTotales: any[] = [];
  resultadosFiltrados: any[] = [];
  loading: boolean = true;

  page: number = 0;
  rows: number = 6;
  totalRecords: number = 0;

  private _query: string = '';
  @Input()
  set query(value: string) {
    this._query = value;
    this.page = 0;
    this.aplicarFiltroYPaginacion();
  }
  get query(): string {
    return this._query;
  }

  @Input() categoria: string | null = null;
  @Input() fecha: Date | null = null;

  constructor(private caceriaService: CaceriaService) {}

  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades(): void {
    this.loading = true;
    this.caceriaService.obtenerTodas().subscribe({
      next: (actividades) => {
        this.actividadesTotales = actividades;
        this.aplicarFiltroYPaginacion();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener actividades', err);
        this.loading = false;
      }
    });
  }

  aplicarFiltroYPaginacion(): void {
    let filtradas = this.actividadesTotales;

    if (this.query) {
      filtradas = filtradas.filter(a =>
        a.titulo.toLowerCase().includes(this.query.toLowerCase())
      );
    }

    if (this.categoria) {
      filtradas = filtradas.filter(a =>
        a.categoria === this.categoria
      );
    }

    if (this.fecha) {
      filtradas = filtradas.filter(a =>
        new Date(a.fecha).toDateString() === this.fecha!.toDateString()
      );
    }

    this.totalRecords = filtradas.length;

    const start = this.page * this.rows;
    const end = start + this.rows;
    this.resultadosFiltrados = filtradas.slice(start, end);
  }

  onPageChange(event: any): void {
    this.page = event.page;
    this.aplicarFiltroYPaginacion();
  }
}

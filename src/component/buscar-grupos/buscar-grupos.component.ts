import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../services/group.service';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-buscar-grupos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginatorModule,
    CardModule,
    ProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './buscar-grupos.component.html'
})
export class BuscarGruposComponent implements OnInit {
  gruposTotales: any[] = [];
  resultadosFiltrados: any[] = [];
  loading: boolean = true;

  page: number = 0;
  rows: number = 12;
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

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.loading = true;
    this.groupService.obtenerTodosLosGrupos().subscribe({
      next: (grupos) => {
        this.gruposTotales = grupos;
        this.aplicarFiltroYPaginacion();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener grupos', err);
        this.loading = false;
      }
    });
  }

  aplicarFiltroYPaginacion(): void {
    let filtrados = this.gruposTotales;

    if (this.query) {
      filtrados = filtrados.filter(g =>
        g.nombre.toLowerCase().includes(this.query.toLowerCase())
      );
    }

    this.totalRecords = filtrados.length;

    const start = this.page * this.rows;
    const end = start + this.rows;
    this.resultadosFiltrados = filtrados.slice(start, end);
  }

  onPageChange(event: any): void {
    this.page = event.page;
    this.aplicarFiltroYPaginacion();
  }
}

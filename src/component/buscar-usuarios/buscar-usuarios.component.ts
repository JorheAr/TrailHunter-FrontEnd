import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ButtonDirective } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SimpleChanges } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-buscar-usuarios',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ButtonDirective,
    PaginatorModule,
    ProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './buscar-usuarios.component.html'
})
export class BuscarUsuariosComponent implements OnInit, OnChanges {
  @Input() query: string = '';
  @Input() cache: any[] | null = null;
  @Input() cargando: boolean = false;
  @Output() onLoad = new EventEmitter<any[]>();
  @Output() loadTrigger = new EventEmitter<void>();

  resultadosFiltrados: any[] = [];
  usuarios: any[] = [];
  paginacionResult: any[] = [];
  currentPage: number = 0;
  rows: number = 20;
  totalRecords: number = 0;
  first: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.cache) {
      this.usuarios = this.cache;
      this.filtrarResultados();
    } else {
      this.loadTrigger.emit();
      this.cargarUsuarios();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['query'] || changes['cache']) {
      this.filtrarResultados();
    }
  }

  cargarUsuarios(): void {
    this.userService.getUsuarios().subscribe((response) => {
      this.usuarios = response.usuarios.map((usuario: any) => ({
        ...usuario,
        avatar: `https://api.dicebear.com/6.x/lorelei-neutral/svg?seed=${usuario.username}`
      }));
      this.totalRecords = this.usuarios.length;
      this.onLoad.emit(this.usuarios);
      this.filtrarResultados();
    });
  }

  filtrarResultados(): void {
    this.resultadosFiltrados = this.usuarios.filter((usuario) =>
      usuario.username.toLowerCase().includes(this.query.toLowerCase())
    );
    this.totalRecords = this.resultadosFiltrados.length;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    const start = this.first;
    const end = start + this.rows;
    this.paginacionResult = this.resultadosFiltrados.slice(start, end);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.currentPage = event.page;
    this.actualizarPaginacion();
  }

  seguirUsuario(userId: number): void {
    this.actualizarEstadoSeguir(userId, true);
    this.userService.followUser(userId).subscribe(() => {}, error => {
      this.actualizarEstadoSeguir(userId, false);
    });
  }

  dejarDeSeguirUsuario(userId: number): void {
    this.actualizarEstadoSeguir(userId, false);
    this.userService.unfollowUser(userId).subscribe(() => {}, error => {
      this.actualizarEstadoSeguir(userId, true);
    });
  }

  actualizarEstadoSeguir(userId: number, seguir: boolean): void {
    const usuario = this.usuarios.find((user) => user.id === userId);
    if (usuario) usuario.is_following = seguir;
    const resultado = this.resultadosFiltrados.find((user) => user.id === userId);
    if (resultado) resultado.is_following = seguir;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, InputText, FormsModule, ProgressSpinner],
  providers: [MessageService],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  filtroGlobal: string = '';
  usuarios: any[] = [];
  isLoading: boolean = true; // Variable para manejar el estado de carga
  private usuariosCargados: boolean = false; // Variable de control para la carga de datos

  @ViewChild('dt') tabla!: Table;

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    // Cargar los usuarios solo una vez
    if (!this.usuariosCargados) {
      this.cargarUsuarios();
    }
  }

  cargarUsuarios(): void {
    this.isLoading = true; // Activar el spinner
    this.userService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.usuarios;
        this.isLoading = false; // Desactivar el spinner cuando termine de cargar
        this.usuariosCargados = true; // Marcar que los usuarios se han cargado
      },
      error: () => {
        this.isLoading = false; // Desactivar el spinner en caso de error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios'
        });
      }
    });
  }

  aplicarFiltroGlobal(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.tabla.filterGlobal(input.value, 'contains');
    }
  }

  eliminarUsuario(id: number): void {
    const usuarioEliminado = this.usuarios.find(usuario => usuario.id === id);

    if (usuarioEliminado) {
      // Filtrar y eliminar el usuario
      this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);

      // Mostrar el mensaje de éxito
      this.messageService.add({
        severity: 'success',
        summary: 'Usuario eliminado',
        detail: `Usuario ${usuarioEliminado.username} eliminado correctamente`
      });
    }
  }

}

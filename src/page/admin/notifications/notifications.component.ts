import { Component, OnInit } from '@angular/core';
import { ContactoService, MensajeContacto } from '../../../services/contacto.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    FormsModule,
    SelectButtonModule
  ],
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  mensajes: MensajeContacto[] = [];
  mensajesFiltrados: MensajeContacto[] = [];
  error: string | null = null;
  cargando = true;

  filtroOpciones = [
    { name: 'Todos', value: 'todos' },
    { name: 'Leídos', value: 'leidos' },
    { name: 'No leídos', value: 'no_leidos' }
  ];
  filtroSeleccionado: string = 'todos';

  constructor(private contactoService: ContactoService) {}

  ngOnInit() {
    this.cargarMensajes();
  }

  cargarMensajes() {
    this.cargando = true;
    this.error = null;
    this.contactoService.obtenerMensajes().subscribe({
      next: (mensajes) => {
        this.mensajes = mensajes;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al cargar los mensajes';
        this.cargando = false;
      }
    });
  }

  aplicarFiltro() {
    switch (this.filtroSeleccionado) {
      case 'leidos':
        this.mensajesFiltrados = this.mensajes.filter(m => m.leido);
        break;
      case 'no_leidos':
        this.mensajesFiltrados = this.mensajes.filter(m => !m.leido);
        break;
      default:
        this.mensajesFiltrados = [...this.mensajes];
    }
  }

  marcarComoLeido(mensaje: MensajeContacto) {
    this.contactoService.marcarLeido(mensaje.id).subscribe({
      next: () => {
        mensaje.leido = true;
        this.aplicarFiltro();
      },
      error: () => {
        this.error = 'No se pudo marcar el mensaje como leído.';
      }
    });
  }
}

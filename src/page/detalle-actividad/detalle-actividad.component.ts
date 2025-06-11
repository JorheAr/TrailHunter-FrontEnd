import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaceriaService } from '../../services/caceria.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import {Toast} from 'primeng/toast'; // Para ngModel

@Component({
  selector: 'app-detalle-actividad',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressBarModule, ProgressSpinnerModule, FormsModule, Toast],
  providers: [MessageService],
  templateUrl: './detalle-actividad.component.html'
})
export class DetalleActividadComponent implements OnInit {
  actividad: any = null;
  loading = true;
  inscribiendo = false;
  desinscribiendo = false;
  estaInscrito = false;

  comentarios: { autor: string; texto: string; fecha: string }[] = [];
  nuevoComentario = '';
  enviandoComentario = false;

  constructor(
    private route: ActivatedRoute,
    private caceriaService: CaceriaService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarActividad(+id);
      this.cargarComentarios(+id);
    } else {
      this.loading = false;
    }
  }

  cargarActividad(id: number) {
    this.loading = true;
    this.caceriaService.obtenerTodas().subscribe({
      next: (actividades) => {
        this.actividad = actividades.find((a: any) => a.id === id) || null;
        if (this.actividad) {
          this.checkInscripcion();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener actividad', err);
        this.loading = false;
      }
    });
  }

  cargarComentarios(id: number) {
    this.caceriaService.obtenerComentarios(id).subscribe({
      next: (comentarios) => {
        this.comentarios = comentarios.map((c: any) => ({
          autor: c.autor || 'Anónimo',
          texto: c.texto,
          fecha: this.formatearFecha(c.fecha)
        }));
      },
      error: (err) => {
        console.error('Error al cargar comentarios', err);
      }
    });
  }

  checkInscripcion() {
    this.caceriaService.obtenerMisActividades().subscribe({
      next: (misActividades) => {
        this.estaInscrito = misActividades.some((a: any) => a.id === this.actividad.id);
      },
      error: (err) => {
        console.error('Error al obtener mis actividades', err);
      }
    });
  }

  porcentajeLleno(): number {
    if (!this.actividad) return 0;
    return (this.actividad.inscritos / this.actividad.cupo_maximo) * 100;
  }

  puedeInscribirse(): boolean {
    return this.actividad && this.actividad.inscritos < this.actividad.cupo_maximo;
  }

  inscribirse() {
    if (!this.actividad) return;
    this.inscribiendo = true;
    this.caceriaService.inscribirse(this.actividad.id).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Inscripción', detail:'Te has inscrito correctamente.'});
        this.actividad.inscritos += 1;
        this.estaInscrito = true;
        this.inscribiendo = false;
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo inscribir. Intenta más tarde.'});
        console.error('Error inscribiéndose', err);
        this.inscribiendo = false;
      }
    });
  }

  desinscribirse() {
    if (!this.actividad) return;
    this.desinscribiendo = true;
    this.caceriaService.desinscribirse(this.actividad.id).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Inscripción', detail:'Te has desinscrito correctamente.'});
        this.actividad.inscritos = Math.max(0, this.actividad.inscritos - 1);
        this.estaInscrito = false;
        this.desinscribiendo = false;
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo quitar la inscripción. Intenta más tarde.'});
        console.error('Error desinscribiéndose', err);
        this.desinscribiendo = false;
      }
    });
  }

  enviarComentario(event: Event) {
    event.preventDefault();
    if (!this.nuevoComentario.trim() || !this.actividad) return;

    this.enviandoComentario = true;

    this.caceriaService.comentarActividad(this.actividad.id, this.nuevoComentario.trim()).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Comentario', detail:'Comentario agregado correctamente.'});
        this.nuevoComentario = '';
        this.cargarComentarios(this.actividad.id);
        this.enviandoComentario = false;
      },
      error: (err) => {
        console.error('Error al enviar comentario', err);
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo enviar el comentario.'});
        this.enviandoComentario = false;
      }
    });
  }

  private formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diferenciaMs = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diferenciaMs / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Publicado hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Publicado hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Publicado hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Publicado hace unos segundos';
  }
}

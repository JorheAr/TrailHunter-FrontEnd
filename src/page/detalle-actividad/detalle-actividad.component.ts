import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaceriaService } from '../../services/caceria.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms'; // Para ngModel

@Component({
  selector: 'app-detalle-actividad',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressBarModule, ProgressSpinnerModule, FormsModule],
  providers: [MessageService],
  templateUrl: './detalle-actividad.component.html'
})
export class DetalleActividadComponent implements OnInit {
  actividad: any = null;
  loading = true;
  inscribiendo = false;
  desinscribiendo = false;
  estaInscrito = false;

  comentarios: { autor: string; texto: string; fecha: string }[] = [
    { autor: 'Juan Pérez', texto: '¡Muy buena actividad, espero poder asistir!', fecha: 'Publicado hace 2 días' },
    { autor: 'María López', texto: '¿Es necesario tener experiencia previa para participar?', fecha: 'Publicado hace 1 día' }
  ];
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

  // NUEVO: Manejar envío del comentario
  enviarComentario(event: Event) {
    event.preventDefault();
    if (!this.nuevoComentario.trim()) return;

    this.enviandoComentario = true;

    // Simulación de envío al backend con delay (puedes cambiarlo por llamada real)
    setTimeout(() => {
      this.comentarios.push({
        autor: 'Usuario Actual', // O toma el nombre del usuario logueado
        texto: this.nuevoComentario.trim(),
        fecha: 'Hace unos segundos'
      });
      this.nuevoComentario = '';
      this.enviandoComentario = false;
      this.messageService.add({severity:'success', summary:'Comentario', detail:'Comentario agregado correctamente.'});
    }, 800);
  }
}

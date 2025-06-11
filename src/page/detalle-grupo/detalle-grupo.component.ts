import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import {Toast} from 'primeng/toast';
import {FormsModule} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {InputTextarea} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-detalle-grupo',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, Toast, FormsModule, Dialog, InputText, InputTextarea, DropdownModule],
  templateUrl: './detalle-grupo.component.html',
  styleUrl: './detalle-grupo.component.css',
  providers: [MessageService]
})
export class DetalleGrupoComponent implements OnInit {
  grupoId!: number;
  grupo: any = null;
  publicaciones: any[] = [];
  publicacionesOriginales: any[] = [];
  fechaFormateada: string = '';
  esMiembro: boolean = false;

  mostrarModalComentarios = false;
  mostrarModalCrearPublicacion = false;

  nuevoComentario: string = '';
  enviandoComentario = false;
  enviandoPublicacion = false;

  nuevaPublicacion = {
    titulo: '',
    contenido: '',
    imagen_url: ''
  };

  comentariosActuales: any[] = [];
  publicacionSeleccionada: any = null;

  opcionesFiltro = [
    { label: 'Más nuevos', value: 'nuevos' },
    { label: 'Cantidad de likes', value: 'likes' },
  ];

  filtroSeleccionado: any = this.opcionesFiltro[0];

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.grupoId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.grupoId) {
      this.groupService.obtenerGrupo(this.grupoId).subscribe({
        next: (res) => {
          this.grupo = res;
          const fecha = new Date(this.grupo.fecha_creacion);
          const formateador = new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          this.fechaFormateada = `el ${formateador.format(fecha)}`;
        },
        error: (err) => console.error('Error cargando grupo:', err)
      });

      this.groupService.obtenerPublicaciones(this.grupoId).subscribe({
        next: (res) => {
          this.publicacionesOriginales = res;
          this.aplicarFiltro();
        },
        error: (err) => console.error('Error cargando publicaciones:', err)
      });

      this.groupService.esMiembro(this.grupoId).subscribe({
        next: (res) => (this.esMiembro = res.es_miembro),
        error: (err) => console.error('Error consultando membresía:', err)
      });
    }
  }

  aplicarFiltro() {
    if (this.filtroSeleccionado.value === 'nuevos') {
      this.publicaciones = [...this.publicacionesOriginales].sort((a, b) =>
        new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
      );
    } else if (this.filtroSeleccionado.value === 'likes') {
      this.publicaciones = [...this.publicacionesOriginales].sort((a, b) =>
        b.cantidad_likes - a.cantidad_likes
      );
    } else {
      this.publicaciones = [...this.publicacionesOriginales];
    }
    console.log('Publicaciones filtradas:', this.publicaciones);
  }

  cambiarFiltro() {
    console.log('Filtro cambiado a:', this.filtroSeleccionado);
    this.aplicarFiltro();
  }

  toggleMembresia(): void {
    if (this.esMiembro) {
      this.groupService.salirDeGrupo(this.grupoId).subscribe({
        next: () => {
          this.esMiembro = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Saliste del grupo',
            detail: 'Ya no eres miembro del grupo.'
          });
        },
        error: (err) => {
          console.error('Error al salir del grupo:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo salir del grupo.'
          });
        }
      });
    } else {
      this.groupService.unirseAGrupo(this.grupoId).subscribe({
        next: () => {
          this.esMiembro = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Te uniste al grupo',
            detail: 'Ahora eres miembro del grupo.'
          });
        },
        error: (err) => {
          console.error('Error al unirse al grupo:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo unir al grupo.'
          });
        }
      });
    }
  }

  darLike(post: any): void {
    this.groupService.likePublicacion(post.id).subscribe({
      next: (res) => {
        if (res.liked) {
          post.ya_votado = true;
          post.cantidad_likes = (post.cantidad_likes || 0) + 1;
        } else {
          post.ya_votado = false;
          post.cantidad_likes = Math.max((post.cantidad_likes || 1) - 1, 0);
        }
        // Aplicar filtro para reordenar si el filtro es por likes
        if (this.filtroSeleccionado.value === 'likes') {
          this.aplicarFiltro();
        }
      },
      error: (err) => {
        console.error('Error al votar publicación:', err);
      }
    });
  }

  abrirModalComentarios(post: any): void {
    this.publicacionSeleccionada = post;

    this.groupService.obtenerComentarios(post.id).subscribe({
      next: (res) => {
        this.comentariosActuales = res;
        this.mostrarModalComentarios = true;
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los comentarios.'
        });
      }
    });
  }

  cerrarModalComentarios(): void {
    this.mostrarModalComentarios = false;
    this.nuevoComentario = '';
    this.publicacionSeleccionada = null;
    this.comentariosActuales = [];
  }

  enviarComentario(event: Event): void {
    event.preventDefault();
    if (!this.nuevoComentario.trim() || !this.publicacionSeleccionada) return;

    this.enviandoComentario = true;

    this.groupService.crearComentario(this.publicacionSeleccionada.id, this.nuevoComentario.trim()).subscribe({
      next: (nuevoComentario) => {
        this.comentariosActuales.push(nuevoComentario);
        this.nuevoComentario = '';
        this.enviandoComentario = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Comentario enviado',
          detail: 'Tu comentario se ha publicado correctamente.'
        });
      },
      error: (err) => {
        console.error('Error al enviar comentario:', err);
        this.enviandoComentario = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo enviar el comentario.'
        });
      }
    });
  }

  limpiarFormularioPublicacion() {
    this.nuevaPublicacion = { titulo: '', contenido: '', imagen_url: '' };
    this.enviandoPublicacion = false;
  }

  enviarPublicacion(event: Event) {
    event.preventDefault();
    if (!this.nuevaPublicacion.contenido.trim()) return;

    this.enviandoPublicacion = true;

    // Asume que tienes el grupoId disponible en tu componente
    const grupoId = this.grupoId;

    this.groupService
      .crearPublicacion(
        grupoId,
        this.nuevaPublicacion.titulo,
        this.nuevaPublicacion.contenido,
        this.nuevaPublicacion.imagen_url || null
      )
      .subscribe({
        next: (res) => {
          // Aquí puedes actualizar la lista de publicaciones
          this.mostrarModalCrearPublicacion = false;
          this.limpiarFormularioPublicacion();
          // Recargar la pagina
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Error al crear publicación', err);
          this.enviandoPublicacion = false;
        }
      });
  }
}

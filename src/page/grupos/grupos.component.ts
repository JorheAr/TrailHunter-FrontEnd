import {Component, OnInit} from '@angular/core';
import {NuevoGrupoComponent} from '../../component/nuevo-grupo/nuevo-grupo.component';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
import {GroupService} from '../../services/group.service';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-grupos',
  imports: [
    NuevoGrupoComponent,
    NgForOf,
    NgIf,
    SlicePipe,
    ToastModule
  ],
  standalone: true,
  templateUrl: './grupos.component.html',
  providers: [MessageService],
})
export class GruposComponent implements OnInit{
  grupos: any[] = [];
  loading = true;

  isNuevoGrupoOpen = false;

  constructor(private groupService: GroupService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.groupService.obtenerTodosLosGrupos().subscribe({
      next: data => {
        this.grupos = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando grupos', err);
        this.loading = false;
      }
    });
  }

  openNuevoGrupo() {
    console.log("Abriendo formulario nuevo grupo");
    this.isNuevoGrupoOpen = true;
  }

  closeNuevoGrupo() {
    console.log("Cerrando formulario nuevo grupo");
    this.isNuevoGrupoOpen = false;
  }

  unirseAlGrupo(grupo: any): void {
    this.groupService.unirseAGrupo(grupo.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Te has unido al grupo: ${grupo.nombre}`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Error al unirse al grupo',
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CaceriaService } from '../../services/caceria.service';
import { NuevaActividadComponent } from '../../component/nueva-actividad/nueva-actividad.component';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  standalone: true,
  imports: [NgForOf, NuevaActividadComponent, NgIf],
})
export class ActividadesComponent implements OnInit {
  actividades: any[] = [];
  isNuevaActividadOpen: boolean = false;

  constructor(
    private caceriaService: CaceriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caceriaService.obtenerTodas().subscribe({
      next: (data) => {
        this.actividades = (data as any[]).slice(0, 6).map(act => ({
          ...act,
          imagen: act.imagen_url,
          lugar: act.lugar,
          capacidad: `${act.inscritos}/${act.cupo_maximo}`,
          fecha: new Date(act.fecha).toLocaleDateString()
        }));
      },
      error: (err) => console.error('Error cargando actividades', err)
    });
  }

  openNuevaActividad(): void {
    this.isNuevaActividadOpen = true;
  }

  closeNuevaActividad(): void {
    this.isNuevaActividadOpen = false;
  }

  verDetalle(id: number): void {
    this.router.navigate(['/actividad', id]);
  }
}

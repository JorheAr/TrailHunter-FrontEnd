import { Component, OnInit } from '@angular/core';
import { CaceriaService } from '../../../services/caceria.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {ProgressSpinner} from 'primeng/progressspinner';
import {NgIf, NgStyle} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {ButtonDirective} from 'primeng/button';
import {InputNumber} from 'primeng/inputnumber';
import {Calendar} from 'primeng/calendar';
import {InputTextarea} from 'primeng/inputtextarea';

@Component({
  selector: 'app-admin-actividades',
  templateUrl: './admin-actividades.component.html',
  standalone: true,
  imports: [
    InputText,
    FormsModule,
    ProgressSpinner,
    NgIf,
    NgStyle,
    TableModule,
    Toast,
    ButtonDirective,
    InputNumber,
    Calendar,
    InputTextarea,
    // Importa módulos necesarios
  ],
  providers: [MessageService]
})
export class AdminActividadesComponent implements OnInit {
  actividades: any[] = [];
  loading: boolean = false;
  loadingCrear: boolean = false;
  filtroGlobal: string = '';
  actividadesOriginales: any[] = [];

  mostrarModal: boolean = false;

  formData = {
    titulo: '',
    descripcion: '',
    fecha: '',
    cupo_maximo: null as number | null,
    imagen_url: ''
  };

  constructor(
    private caceriaService: CaceriaService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades(): void {
    this.loading = true;
    this.caceriaService.obtenerTodas().subscribe({
      next: (res: any) => {
        this.actividadesOriginales = res;
        this.actividades = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las actividades'
        });
      }
    });
  }

  aplicarFiltroGlobal(): void {
    const texto = this.filtroGlobal.trim().toLowerCase();
    if (!texto) {
      this.cargarActividades(); // recarga sin filtro
      return;
    }

    this.actividades = this.actividadesOriginales.filter(a =>
      (a.titulo?.toLowerCase().includes(texto) || a.fecha?.toLowerCase().includes(texto))
    );
  }

  verDetalle(id: number): void {
    this.router.navigate(['/actividad', id]);
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    if (this.loadingCrear) return; // evitar cerrar mientras crea
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.formData = {
      titulo: '',
      descripcion: '',
      fecha: '',
      cupo_maximo: null,
      imagen_url: ''
    };
  }

  handleSubmit(): void {
    if (!this.formData.titulo || !this.formData.descripcion || !this.formData.fecha || !this.formData.cupo_maximo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor completa todos los campos requeridos.'
      });
      return;
    }

    this.loadingCrear = true;

    // Adaptamos datos para el backend según tu servicio:
    const data = {
      titulo: this.formData.titulo,
      descripcion: this.formData.descripcion,
      fecha: this.formData.fecha,
      cupo_maximo: this.formData.cupo_maximo,
      imagen_url: this.formData.imagen_url || null
    };

    this.caceriaService.crearActividad(data).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Actividad creada correctamente'
        });
        this.cargarActividades();
        this.cerrarModal();
        this.loadingCrear = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear actividad: ' + (err.error?.error || 'Desconocido')
        });
        this.loadingCrear = false;
      }
    });
  }
}

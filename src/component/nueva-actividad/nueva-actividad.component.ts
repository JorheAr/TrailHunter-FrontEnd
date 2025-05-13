import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-nueva-actividad',
  templateUrl: './nueva-actividad.component.html',
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class NuevaActividadComponent {
  @Output() closeForm = new EventEmitter<void>();

  titulo: string = '';
  descripcion: string = '';
  fecha: string = '';
  lugar: string = '';
  capacidad: number = 0;
  imagen: string = '';

  handleSubmit(): void {
    const nuevaActividad = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      fecha: this.fecha,
      lugar: this.lugar,
      capacidad: this.capacidad,
      imagen: this.imagen,
    };
    console.log('Nueva Actividad:', nuevaActividad);
    this.closeForm.emit();  // Cierra el formulario
    this.resetForm();
  }

  closeFormHandler(): void {
    this.closeForm.emit();  // Cierra el formulario al hacer clic en "Cancelar"
  }

  resetForm(): void {
    this.titulo = '';
    this.descripcion = '';
    this.fecha = '';
    this.lugar = '';
    this.capacidad = 0;
    this.imagen = '';
  }
}

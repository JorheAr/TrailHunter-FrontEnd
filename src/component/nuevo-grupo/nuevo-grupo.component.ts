import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-nuevo-grupo',
  imports: [
    FormsModule
  ],
  templateUrl: './nuevo-grupo.component.html'
})
export class NuevoGrupoComponent {
  nombre: string = '';
  descripcion: string = '';
  imagen: string = '';

  @Output() closeForm = new EventEmitter<void>();

  handleSubmit() {
    const nuevoGrupo = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      imagen: this.imagen
    };

    console.log('Grupo creado:', nuevoGrupo);
    this.closeForm.emit();
  }

  closeFormHandler() {
    this.closeForm.emit();
  }
}

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ]
})
export class ContactoComponent {
  nombre: string = '';
  correo: string = '';
  mensaje: string = '';
  enviado: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  enviarFormulario() {
    const payload = {
      nombre: this.nombre,
      correo: this.correo,
      mensaje: this.mensaje
    };

    this.http.post('http://localhost:5000/contacto', payload).subscribe({
      next: () => {
        this.enviado = true;
        this.error = null;
        this.nombre = '';
        this.correo = '';
        this.mensaje = '';
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al enviar el mensaje.';
      }
    });
  }
}

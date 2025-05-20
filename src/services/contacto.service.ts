import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MensajeContacto {
  id: number;
  nombre: string;
  correo: string;
  mensaje: string;
  fecha_envio: string;
  leido: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private apiUrl = 'http://localhost:5000/contacto/mensajes';

  constructor(private http: HttpClient) {}

  obtenerMensajes(leido?: boolean): Observable<MensajeContacto[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    let url = this.apiUrl;
    if (leido !== undefined) {
      url += `?leido=${leido}`;
    }

    return this.http.get<MensajeContacto[]>(url, { headers });
  }

  marcarLeido(mensajeId: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/marcar-leido`, { mensaje_id: mensajeId }, { headers });
  }
}

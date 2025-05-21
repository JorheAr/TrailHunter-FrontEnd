import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaceriaService {
  private baseUrl = 'http://localhost:5000/caceria';

  constructor(private http: HttpClient) {}

  // Obtener todas las actividades de cacería (públicas)
  obtenerTodas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/todas`);
  }

  // Obtener actividades en las que está inscrito el usuario
  obtenerMisActividades(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.get(`${this.baseUrl}/mis`, { headers });
  }

  // Inscribirse a una actividad
  inscribirse(actividadId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.post(
      `${this.baseUrl}/inscribirse`,
      { actividad_id: actividadId },
      { headers }
    );
  }

  // Quitar inscripción de una actividad
  desinscribirse(actividadId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.post(
      `${this.baseUrl}/desinscribirse`,
      { actividad_id: actividadId },
      { headers }
    );
  }

  // Valorar una actividad
  valorarActividad(actividadId: number, puntuacion: number, comentario: string = ''): Observable<any> {
    return this.http.post(`${this.baseUrl}/valorar`, {
      actividad_id: actividadId,
      puntuacion: puntuacion,
      comentario: comentario
    });
  }

  // Crear una nueva actividad (solo para admin)
  crearActividad(data: any): Observable<any> {
    const body = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      fecha: this.formatDateTime(data.fecha),
      limite_participantes: data.limite_participantes,
      imagen_url: data.imagen_url || null
    };
    return this.http.post(`${this.baseUrl}/crear`, body);
  }

  // Utilidad para convertir fecha a formato compatible con el backend
  private formatDateTime(date: Date): string {
    return date.toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
  }
}

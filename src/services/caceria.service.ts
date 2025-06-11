import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaceriaService {
  private baseUrl = 'http://localhost:5000/caceria';
  private actividadesCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // Obtener actividades públicas
  obtenerTodas(): Observable<any[]> {
    if (this.actividadesCache) {
      return of(this.actividadesCache);
    }
    return this.http.get<any[]>(`${this.baseUrl}/todas`).pipe(
      tap(actividades => this.actividadesCache = actividades)
    );
  }

  // Obtener actividades del usuario autenticado
  obtenerMisActividades(): Observable<any> {
    return this.http.get(`${this.baseUrl}/mis`, { headers: this.getAuthHeaders() });
  }

  // Inscribirse en una actividad
  inscribirse(actividadId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/inscribirse`,
      { actividad_id: actividadId },
      { headers: this.getAuthHeaders() }
    );
  }

  // Desinscribirse de una actividad
  desinscribirse(actividadId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/desinscribirse`,
      { actividad_id: actividadId },
      { headers: this.getAuthHeaders() }
    );
  }

  // Valorar una actividad
  valorarActividad(actividadId: number, puntuacion: number, comentario: string = ''): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/valorar`,
      { actividad_id: actividadId, puntuacion, comentario },
      { headers: this.getAuthHeaders() }
    );
  }

  // Crear Actividad
  crearActividad(data: any): Observable<any> {
    const body = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha: this.formatDateTime(data.fecha),
      lugar: data.lugar,
      cupo_maximo: data.cupo_maximo,
      imagen_url: data.imagen_url || null
    };
    return this.http.post(`${this.baseUrl}/crear`, body, { headers: this.getAuthHeaders() });
  }


  // Utilidad para formatear fecha ISO
  formatDateTime(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Comentar en una actividad
  comentarActividad(actividadId: number, texto: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/actividades/${actividadId}/comentarios`,
      { texto },
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener comentarios de una actividad
  obtenerComentarios(actividadId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/actividades/${actividadId}/comentarios`);
  }

}



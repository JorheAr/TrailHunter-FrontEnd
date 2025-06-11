import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private baseUrl = 'http://localhost:5000/group';
  private gruposCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // Crear grupo
  crearGrupo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear`, data, { headers: this.getAuthHeaders() });
  }

  // Obtener todos los grupos
  obtenerTodosLosGrupos(): Observable<any[]> {
    if (this.gruposCache) {
      return of(this.gruposCache);
    }

    return this.http.get<any[]>(`${this.baseUrl}/todos`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(grupos => this.gruposCache = grupos)
    );
  }

  // Obtener detalles de un grupo
  obtenerGrupo(grupoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${grupoId}`, { headers: this.getAuthHeaders() });
  }

  // Eliminar grupo
  eliminarGrupo(grupoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${grupoId}`, { headers: this.getAuthHeaders() });
  }

  // Unirse a grupo
  unirseAGrupo(grupoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${grupoId}/unirse`, {}, { headers: this.getAuthHeaders() });
  }

  // Salir de grupo
  salirDeGrupo(grupoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${grupoId}/salir`, {}, { headers: this.getAuthHeaders() });
  }

  // Es miembro del grupo
  esMiembro(grupoId: number): Observable<{ es_miembro: boolean }> {
    return this.http.get<{ es_miembro: boolean }>(
      `${this.baseUrl}/${grupoId}/es_miembro`,
      { headers: this.getAuthHeaders() }
    );
  }
  // Expulsar miembro
  expulsarDeGrupo(grupoId: number, usuarioId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${grupoId}/expulsar`,
      { usuario_id: usuarioId },
      { headers: this.getAuthHeaders() }
    );
  }

  // Crear publicación en grupo
  crearPublicacion(grupoId: number, titulo: string, contenido: string, imagen_url: string | null = null): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${grupoId}/publicacion`,
      { titulo, contenido, imagen_url },
      { headers: this.getAuthHeaders() }
    );
  }


  // Obtener publicaciones de un grupo
  obtenerPublicaciones(grupoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${grupoId}/publicaciones`, { headers: this.getAuthHeaders() });
  }

  // Dar like a una publicación
  likePublicacion(publicacionId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/publicaciones/${publicacionId}/like`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Borrar publicación
  borrarPublicacion(publicacionId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/publicaciones/${publicacionId}`, { headers: this.getAuthHeaders() });
  }

  // Obtener miembros de un grupo
  obtenerMiembros(grupoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${grupoId}/miembros`, { headers: this.getAuthHeaders() });
  }

  limpiarCache(): void {
    this.gruposCache = null;
  }

  crearComentario(publicacionId: number, contenido: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/publicaciones/${publicacionId}/comentarios`,
      { texto: contenido },  // <--- este nombre debe coincidir
      { headers: this.getAuthHeaders() }
    );
  }

// Obtener comentarios de una publicación
  obtenerComentarios(publicacionId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/publicaciones/${publicacionId}/comentarios`,
      { headers: this.getAuthHeaders() }
    );
  }

// Eliminar un comentario
  eliminarComentario(comentarioId: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/comentarios/${comentarioId}`,
      { headers: this.getAuthHeaders() }
    );
  }

}

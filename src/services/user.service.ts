import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/usuarios';

  constructor(private http: HttpClient) {}


  getUsuarioActual(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.get<any>(`${this.apiUrl}/me`, { headers });
  }

  enviarCorreoVerificacion(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.post<any>(`${this.apiUrl}/send-verification-email`, {}, { headers });
  }

  getFollowStats(): Observable<{ seguidores: number; seguidos: number }> {
    // Recuperar el token JWT del localStorage o de algún otro lugar
    const token = localStorage.getItem('token');

    // Si hay un token, lo incluimos en los headers
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http
      .get<{ seguidores: number; seguidos: number }>(`${this.apiUrl}/follow-stats`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al obtener las estadísticas de seguidores', error);
          throw error;
        })
      );
  }
}

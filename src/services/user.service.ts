import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.get<any>(`${this.apiUrl}/all`, { headers });
  }

  getUsuarioById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }


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
    const token = localStorage.getItem('token');
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

  getFollowStatsById(userId: number): Observable<{ seguidores: number; seguidos: number }> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.get<{ seguidores: number; seguidos: number }>(
      `${this.apiUrl}/${userId}/follow-stats`,
      { headers }
    );
  }

  getFollowers(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.get<any>(`${this.apiUrl}/seguidores`, { headers });
  }

  getFollowing(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.get<any>(`${this.apiUrl}/seguidos`, { headers });
  }

  followUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.post<any>(`${this.apiUrl}/follow`, { user_id: userId }, { headers });
  }

  unfollowUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    return this.http.post<any>(`${this.apiUrl}/unfollow`, { user_id: userId }, { headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) {}

  // Método de login que manda los datos al backend
  login(data: any): Observable<any> {
    const body = {
      username: data.loginUsername,
      password: data.loginPassword,
    };

    return this.http.post(`${this.baseUrl}/login`, body);
  }

  register(data: any): Observable<any> {
    const body = {
      username: data.username,
      email: data.email,
      password: data.password,
      nombre: data.firstName,
      apellidos: data.lastName,
      fecha_nacimiento: this.formatDate(data.birthDate),
      rol: 'usuario'
    };

    return this.http.post(`${this.baseUrl}/register`, body);
  }

  private formatDate(date: Date): string {
    // Asegúrate que la fecha va en formato YYYY-MM-DD
    return date.toISOString().split('T')[0];
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatsDashboard {
  usuarios_ultima_semana: number;
  inscripciones_ultima_semana: number;
  total_usuarios: number;
  total_actividades: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private baseUrl = 'http://localhost:5000/stats';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<StatsDashboard> {
    return this.http.get<StatsDashboard>(`${this.baseUrl}/dashboard`);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-verificar-correo',
  standalone: true,
  imports: [
    NgIf,
    ButtonDirective
  ],
  templateUrl: './verificar-correo.component.html'
})
export class VerificarCorreoComponent implements OnInit {
  mensaje = '';
  verificado = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.post('http://localhost:5000/usuarios/verify-email', { token }).subscribe({
        next: (res: any) => {
          this.mensaje = '✅ ¡Tu cuenta ha sido verificada con éxito!';
          this.verificado = true;
        },
        error: (err) => {
          this.mensaje = '❌ El enlace de verificación no es válido o ha expirado.';
        }
      });
    } else {
      this.mensaje = '❗ No se proporcionó ningún token.';
    }
  }

  irAlHome() {
    this.router.navigate(['/home']);
  }
}

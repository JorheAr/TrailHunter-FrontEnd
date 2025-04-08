import {Component, inject} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './header.component.html',
  standalone: true
})
export class HeaderComponent {
  private router = inject(Router);
  isMenuOpen = false;

  // Método para alternar el estado del menú
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout(): void {
    // Eliminar el token y la información del usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('hasLoggedIn');

    // Redirigir a la página de inicio o login
    this.router.navigate(['/auth']);
  }
}

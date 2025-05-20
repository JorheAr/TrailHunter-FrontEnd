import {Component, inject, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import { Router } from '@angular/router';
import {MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';
import {observeNotification} from 'rxjs/internal/Notification';

@Component({
  selector: 'app-header',
  imports: [
    NgClass,
    NgIf,
    MenuModule,
    ButtonModule
  ],
  templateUrl: './header.component.html',
  standalone: true
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  isMenuOpen = false;
  userItems: any[] = [];

  ngOnInit() {
    this.updateUserItems();
  }

  updateUserItems() {
    this.userItems = [
      {
        label: 'Mi Perfil',
        icon: 'pi pi-id-card',
        command: () => {
          this.router.navigate(['/profile']);
        }
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];

    if (localStorage.getItem('rol') === 'admin') {
      this.userItems.push({
        label: 'Panel de Administración',
        icon: 'pi pi-cog',
        command: () => {
          this.router.navigate(['/admin']);
        }
      });
    }
  }


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
    localStorage.removeItem('rol');
    localStorage.removeItem('hasLoggedIn');

    // Redirigir a la página de inicio o login
    this.router.navigate(['/auth']);
  }
}

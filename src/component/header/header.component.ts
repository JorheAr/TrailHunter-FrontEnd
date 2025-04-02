import { Component } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NgClass
  ],
  templateUrl: './header.component.html',
  standalone: true
})
export class HeaderComponent {
// Variable para controlar si el menú está abierto o cerrado
  isMenuOpen = false;

  // Método para alternar el estado del menú
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

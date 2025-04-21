import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  seguidores: number = 0;
  seguidos: number = 0;
  username: string = ''; // Aquí almacenaremos el nombre de usuario
  avatarUrl: string = ''; // Aquí almacenaremos la URL del avatar

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Obtener el nombre de usuario desde el localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;

      // Generar la URL del avatar usando la API DiceBear
      this.avatarUrl = `https://api.dicebear.com/6.x/lorelei-neutral/png?seed=${this.username}`;
    }

    // Obtener las estadísticas de seguidores y seguidos desde el servicio
    this.userService.getFollowStats().subscribe({
      next: (data) => {
        this.seguidores = data.seguidores;
        this.seguidos = data.seguidos;
      },
      error: (err) => {
        console.error('Error al obtener estadísticas de seguidores', err);
      }
    });
  }
}

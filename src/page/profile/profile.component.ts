import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { LoaderComponent } from '../../component/loader/loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './profile.component.html',
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {
  verificado: boolean = false;
  seguidores: number = 0;
  seguidos: number = 0;
  username: string = '';
  avatarUrl: string = '';
  cargando: boolean = true;

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    // Obtener el nombre de usuario desde el localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.avatarUrl = `https://api.dicebear.com/6.x/lorelei-neutral/png?seed=${this.username}`;
    }

    // Obtener los datos de usuario
    this.userService.getUsuarioActual().subscribe(usuario => {
      this.verificado = usuario.verificado;
    });

    // Obtener las estadísticas de seguidores y seguidos
    this.userService.getFollowStats().subscribe({
      next: (data) => {
        this.seguidores = data.seguidores;
        this.seguidos = data.seguidos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener estadísticas de seguidores', err);
        this.cargando = false;
      }
    });
  }

  enviarCorreoVerficacion() {
    this.userService.enviarCorreoVerificacion().subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Correo enviado', detail: 'Revisa tu bandeja de entrada' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar el correo' });
      }
    });
  }
}

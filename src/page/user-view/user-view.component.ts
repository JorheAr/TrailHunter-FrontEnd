import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService} from '../../services/user.service';
import {NgClass, NgIf} from '@angular/common';
import {LoaderComponent} from '../../component/loader/loader.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  imports: [
    NgClass,
    NgIf,
    LoaderComponent
  ],
  standalone: true
})
export class UserViewComponent implements OnInit {
  usuario: any;
  cargando = true;
  seguidores = 0;
  seguidos = 0;
  avatarUrl = '';
  userId!: number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.userService.getUsuarioById(this.userId).subscribe({
      next: (res) => {
        this.usuario = res;
        this.avatarUrl = `https://api.dicebear.com/6.x/lorelei-neutral/png?seed=${res.username}`;
        this.userService.getFollowStatsById(this.userId).subscribe({
          next: (stats) => {
            this.seguidores = stats.seguidores;
            this.seguidos = stats.seguidos;
          },
          error: (err) => {
            console.error('Error cargando estadísticas de seguidores', err);
          }
        });

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando usuario', err);
        this.cargando = false;
      },
    });
  }

  seguirUsuario() {
    this.userService.followUser(this.userId).subscribe(() => {
      this.usuario.is_following = true;
      this.actualizarStats();
    });
  }

  dejarDeSeguirUsuario() {
    this.userService.unfollowUser(this.userId).subscribe(() => {
      this.usuario.is_following = false;
      this.actualizarStats();
    });
  }

  bloquearUsuario(): void {
    if (!this.usuario) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que quieres bloquear a ${this.usuario.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bloquear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.blockUser(this.usuario.id).subscribe({
          next: () => {
            Swal.fire('¡Hecho!', `${this.usuario.username} ha sido bloqueado.`, 'success');
            this.usuario.is_blocking = true;
          },
          error: () => {
            Swal.fire('Error', 'Hubo un problema al bloquear al usuario.', 'error');
          },
        });
      }
    });
  }

  desbloquearUsuario(): void {
    if (!this.usuario) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que quieres desbloquear a ${this.usuario.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desbloquear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.unblockUser(this.usuario.id).subscribe({
          next: () => {
            Swal.fire('¡Hecho!', `${this.usuario.username} ha sido desbloqueado.`, 'success');
            this.usuario.is_blocking = false;
          },
          error: () => {
            Swal.fire('Error', 'Hubo un problema al desbloquear al usuario.', 'error');
          },
        });
      }
    });
  }

  isBlockedByUser(): boolean {
    return !!this.usuario.is_blocked_by;
  }

  actualizarStats() {
    this.userService.getFollowStatsById(this.userId).subscribe({
      next: (stats) => {
        this.seguidores = stats.seguidores;
        this.seguidos = stats.seguidos;
      },
      error: (err) => {
        console.error('Error actualizando estadísticas', err);
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { LoaderComponent } from '../../component/loader/loader.component';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {Toast} from 'primeng/toast';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule, Dialog, InputText, Toast],
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
  seguidoresList: any[] = [];
  seguidosList: any[] = [];
  seguidoresFiltrados: any[] = [];
  seguidosFiltrados: any[] = [];
  seguidoresModalVisible: boolean = false;
  seguidosModalVisible: boolean = false;
  seguidoresSearch: string = '';
  seguidosSearch: string = '';
  editarPerfilModalVisible: boolean = false;
  usernameEdit: string = '';
  modalWidth = '50vw';
  editarPerfilWidth = '40vw';

  constructor(private userService: UserService, private messageService: MessageService, private router: Router, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.avatarUrl = `https://api.dicebear.com/6.x/lorelei-neutral/png?seed=${this.username}`;
    }

    this.userService.getUsuarioActual().subscribe(usuario => {
      this.verificado = usuario.verificado;
    });

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

    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      if (result.matches) {
        this.modalWidth = '90%';
        this.editarPerfilWidth = '90%';
      } else {
        this.modalWidth = '50vw';
        this.editarPerfilWidth = '40vw';
      }
    });
  }

  abrirEditarPerfil() {
    if (!this.verificado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Verificación requerida',
        detail: 'Debes verificar tu cuenta antes de editar tu perfil.'
      });
      return;
    }
    this.usernameEdit = this.username;
    this.editarPerfilModalVisible = true;
  }

  guardarCambios() {
    if (!this.usernameEdit.trim()) return;

    this.userService.actualizarPerfil({ username: this.usernameEdit }).subscribe({
      next: () => {
        this.username = this.usernameEdit;
        localStorage.setItem('username', this.usernameEdit);
        this.avatarUrl = `https://api.dicebear.com/6.x/lorelei-neutral/png?seed=${this.usernameEdit}`;
        this.editarPerfilModalVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Perfil actualizado',
          detail: 'Tu nombre de usuario se ha actualizado con éxito.'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el perfil.'
        });
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

  verSeguidores() {
    this.userService.getFollowers().subscribe((data) => {
      this.seguidoresList = data.seguidores;
      this.seguidoresFiltrados = [...this.seguidoresList];
      this.seguidoresModalVisible = true;
    });
  }

  verSeguidos() {
    this.userService.getFollowing().subscribe((data) => {
      this.seguidosList = data.seguidos;
      this.seguidosFiltrados = [...this.seguidosList];
      this.seguidosModalVisible = true;
    });
  }

  verPerfil(userId: number) {
    this.router.navigate([`/usuario/${userId}`]);
  }

  filtrarSeguidores() {
    this.seguidoresFiltrados = this.seguidoresList.filter(seguidor =>
      seguidor.username.toLowerCase().includes(this.seguidoresSearch.toLowerCase())
    );
  }

  filtrarSeguidos() {
    this.seguidosFiltrados = this.seguidosList.filter(seguido =>
      seguido.username.toLowerCase().includes(this.seguidosSearch.toLowerCase())
    );
  }

  getAvatarUrl(username: string): string {
    return `https://api.dicebear.com/6.x/lorelei-neutral/png?seed=${username}`;
  }
}

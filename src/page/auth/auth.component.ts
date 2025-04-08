import {Component, inject} from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Button } from 'primeng/button';
import { NgIf } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FluidModule } from 'primeng/fluid';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [SelectButtonModule, FormsModule, PasswordModule, Button, NgIf, InputText, CalendarModule, FluidModule, ToastModule],
  standalone: true,
  templateUrl: './auth.component.html',
  providers: [MessageService]
})
export class AuthComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  stateOptions: any[] = [{ label: 'Iniciar Sesión', value: 'login' }, { label: 'Registro', value: 'register' }];
  activeForm: string = 'login';

  loginFormData: any = {
    loginUsername: '',
    loginPassword: ''
  };

  registerFormData: any = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    birthDate: null
  };

  onLogin() {
    // Validaciones básicas
    if (!this.loginFormData.loginUsername || !this.loginFormData.loginPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Campos incompletos',
        detail: 'Por favor, complete todos los campos.'
      });
      return;
    }

    // Llamada al servicio de autenticación
    this.authService.login(this.loginFormData).subscribe({
      next: (response) => {
        // Si el login es exitoso, guardar el token y el nombre del usuario
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('username', response.nombre);
        localStorage.setItem('hasLoggedIn', 'true');

        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenido',
          detail: 'Inicio de sesión exitoso'
        });
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        const msg = error.error?.message || 'Credenciales incorrectas';
        this.messageService.add({
          severity: 'error',
          summary: 'Error de login',
          detail: msg
        });
      }
    });
  }


  formErrors: any = {};

  onSubmit() {
    this.formErrors = {};

    // Validaciones
    if (this.registerFormData.password !== this.registerFormData.confirmPassword) {
      this.formErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    const today = new Date();
    const birthDate = new Date(this.registerFormData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      this.formErrors.birthDate = 'Debes ser mayor de 18 años';
    }

    if (!this.registerFormData.username) {
      this.formErrors.username = 'El nombre de usuario es obligatorio';
    }
    if (!this.registerFormData.email) {
      this.formErrors.email = 'El correo electrónico es obligatorio';
    }

    if (Object.keys(this.formErrors).length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Registro inválido',
        detail: 'Corrige los errores del formulario'
      });
      return;
    }

    // Llamada al backend para registrar al usuario
    this.authService.register(this.registerFormData).subscribe({
      next: (response) => {
        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: response.message
        });

        this.registerFormData = {
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          firstName: '',
          lastName: '',
          birthDate: null
        };
        this.activeForm = 'login';
      },
      error: (error: HttpErrorResponse) => {
        const msg = error.error?.message || 'Ha ocurrido un error al registrar';
        this.messageService.add({
          severity: 'error',
          summary: 'Error en el registro',
          detail: msg
        });

        if (msg.includes('ya existe')) {
          this.formErrors.username = msg;
        }
      }
    });
  }
}

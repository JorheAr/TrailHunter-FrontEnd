import { Component } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Button } from 'primeng/button';
import { NgIf } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-auth',
  imports: [SelectButtonModule, FormsModule, PasswordModule, Button, NgIf, InputText, CalendarModule, FluidModule],
  standalone: true,
  templateUrl: './auth.component.html'
})
export class AuthComponent {
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
    birthDate: new Date()
  };

  onLogin() {
    console.log('Login data:', this.loginFormData);
  }

  onSubmit() {
    console.log('Register data:', this.registerFormData);
  }
}

import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  imports: [ToastModule],
  standalone: true,
  templateUrl: './home.component.html',
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Usamos setTimeout para esperar hasta que el componente se haya cargado completamente
    setTimeout(() => {
      const hasLoggedIn = localStorage.getItem('hasLoggedIn');
      const username = localStorage.getItem('username');

      if (hasLoggedIn === 'true' && username) {
        // Mostrar el toast con el mensaje de bienvenida
        this.messageService.add({
          severity: 'success',
          summary: 'Inicio de sesión exitoso',
          detail: `Has iniciado sesión como ${username}`
        });

        // Eliminar la bandera después de mostrar el toast
        localStorage.removeItem('hasLoggedIn');
      }
    }, 100);
  }
}

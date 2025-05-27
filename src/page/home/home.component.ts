import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './home.component.html',
  providers: [MessageService]
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      const hasLoggedIn = localStorage.getItem('hasLoggedIn');
      const username = localStorage.getItem('username');

      if (hasLoggedIn === 'true' && username) {
        this.messageService.add({
          severity: 'success',
          summary: 'Inicio de sesión exitoso',
          detail: `Has iniciado sesión como ${username}`
        });
        localStorage.removeItem('hasLoggedIn');
      }
    }, 100);
  }

  ngAfterViewInit(): void {
    new Swiper('.swiper-container', {
      loop: true,
      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 0,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        const scroller = document.querySelector('.main-scroll-container');
        if (scroller) {
          scroller.scrollTo({ top: 0, behavior: 'auto' });
        }
      }, 100);
    });
  }
}





// Version 1.0.0

// import { Component, OnInit } from '@angular/core';
// import { MessageService } from 'primeng/api';
// import { ToastModule } from 'primeng/toast';
//
// @Component({
//   selector: 'app-home',
//   imports: [ToastModule],
//   standalone: true,
//   templateUrl: './home.component.html',
//   providers: [MessageService]
// })
// export class HomeComponent implements OnInit {
//
//   constructor(private messageService: MessageService) {}
//
//   ngOnInit(): void {
//     // Usamos setTimeout para esperar hasta que el componente se haya cargado completamente
//     setTimeout(() => {
//       const hasLoggedIn = localStorage.getItem('hasLoggedIn');
//       const username = localStorage.getItem('username');
//
//       if (hasLoggedIn === 'true' && username) {
//         // Mostrar el toast con el mensaje de bienvenida
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Inicio de sesión exitoso',
//           detail: `Has iniciado sesión como ${username}`
//         });
//
//         // Eliminar la bandera después de mostrar el toast
//         localStorage.removeItem('hasLoggedIn');
//       }
//     }, 100);
//   }
// }

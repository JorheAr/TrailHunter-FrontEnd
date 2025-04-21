import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  standalone: true,
  templateUrl: './admin.component.html'
})
export class AdminComponent {

}

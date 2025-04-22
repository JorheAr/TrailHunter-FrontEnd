import { Component } from '@angular/core';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  standalone: true,
  imports: [
    ProgressSpinner
  ]
})
export class LoaderComponent {}

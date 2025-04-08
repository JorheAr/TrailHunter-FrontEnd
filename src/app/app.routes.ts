import { Routes } from '@angular/router';
import {AuthComponent} from '../page/auth/auth.component';
import {QuienesSomosComponent} from '../page/quienes-somos/quienes-somos';
import {HomeComponent} from '../page/home/home.component';

export const routes: Routes = [
  {'path': 'auth', 'component': AuthComponent},
  {'path': 'quienes-somos', 'component': QuienesSomosComponent},
  {'path': 'home', 'component': HomeComponent},
];

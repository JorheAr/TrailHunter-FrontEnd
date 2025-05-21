import { Routes } from '@angular/router';
import {AuthComponent} from '../page/auth/auth.component';
import {QuienesSomosComponent} from '../page/quienes-somos/quienes-somos';
import {ContactoComponent} from '../page/contacto/contacto.component';
import {HomeComponent} from '../page/home/home.component';
import {AdminComponent} from '../page/admin/admin.component';
import { adminRoleGuard } from './guards/admin-role.guard';
import {Error403Component} from '../page/errors/error-403/error-403.component';
import {Error401Component} from '../page/errors/error-401/error-401.component';
import {Error404Component} from '../page/errors/error-404/error-404.component';
import {ProfileComponent} from '../page/profile/profile.component';
import {VerificarCorreoComponent} from '../page/verificar-correo/verificar-correo.component';
import {ExplorarComponent} from '../page/explorar/explorar.component';
import {UserViewComponent} from '../page/user-view/user-view.component';
import {ActividadesComponent} from '../page/actividades/actividades.component';
import {NuevaActividadComponent} from '../component/nueva-actividad/nueva-actividad.component';
import {DetalleActividadComponent} from '../page/detalle-actividad/detalle-actividad.component';


export const routes: Routes = [
  {'path': 'auth', 'component': AuthComponent},
  {'path': 'quienes-somos', 'component': QuienesSomosComponent},
  {'path': 'contacto', 'component': ContactoComponent},
  {'path': 'home', 'component': HomeComponent},
  {'path': 'profile', 'component': ProfileComponent},
  {'path': 'explorar', 'component': ExplorarComponent},
  {'path': 'nueva-actividad', 'component': NuevaActividadComponent},
  {'path': 'actividades', 'component': ActividadesComponent},
  { path: 'actividad/:id', component: DetalleActividadComponent },
  { path: 'usuario/:id', 'component': UserViewComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminRoleGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('../page/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'usuarios', loadComponent: () => import('../page/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
      { path: 'notificaciones', loadComponent: () => import('../page/admin/notifications/notifications.component').then(m => m.NotificationsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: 'verificar-correo', component: VerificarCorreoComponent },
  { path: 'error-401', component: Error401Component },
  { path: 'error-403', component: Error403Component },
  { path: 'error-404', component: Error404Component },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'error-404' }
];

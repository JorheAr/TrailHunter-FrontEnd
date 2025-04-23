import { Component } from '@angular/core';
import {BuscarUsuariosComponent} from '../../component/buscar-usuarios/buscar-usuarios.component';
import {BuscarActividadesComponent} from '../../component/buscar-actividades/buscar-actividades.component';
import {BuscarGruposComponent} from '../../component/buscar-grupos/buscar-grupos.component';
import {NgClass, NgSwitch, NgSwitchCase} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Calendar} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../component/loader/loader.component';

@Component({
  selector: 'app-explorar',
  imports: [
    BuscarUsuariosComponent,
    BuscarActividadesComponent,
    BuscarGruposComponent,
    NgSwitch,
    NgSwitchCase,
    ButtonDirective,
    FormsModule,
    InputText,
    NgClass,
    Calendar,
    DropdownModule,
    Dialog,
    LoaderComponent
  ],
  standalone: true,
  templateUrl: './explorar.component.html'
})
export class ExplorarComponent {
  showFilterDialog = false;
  categorias = [
    { label: 'Todas', value: null },
    { label: 'Deporte', value: 'deporte' },
    { label: 'Música', value: 'musica' },
    { label: 'Tecnología', value: 'tecnologia' }
  ];
  selectedCategoria: string | null = null;
  selectedFecha: Date | null = null;
  selectedTab: 'usuarios' | 'actividades' | 'grupos' = 'actividades';
  searchQuery: string = '';

  usuariosCacheados: any[] | null = null;
  usuariosCargando = false;

  aplicarFiltros() {
    this.showFilterDialog = false;
  }

  onUsuariosTabActivado() {
    if (!this.usuariosCacheados) {
      this.usuariosCargando = true;
    }
  }

  onUsuariosCargados(usuarios: any[]) {
    this.usuariosCacheados = usuarios;
    this.usuariosCargando = false;
  }
}

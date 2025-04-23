import { Component } from '@angular/core';
import {BuscarUsuariosComponent} from '../../component/buscar-usuarios/buscar-usuarios.component';
import {BuscarActividadesComponent} from '../../component/buscar-actividades/buscar-actividades.component';
import {BuscarGruposComponent} from '../../component/buscar-grupos/buscar-grupos.component';
import {NgClass, NgSwitch, NgSwitchCase} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {PopoverModule} from 'primeng/popover';
import {OverlayPanelModule} from 'primeng/overlaypanel';

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
    Select,
    DatePicker,
    PopoverModule,
    OverlayPanelModule
  ],
  standalone: true,
  templateUrl: './explorar.component.html'
})
export class ExplorarComponent {
  popoverVisible: boolean = false;
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

  resetFiltros() {
    this.selectedCategoria = null;
    this.selectedFecha = null;
  }

  aplicarFiltros() {
    // Lógica de filtrado aquí
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

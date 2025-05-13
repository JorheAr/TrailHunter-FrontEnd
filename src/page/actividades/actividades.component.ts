import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NuevaActividadComponent} from '../../component/nueva-actividad/nueva-actividad.component';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  //styleUrls: ['./actividades.component.scss'],
  imports: [NgForOf, NuevaActividadComponent, NgIf]
})
export class ActividadesComponent {
  public actividades = [
    {
      titulo: 'Caza Mayor en Sierra Nevada',
      descripcion: 'Únete a nosotros para una experiencia única de caza mayor en el majestuoso entorno de Sierra Nevada.',
      fecha: '2025-06-15',
      lugar: 'Granada, España',
      capacidad: '30 personas',
      imagen: '/actividadGenerica1.png',
    },
    {
      titulo: 'Aventura de Caza en Doñana',
      descripcion: 'Explora el Parque Natural de Doñana mientras participas en una cacería responsable y supervisada.',
      fecha: '2025-07-10',
      lugar: 'Huelva, España',
      capacidad: '20 personas',
      imagen: '/actividadGenerica2.png',
    },
    {
      titulo: 'Caza de Jabalí en los Montes de Toledo',
      descripcion: 'Experimenta la caza de jabalí en un entorno natural y seguro en los Montes de Toledo.',
      fecha: '2025-08-05',
      lugar: 'Toledo, España',
      capacidad: '25 personas',
      imagen: '/actividadGenerica3.png',
    },
    {
      titulo: 'Caza de Perdiz en la Mancha',
      descripcion: 'Vive una experiencia de caza menor en los campos de La Mancha, centrada en la caza de perdiz con perros de muestra.',
      fecha: '2025-09-15',
      lugar: 'Ciudad Real, España',
      capacidad: '35 personas',
      imagen: '/actividadGenerica4.png',
    },
    {
      titulo: 'Caza del Zorro en los Pirineos',
      descripcion: 'Únete a una jornada de caza del zorro en los frondosos bosques de los Pirineos, bajo la supervisión de expertos locales.',
      fecha: '2025-10-22',
      lugar: 'Lérida, España',
      capacidad: '25 personas',
      imagen: '/actividadGenerica5.png',
    },
    {
      titulo: 'Caza de Conejo con Galgos en Extremadura',
      descripcion: 'Participa en una emocionante jornada de caza menor utilizando galgos en los terrenos llanos de Extremadura.',
      fecha: '2025-11-30',
      lugar: 'Badajoz, España',
      capacidad: '20 personas',
      imagen: '/actividadGenerica6.png',
    },

  ];
  isNuevaActividadOpen: boolean = false;

  openNuevaActividad(): void {
    this.isNuevaActividadOpen = true;
  }

  closeNuevaActividad(): void {
    this.isNuevaActividadOpen = false;
  }

  inscribirse(actividad: any): void {
    const confirmationBox = document.createElement('div');
    confirmationBox.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';

    confirmationBox.innerHTML = `
    <div class='bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6'>
      <h2 class='text-2xl font-bold text-green-600'>¡Inscripción Exitosa!</h2>

      <div class='flex justify-center'>
        <img src='${actividad.imagen}' alt='${actividad.titulo}' class='w-24 h-24 object-cover rounded-lg shadow-lg mb-4'>
      </div>

      <img src='/Emojicheck.png' alt='Check Icon' class='w-12 h-12 mx-auto mb-4'>

      <p class='text-gray-800 font-medium'>
        Te has inscrito correctamente en la actividad:
        <span class='font-semibold text-green-600'>"${actividad.titulo}"</span>.
      </p>

      <button class='bg-green-600 hover:bg-green-700 transition duration-300 text-white py-2 px-6 rounded-lg shadow-lg mt-4' onclick='document.body.removeChild(this.parentElement.parentElement)'>
        Cerrar
      </button>
    </div>
  `;

    document.body.appendChild(confirmationBox);
  }

}



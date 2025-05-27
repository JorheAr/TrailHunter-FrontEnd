import { Component } from '@angular/core';
import {NuevoGrupoComponent} from '../../component/nuevo-grupo/nuevo-grupo.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-grupos',
  imports: [
    NuevoGrupoComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './grupos.component.html'
})
export class GruposComponent {
  grupos = [
    {
      nombre: 'Cazaconejos',
      descripcion: 'Grupo especializado en caza menor, especialmente conejos. Fomentamos el aprendizaje entre generaciones y la precisión táctica. Ideal para quienes buscan técnica, compañerismo y buenos relatos junto al fuego.',
      imagen: '/Img-Grupo-3-Conejos.png'
    },
    {
      nombre: 'Los amigos de Pedro',
      descripcion: 'Fundado por Pedro "El Zorro", este grupo reúne a apasionados de la caza en familia. Amamos las rutas largas, las noches de acampada y cocinar lo cazado. Amistad, humor y respeto a la fauna nos definen.',
      imagen: '/Img-Grupo-1-pedro.png'
    },
    {
      nombre: 'Soldados de Sylvanas',
      descripcion: 'Inspirados en leyendas élficas, mezclamos arquería y tácticas sigilosas. Nos movemos como el viento por el bosque y honramos profundamente el equilibrio natural. Ideal para los cazadores más estratégicos.',
      imagen: '/Img-Grupo-2-sylvanas.png'
    },
    {
      nombre: 'Los pretendientes de Ashe',
      descripcion: 'Elegantes, precisos y con un gusto impecable por el tiro perfecto. Este grupo honra a la cazadora legendaria Ashe, combinando estilo con eficacia. Nos entrenamos con arcos largos y somos conocidos por nuestros duelos amistosos al amanecer.',
      imagen: '/Img-Grupo-4-ashe.png'
    },
    {
      nombre: 'Los cavernícolas',
      descripcion: 'Fieles a lo primitivo, cazamos como nuestros ancestros: sin tecnología, con astucia e instinto. Nos guía el fuego y nos fortalece la tierra. Ideal para quienes buscan una conexión profunda y salvaje con la naturaleza.',
      imagen: '/Img-Grupo-5-cavernicolas.png'
    },
    {
      nombre: 'Los matagigantes',
      descripcion: 'Cazadores de grandes bestias, valientes frente a cualquier monstruo. Este grupo vive para el desafío, la adrenalina y los relatos heroicos. Si sueñas con enfrentar lo imposible, aquí es donde comienza tu leyenda.',
      imagen: '/Img-Grupo-6-matagigantes.png'
    }
  ];

  isNuevoGrupoOpen = false;

  openNuevoGrupo() {
    console.log("Abriendo formulario nuevo grupo");
    this.isNuevoGrupoOpen = true;
  }

  closeNuevoGrupo() {
    console.log("Cerrando formulario nuevo grupo");
    this.isNuevoGrupoOpen = false;
  }

  unirseAlGrupo(grupo: any): void {
    const gruposUnidos = JSON.parse(localStorage.getItem('gruposUnidos') || '[]');

    // Verifica si ya se unió
    const yaUnido = gruposUnidos.some((g: any) => g.nombre === grupo.nombre);
    if (yaUnido) {
      alert(`Ya estás unido al grupo: ${grupo.nombre}`);
      return;
    }

    gruposUnidos.push(grupo);
    localStorage.setItem('gruposUnidos', JSON.stringify(gruposUnidos));

    alert(`¡Te has unido al grupo "${grupo.nombre}" con éxito!`);
    console.log('Grupo unido:', grupo);
  }
}

import { Component } from '@angular/core';
import {HeaderComponent} from '../../component/header/header.component';

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.html',
  imports: [
    HeaderComponent
  ],
  styleUrls: []  // No existe un archivo quienes-somos.css
})
export class QuienesSomosComponent {
  // Aquí puedes agregar lógica si es necesario
  public sections = [
    {
      title: 'Bienvenido a TrailHunter',
      description: `La red social dedicada a cazadores apasionados que buscan conectar, compartir experiencias y descubrir nuevos destinos de caza.
      Nuestra misión es crear una comunidad donde puedas encontrarte con otros entusiastas de la caza, intercambiar conocimientos y planificar tus próximas aventuras.`,
      imageUrl: '/hunt-ilustration.png'
    },
    {
      title: 'Nuestra Comunidad',
      description: `En TrailHunter, celebramos la tradición y el espíritu de la caza, proporcionando una plataforma donde los cazadores de todos los niveles de experiencia pueden aprender unos de otros y fortalecer su pasión por esta noble actividad.
      Únete a nosotros y sé parte de una comunidad que valora la camaradería, el respeto por la naturaleza y la ética en la caza.`,
      imageUrl: '/trailhunter-logo.png'
    }
  ];

  constructor() {}
}

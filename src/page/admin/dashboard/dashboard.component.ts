import { Component, OnInit } from '@angular/core';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexXAxis
} from 'ng-apexcharts';
import { StatsService, StatsDashboard } from '../../../services/stats.service';
import { NgIf } from '@angular/common';
import { Card } from 'primeng/card';
import { NgApexchartsModule } from 'ng-apexcharts';

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
};

export type AxisChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgIf,
    NgApexchartsModule,
    Card
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats!: StatsDashboard;
  loading = true;



  public chartOptionsUsuarios!: DonutChartOptions;
  public chartOptionsActividades!: AxisChartOptions;
  public chartOptionsInscripciones!: AxisChartOptions;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.initCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener estadísticas:', err);
        this.loading = false;
      }
    });
  }

  initCharts(): void {
    this.chartOptionsUsuarios = {
      series: [this.stats.total_usuarios, this.stats.usuarios_ultima_semana],
      chart: {
        type: 'donut',
        height: 300
      },
      labels: ['Usuarios Totales', 'Usuarios Última Semana'],
      responsive: [{
        breakpoint: 480,
        options: {
          legend: { position: 'bottom' }
        }
      }],
      title: { text: 'Usuarios' }
    };

    this.chartOptionsActividades = {
      series: [{ name: 'Actividades', data: [this.stats.total_actividades] }],
      chart: {
        type: 'bar',
        height: 300
      },
      xaxis: { categories: ['Total'] },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: { position: 'bottom' }
        }
      }],
      title: { text: 'Actividades' }
    };

    this.chartOptionsInscripciones = {
      series: [{ name: 'Inscripciones', data: [this.stats.inscripciones_ultima_semana] }],
      chart: {
        type: 'line',
        height: 300
      },
      xaxis: { categories: ['Última Semana'] },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: { position: 'bottom' }
        }
      }],
      title: { text: 'Inscripciones' }
    };
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart-attendance',
  templateUrl: './chart-attendance.component.html',
  styleUrls: ['./chart-attendance.component.scss'],
  standalone: true,
  imports: [BaseChartDirective],
})
export class ChartAttendanceComponent  implements OnInit {

  @Input() attendance: { [fecha: string]: string } = {};

  public barChartType = 'bar' as const;
  barChartData!: ChartConfiguration<'bar'>['data'];
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    scales: {
      x: {
        grid: {
        display: false 
      }
      },
      y: { 
        min:0,
        ticks: {
          stepSize: 1,
          precision:0
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    animation: {
      duration: 800,
      easing: 'easeOutBounce'
    }
  };

  ngOnInit(): void {
    const counter: Record<string, number> = {};

    Object.values(this.attendance).forEach((state) => {
      console.log(state)
      counter[state] = (counter[state] || 0) + 1;
    });

    this.barChartData = {
      labels: Object.keys(counter),
      datasets: [
        {
          data: Object.values(counter),
          label: 'Cantidad',
          backgroundColor: Object.keys(counter).map(estado => this.getColor(estado)),
        }
      ]
    };

    console.log(this.barChartData);
  }

  private getColor(estado: string): string {
    switch (estado) {
      case 'asistencia': return '#4caf50';
      case 'retraso': return '#ff9800';
      case 'falta': return '#f44336';
      case 'permiso': return '#2196f3';
      default: return '#9e9e9e';
    }
  }
}

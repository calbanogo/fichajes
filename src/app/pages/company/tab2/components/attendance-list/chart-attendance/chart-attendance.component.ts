import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType, Plugin } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-chart-attendance',
  templateUrl: './chart-attendance.component.html',
  styleUrls: ['./chart-attendance.component.scss'],
  standalone: true,
  imports: [IonText, BaseChartDirective],
})
export class ChartAttendanceComponent {
  @Input() attendance: { [fecha: string]: string } = {};
  public chartType: ChartType = 'doughnut' as const;
  donutItems: {
    tipo: string;
    valor: number;
    icono: string;
    label: string;
    color: string;
    chartData: any;
    chartPlugin: any;
  }[] = [];

  public chartOptions: ChartOptions = {
  responsive: true,
  animation: {
    duration: 800,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: '#222',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#3880ff',
      borderWidth: 1,
      padding: 10,
    },
  },
};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['attendance'] && this.attendance) {
      this.donutItems = this.agruparPorTipo(this.attendance);
    }
  }

private agruparPorTipo(data: Record<string, string>) {
  const resultado: Record<string, number> = {};
  for (const tipo of Object.values(data)) {
    resultado[tipo] = (resultado[tipo] ?? 0) + 1;
  }

  const total = Object.values(resultado).reduce((a, b) => a + b, 0);

  return Object.keys(resultado)
    .sort((a, b) => a.localeCompare(b))
    .map((tipo) => {
      const valor = resultado[tipo];
      const restante = total - valor;
      const porcentaje = Math.round((valor / total) * 100);

      return {
        tipo,
        valor,
        icono: this.getIcon(tipo),
        label: this.formatLabel(tipo),
        color: this.getColor(tipo),
        chartData: {
          labels: [tipo, 'Otros'],
          datasets: [{
            data: [valor, restante > 0 ? restante : 0.0001],
            backgroundColor: [this.getColor(tipo), '#e0e0e0'],
            borderWidth: 0,
            cutout: '80%',
          }]
        },
        chartPlugin: {
          id: 'centerText',
          beforeDraw: (chart: any) => {
            if (!chart || !chart.ctx) return;
            const { width, height, ctx } = chart;
            ctx.save();
            ctx.font = '600 18px "Segoe UI", sans-serif';
            ctx.fillStyle = '#444';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${porcentaje}%`, width / 2, height / 2);
            ctx.restore();
          }
        }
      };
    });
}

  get total(): number {
    return this.donutItems.reduce((acc, item) => acc + item.valor, 0);
  }

  getChartData(item: typeof this.donutItems[number]): ChartConfiguration['data'] {
    const restante = this.total - item.valor;
    return {
      labels: [item.label, 'Otros'],
      datasets: [
        {
          data: [item.valor, restante > 0 ? restante : 0.0001],
          backgroundColor: [item.color, '#e0e0e0'],
          borderWidth: 0,
        },
      ],
    };
  }

  getChartOptions(): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: '#222',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#3880ff',
          borderWidth: 1,
          padding: 10,
        },
      },
    };
  }

  centerTextPlugin(item: typeof this.donutItems[number]): Plugin {
    const porcentaje = Math.round((item.valor / this.total) * 100);
    return {
      id: 'centerText',
      beforeDraw: (chart) => {
        if (!chart || !chart.ctx) return;
        const { width, height, ctx } = chart;
        ctx.save();
        ctx.font = '600 18px "Segoe UI", sans-serif';
        ctx.fillStyle = '#444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${porcentaje}%`, width / 2, height / 2);
        ctx.restore();
      },
    };
  }

  getColor(tipo: string): string {
    const colores: Record<string, string> = {
      asistencia: '#2dd36f',
      falta: '#eb445a',
      retraso: '#ffc409',
      permiso: '#3dc2ff',
    };
    return colores[tipo] ?? '#999';
  }

  formatLabel(tipo: string): string {
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  }

  getIcon(tipo: string): string {
    const iconos: Record<string, string> = {
      asistencia: '✅',
      retraso: '⏰',
      falta: '❌',
      permiso: '📄',
    };
    return iconos[tipo] ?? '';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ChartAttendanceComponent } from '../chart-attendance/chart-attendance.component';
import { Router } from '@angular/router';
import { CustomHeaderComponent } from 'src/app/components/custom-header/custom-header.component';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.page.html',
  styleUrls: ['./attendance-detail.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, 
    IonIcon,
    IonButton,
    IonButtons,
    IonContent,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ChartAttendanceComponent,
    CustomHeaderComponent,
  ],
})
export class AttendanceDetailPage implements OnInit {
  public barChartData!: ChartConfiguration<'bar'>['data'];
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Resumen de Asistencias' },
    },
  };

  public attendances!: any;
  public name!: string;
  public range!: string;
  public retard: number = 0;
  public permission: number = 0;
  public assist: number = 0;
  public notAssist: number = 0;
  public attendanceLength = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.attendances = history.state;
    this.calculateAttendance(Object.values(this.attendances.attendance))
  }

  public goBack() {
    this.router.navigate(['/company/tab2']);
  }

public calculateAttendance(attendance: string[]): void {
  if (!Array.isArray(attendance)) return;
  this.attendanceLength = attendance.length;
  attendance.forEach((att) => {
    switch (att) {
      case 'asistencia':
        this.assist++;
        break;
      case 'permiso':
        this.permission++;
        break;
      case 'falta':
        this.notAssist++;
        break;
      case 'retraso':
        this.retard++;
        break;
      default:
        console.warn(`Tipo de asistencia desconocido: ${att}`);
    }
  });
}

}

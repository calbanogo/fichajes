import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonCol,
  IonGrid,
  IonRow,
  IonSelectOption,
  IonText,
  IonIcon,
  IonLabel,
  IonSelect,
  IonPopover,
  IonDatetime,
  IonButton,
  IonToolbar,
  IonHeader,
} from '@ionic/angular/standalone';
import { CompanyService } from 'src/app/services/company';
import { AsistenciaDia } from '../../tab2.page';
import { DatePipe } from '@angular/common';
import { FocusFixDirective } from 'src/app/directives/focus-fix.drective';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee';
import { UtilsService } from 'src/app/services/utils-service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButton,
    IonDatetime,
    IonPopover,
    IonLabel,
    IonIcon,
    IonText,
    IonRow,
    IonGrid,
    IonCol,
    IonSelectOption,
    IonSelect,
    DatePipe,
    FocusFixDirective,
    FormsModule,
  ],
})
export class AttendanceListComponent implements OnInit {
  @Input() today!: string;
  @Input() diasMes: string[] = [];
  @Input() empleados: any[] = [];
  @Input() companyId!: string;

  public rangoDias: string = 'dia';
  public rangoDiasShow!: string;
  public mostrarPopoverDays = false;
  public eventoPopoverDays: any;
  public presentationDays!: string;
  public selectDayValue!: any;
  private actualEmployees: any[] = [];

  public meses: string[] = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private utilsService: UtilsService
  ) {}

  async ngOnInit() {
    await this.loadEmployees();
    await this.loadEmployeesAttendance();
  }

  public abrirPopoverDays(event: Event): void {
    setTimeout(() => {
      this.eventoPopoverDays = event;
      this.mostrarPopoverDays = true;
    }, 120);
  }

  public async loadEmployeesAttendance(): Promise<void> {
    let fechaFin = new Date();
    let fechaInicio = new Date();
    switch (this.rangoDias) {
      case 'dia':
        // Hoy mismo
        const date = new Date(fechaInicio);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();

        this.rangoDiasShow = `${dia}/${mes}/${año}`;
        fechaInicio = new Date(); // ya lo es, pero lo dejamos explícito
        this.presentationDays = 'date';
        break;
      case 'mes':
        // Primer día del mes actual
        fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 1);
        this.rangoDiasShow = `${this.meses[fechaInicio.getMonth()]}/${fechaFin
          .getFullYear()
          .toString()}`;
        this.presentationDays = 'month-year';
        break;
      case 'anio':
        // Primer día del año actual
        fechaInicio = new Date(fechaFin.getFullYear(), 0, 1);
        this.rangoDiasShow = new Date().getFullYear().toString();
        this.presentationDays = 'year';
        break;

      default:
        return;
    }

    const inicioStr = fechaInicio.toISOString().split('T')[0];
    const finStr = fechaFin.toISOString().split('T')[0];

    const attendance = await this.companyService.getAttendance(
      this.companyId,
      inicioStr,
      finStr
    );
    this.procesarAsistencias(attendance);
  }

  public async selectDay(value?: any): Promise<void> {
    const fallback = this.selectDayValue;
    const finalValue = value ?? fallback;
    this.selectDayValue = finalValue;
    const date = new Date(this.selectDayValue);
    let fechaFin = new Date();
    let fechaInicio = new Date();

    switch (this.rangoDias) {
      case 'dia':
        // Hoy mismo
        const day = new Date(fechaInicio);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        fechaInicio = new Date(this.selectDayValue);
        fechaFin = new Date(this.selectDayValue);
        this.rangoDiasShow = `${dia}/${mes}/${año}`;
        break;
      case 'mes':
        // Primer día del mes actual
        fechaInicio = new Date(date.getFullYear(), date.getMonth(), 1);
        fechaFin = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.rangoDiasShow = `${this.meses[fechaInicio.getMonth()]}/${fechaFin
          .getFullYear()
          .toString()}`;
        break;
      case 'anio':
        // Primer día del año actual
        const year = date.getFullYear();
        fechaInicio = new Date(year, 0, 1); // 1 de enero
        fechaFin = new Date(year, 11, 31); // 31 de diciembre
        this.rangoDiasShow = year.toString();
        break;

      default:
        return;
    }

    const inicioStr = fechaInicio.toISOString().split('T')[0];
    const finStr = fechaFin.toISOString().split('T')[0];

    const attendance = await this.companyService.getAttendance(
      this.companyId,
      inicioStr,
      finStr
    );
    this.procesarAsistencias(attendance);
  }

  public getIcon(state: string): string {
    switch (state) {
      case 'asistencia':
        return '✅';
      case 'retraso':
        return '⏰';
      case 'falta':
        return '❌';
      case 'permiso':
        return '📄';
      default:
        return '❓';
    }
  }

  public navigateDetail(data: any) {
    let state;
    if (typeof data === 'string') {
      const resultado: Record<string, string> = {};
      this.empleados.forEach((persona) => {
        const asistencia = persona.asistencias[data];
        if (asistencia !== undefined) {
          resultado[persona.name] = asistencia;
        }
      });
      state = {
        ...resultado,
        attendance: resultado,
        name: data,
        dateRange: data,
        day: true,
      };
    } else {
      state = {
        ...data,
        attendance: data.asistencias,
        dateRange: this.rangoDias,
        detail: this.rangoDiasShow,
      };
    }

    this.router.navigate(['attendance-detail'], {
      state: state,
      relativeTo: this.route,
    });
  }

  public cerrarPopoverDays(): void {
    this.mostrarPopoverDays = false;
  }

  private procesarAsistencias(attendance: AsistenciaDia[]): void {
    const diasConDatos = new Set<string>();
    const mapaEmpleados = new Map<string, any>();

    const empleadosMap = new Map(this.actualEmployees.map((e) => [e.id, e]));

    for (const dia of attendance) {
      const fecha = dia.date;

      for (const emp of dia.employees) {
        if (emp.state) diasConDatos.add(fecha);

        if (!mapaEmpleados.has(emp.id)) {
          const actual = empleadosMap.get(emp.id);

          mapaEmpleados.set(emp.id, {
            id: emp.id,
            name: actual
              ? `${actual.name} ${actual.surname}`
              : `${emp.name} ${emp.surname}`,
            asistencias: {},
            isDeleted: !actual, // opcional: marcar si fue eliminado
          });
        }

        mapaEmpleados.get(emp.id).asistencias[fecha] = emp.state;
      }
    }

    this.diasMes = Array.from(diasConDatos).sort();
    this.empleados = Array.from(mapaEmpleados.values());
    console.log(this.empleados);
  }

  private async loadEmployees() {
    const companyId = this.companyService.getSelectedCompany()?.companyId;
    if (!companyId) return;

    try {
      const employees = await this.employeeService.getEmployees(companyId);
      this.actualEmployees = employees;
    } catch (error) {
      await this.utilsService.showToast('Error al cargar empleados ❌', 'warning');
    }
  }

  async createExcel() {
    const companyData = await this.companyService.getCompanyById(
      this.companyId
    );
    console.log(companyData);
    if(!this.empleados || this.empleados.length === 0) {
      await this.utilsService.showToast('No hay registros para exportar ❌', 'warning');
      return;
    }
    const hours = companyData?.efectiveHours ?? 8;
    console.log(companyData);
    this.utilsService.exportarAsistencias(
      this.empleados,
      +hours,
      'asistencias.xlsx'
    );
  }
}

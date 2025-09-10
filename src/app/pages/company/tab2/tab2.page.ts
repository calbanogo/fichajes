import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  IonToolbar,
  IonContent,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonLabel,
  IonItem,
  IonDatetime,
  IonList,
  IonSelect,
  IonSegment,
  IonSelectOption,
  IonPopover,
  IonListHeader,
  IonItemDivider,
  IonIcon,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/angular/standalone';

import { CustomHeaderComponent } from 'src/app/components/custom-header/custom-header.component';
import { CustomFooterButtonComponent } from 'src/app/components/custom-footer-button/custom-footer-button.component';
import { CompanyService } from 'src/app/services/company';
import { EmployeeService } from 'src/app/services/employee';
import { UtilsService } from 'src/app/services/utils-service';
import { FocusFixDirective } from 'src/app/directives/focus-fix.drective';
import { ActivatedRoute, Router } from '@angular/router';

export interface Employee {
  id: string;
  name: string;
  surname: string;
  state: string;
}

export interface AsistenciaDia {
  id: string;
  date: string;
  companyId: string;
  employees: Employee[];
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonSegmentButton,
    IonIcon,
    IonItemDivider,
    IonListHeader,
    IonPopover,
    IonList,
    IonDatetime,
    IonItem,
    IonLabel,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonContent,
    IonSelectOption,
    IonSelect,
    IonSegment,
    CustomHeaderComponent,
    CustomFooterButtonComponent,
    FocusFixDirective,
  ],
})
export class Tab2Page implements OnInit {
  public companyId!: string;
  public employees: any[] = [];
  public empleados: {
    id: string;
    name: string;
    asistencias: { [dia: string]: string };
  }[] = [];

  public diasMes: string[] = [];
  public today: string = new Date().toISOString().split('T')[0];
  public rangoDias: string = '7';
  public scroll: boolean = false;
  public segmentValue: string = 'asistencia';
  public mostrarPopover = false;
  public eventoPopover: any;

  public createAsistenciaForm!: FormGroup;
  public dateForm!: FormGroup;
  public segmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private utilsService: UtilsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.segmentForm = this.fb.group({
      segment: new FormControl('asistencia', { nonNullable: true }),
    });

    this.createAsistenciaForm = this.fb.group({
      date: [this.today, Validators.required],
      employees: this.fb.array([]),
    });

    this.createAsistenciaForm.get('date')?.valueChanges.subscribe((fecha) => {
      if (fecha) this.obtenerAsistenciaPorFecha(fecha);
    });

    this.segmentForm.get('segment')?.valueChanges.subscribe((valor) => {
      this.scroll = valor === 'listado';
      if (this.scroll) {
        this.rangoDias = this.rangoDias || '7';
        this.cargarEmpleados();
      }
    });

    this.cargarEmpleados();
  }

  ionViewWillEnter(): void {
    this.companyId = this.companyService.getSelectedCompany()?.companyId ?? '';

    this.employeeService.getEmployees(this.companyId).then((employees) => {
      this.employees = employees;
      const grupoArray = employees.map((e) => this.crearGrupoEmpleado(e));
      this.createAsistenciaForm.setControl(
        'employees',
        this.fb.array(grupoArray)
      );
    });
  }

  obtenerAsistenciaPorFecha(fecha: string): void {
    this.companyService
      .getAttendance(this.companyId, fecha, fecha)
      .then((asistencias: AsistenciaDia[]) => {
        if (asistencias.length > 0) {
          const asistenciaDelDia = asistencias[0];
          const empleadosFormArray = this.fb.array(
            asistenciaDelDia.employees.map((emp) =>
              this.crearGrupoEmpleado(emp, emp.state || 'asistencia')
            )
          );
          this.createAsistenciaForm.setControl('employees', empleadosFormArray);
        } else {
          this.employeeService
            .getEmployees(this.companyId)
            .then((employees) => {
              const empleadosFormArray = this.fb.array(
                employees.map((emp) => this.crearGrupoEmpleado(emp))
              );
              this.createAsistenciaForm.setControl(
                'employees',
                empleadosFormArray
              );
            });
        }
      });
  }

  private crearGrupoEmpleado(e: any, estado: string = 'asistencia'): FormGroup {
    return this.fb.group({
      id: [e.id],
      name: [e.name],
      surname: [e.surname],
      state: [estado, Validators.required],
    });
  }

  get empleadosFormArray(): FormArray {
    return this.createAsistenciaForm.get('employees') as FormArray;
  }

  get days(): FormArray {
    return this.empleadosFormArray;
  }

  getGrupo(i: number): FormGroup {
    return this.days.at(i) as FormGroup;
  }

  abrirPopover(event: Event): void {
    setTimeout(() => {
      this.eventoPopover = event;
      this.mostrarPopover = true;
    }, 120);
  }

  cerrarPopover(): void {
    this.mostrarPopover = false;
  }

  seleccionarFecha(valor: any): void {
    const fecha = new Date(valor).toISOString().split('T')[0];
    this.createAsistenciaForm.get('date')?.setValue(fecha);
    this.cerrarPopover();
  }

  setEstado(index: number, estado: string): void {
    const grupo = this.getGrupo(index);
    grupo.get('state')?.setValue(estado);
  }

  onSubmit(): void {
    this.companyService
      .addAttendance(this.companyId, this.createAsistenciaForm.value)
      .then(() => {
        this.utilsService.showToast('Asistencia guardada con éxito ✅');
        const date = this.createAsistenciaForm.get('date')?.value;
        this.createAsistenciaForm.reset();
        this.createAsistenciaForm.get('date')?.setValue(date);
        this.ionViewWillEnter();
      })
      .catch((error) => {
        console.error('Error al guardar la asistencia:', error);
      });
  }

  async cargarEmpleados(): Promise<void> {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaFin.getDate() - +this.rangoDias + 1);

    const inicioStr = fechaInicio.toISOString().split('T')[0];
    const finStr = fechaFin.toISOString().split('T')[0];

    const attendance = await this.companyService.getAttendance(
      this.companyId,
      inicioStr,
      finStr
    );
    this.procesarAsistencias(attendance);
  }

  procesarAsistencias(attendance: AsistenciaDia[]): void {
    const diasConDatos = new Set<string>();
    const mapaEmpleados = new Map<string, any>();

    for (const dia of attendance) {
      const fecha = dia.date;

      for (const emp of dia.employees) {
        if (emp.state) diasConDatos.add(fecha);

        if (!mapaEmpleados.has(emp.id)) {
          mapaEmpleados.set(emp.id, {
            id: emp.id,
            name: `${emp.name} ${emp.surname}`,
            asistencias: {},
          });
        }

        mapaEmpleados.get(emp.id).asistencias[fecha] = emp.state;
      }
    }

    this.diasMes = Array.from(diasConDatos).sort();
    this.empleados = Array.from(mapaEmpleados.values());
  }

  getIcon(state: string): string {
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

  actualizarDias(): void {
    const hoy = new Date();
    this.diasMes = [];

    for (let i = 0; i < +this.rangoDias; i++) {
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() - i);
      this.diasMes.push(dia.toISOString().split('T')[0]);
    }
  }

  generarDias(inicio: string, fin: string): string[] {
    const dias: string[] = [];
    let actual = new Date(inicio);
    const limite = new Date(fin);

    while (actual <= limite) {
      dias.push(actual.toISOString().split('T')[0]);
      actual.setDate(actual.getDate() + 1);
    }

    return dias;
  }

  navigateDetail(data: any) {
    let state;
    if (typeof data === 'string') {
      const resultado: Record<string, string> = {};
      this.empleados.forEach((persona) => {
        const asistencia = persona.asistencias[data];
        if (asistencia !== undefined) {
          resultado[persona.name] = asistencia;
        }
      });
      console.log(resultado);
      state = { ...resultado, attendance: resultado, dateRange: data, day: true}

    } else {
      state = { ...data, attendance: data.asistencias, dateRange: this.rangoDias };
    }

    this.router.navigate(['attendance-detail'], {
      state: state,
      relativeTo: this.route,
    });
  }
}

import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonIcon,
  IonList,
  IonItemDivider,
  IonLabel,
  IonItem,
  IonListHeader,
  IonSelectOption,
  IonPopover,
  IonDatetime,
  IonSelect
} from '@ionic/angular/standalone';
import { CustomFooterButtonComponent } from 'src/app/components/custom-footer-button/custom-footer-button.component';
import { CompanyService } from 'src/app/services/company';
import { UtilsService } from 'src/app/services/utils-service';
import { AsistenciaDia } from '../../tab2.page';
import { EmployeeService } from 'src/app/services/employee';
import { FocusFixDirective } from 'src/app/directives/focus-fix.drective';

@Component({
  selector: 'app-attendance-inputation',
  templateUrl: './attendance-inputation.component.html',
  styleUrls: ['./attendance-inputation.component.scss'],
  imports: [
    IonDatetime,
    IonPopover,
    DatePipe,
    IonListHeader,
    IonItem,
    IonLabel,
    IonItemDivider,
    IonList,
    IonIcon,
    ReactiveFormsModule,
    FormsModule,
    IonSelect,
    IonSelectOption,
    CustomFooterButtonComponent,
    CommonModule,
    FocusFixDirective
  ],
})
export class AttendanceInputationComponent implements OnInit {
  @Input() today!: string;
  @Input() companyId!: string;
  @Input() employeesList!: any;

  public createAsistenciaForm!: FormGroup;
  public mostrarPopover = false;
  public eventoPopover: any;

  constructor(
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private utilsService: UtilsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createAsistenciaForm = this.fb.group({
      date: [this.today, Validators.required],
      employees: this.fb.array([]),
    });
    const grupoArray = this.employeesList.map((e: any) => this.crearGrupoEmpleado(e));
      this.createAsistenciaForm.setControl(
        'employees',
        this.fb.array(grupoArray)
    );
    this.createAsistenciaForm.get('date')?.valueChanges.subscribe((fecha) => {
      if (fecha) this.obtenerAsistenciaPorFecha(fecha);
    });
  }

  public abrirPopover(event: Event): void {
    setTimeout(() => {
      this.eventoPopover = event;
      this.mostrarPopover = true;
    }, 120);
  }

  public get empleadosFormArray(): FormArray {
    return this.createAsistenciaForm.get('employees') as FormArray;
  }

  public get days(): FormArray {
    return this.empleadosFormArray;
  }

  public cerrarPopover(): void {
    this.mostrarPopover = false;
  }

  public seleccionarFecha(valor: any): void {
    const fecha = new Date(valor).toISOString().split('T')[0];
    this.createAsistenciaForm.get('date')?.setValue(fecha);
    this.cerrarPopover();
  }

  public onSubmit(): void {
    this.companyService
      .addAttendance(this.companyId, this.createAsistenciaForm.value)
      .then(() => {
        this.utilsService.showToast('Asistencia guardada con éxito ✅');
      })
      .catch((error) => {
        console.error('Error al guardar la asistencia:', error);
      });
  }

private obtenerAsistenciaPorFecha(fecha: string): void {
  Promise.all([
    this.companyService.getAttendance(this.companyId, fecha, fecha),
    this.employeeService.getEmployees(this.companyId)
  ]).then(([asistencias, empleadosActuales]) => {
    const asistenciaDelDia = asistencias.length > 0 ? asistencias[0] : { employees: [] };

    const asistenciaMap = new Map(
      asistenciaDelDia.employees.map((emp: any) => [emp.id, emp])
    );

    const empleadosFormArray = this.fb.array(
      empleadosActuales.map(emp => {
        const asistencia: any = asistenciaMap.get(emp.id);
        return this.crearGrupoEmpleado(emp, asistencia?.state || 'asistencia');
      })
    );

    this.createAsistenciaForm.setControl('employees', empleadosFormArray);
  });
}
  private crearGrupoEmpleado(e: any, estado: string  = 'asistencia'): FormGroup {
    return this.fb.group({
      id: [e.id],
      name: [e.name],
      surname: [e.surname],
      state: [estado, Validators.required],
    });
  }
}

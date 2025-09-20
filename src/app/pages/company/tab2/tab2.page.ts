import { CommonModule } from '@angular/common';
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
  IonSegment,
  IonSegmentButton,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';

import { CustomHeaderComponent } from 'src/app/components/custom-header/custom-header.component';
import { CompanyService } from 'src/app/services/company';
import { EmployeeService } from 'src/app/services/employee';
import { AttendanceListComponent } from './components/attendance-list/attendance-list.component';
import { AttendanceInputationComponent } from './components/attendance-inputation/attendance-inputation.component';

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
    IonCol,
    IonRow,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonSegmentButton,
    IonLabel,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonContent,
    IonSegment,
    CustomHeaderComponent,
    AttendanceListComponent,
    AttendanceInputationComponent,
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
  public scroll: boolean = false;
  public segmentValue: string = 'asistencia';

  public createAsistenciaForm!: FormGroup;
  public dateForm!: FormGroup;
  public segmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.segmentForm = this.fb.group({
      segment: new FormControl('asistencia', { nonNullable: true }),
    });
  }

  ionViewWillEnter(): void {
    this.companyId = this.companyService.getSelectedCompany()?.companyId ?? '';
    this.employeeService.getEmployees(this.companyId).then((employees) => {
      this.employees = employees;
    });
  }
}

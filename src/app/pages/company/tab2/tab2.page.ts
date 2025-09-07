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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { CustomHeaderComponent } from 'src/app/components/custom-header/custom-header.component';
import { CompanyService } from 'src/app/services/company';
import { EmployeeService } from 'src/app/services/employee';
import { CustomFooterButtonComponent } from 'src/app/components/custom-footer-button/custom-footer-button.component';
import { UtilsService } from 'src/app/services/utils-service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
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
    CustomHeaderComponent,
    IonSelectOption,
    IonSelect,
    IonSegment,
    DatePipe,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomFooterButtonComponent,
  ],
})
export class Tab2Page implements OnInit {
  public companyId!: string;
  public employees: any = [];
  public fechaSeleccionada = '';
  public createAsistenciaForm!: FormGroup;
  public dateForm!: FormGroup;
  public mostrarPopover = false;
  public eventoPopover: any;
  public segmentValue: string = 'asistencia';
  public segmentForm!: FormGroup;
  public today: string = new Date().toISOString().split('T')[0];

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.segmentForm = this.fb.group({
      segment: new FormControl('asistencia', { nonNullable: true }),
    });
    this.createAsistenciaForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      employees: this.fb.array([]),
    });
  }

  ionViewWillEnter() {
    this.companyId = this.companyService.getSelectedCompany()?.companyId ?? '';
    this.employeeService.getEmployees(this.companyId).then((employees) => {
      this.employees = employees;
      const grupoArray = employees.map((e) =>
        this.fb.group({
          id: [e.employeeId],
          name: [e.name],
          surname: [e.surname],
          state: ['asistencia', Validators.required],
        })
      );

      this.createAsistenciaForm.setControl(
        'employees',
        this.fb.array(grupoArray)
      );
    });
  }

  onSegmentChanged(ev: any) {
    this.segmentValue = ev.detail.value;
  }

  get empleadosFormArray(): FormArray {
    return this.createAsistenciaForm.get('employees') as FormArray;
  }

  get days(): FormArray {
    return this.createAsistenciaForm.get('employees') as FormArray;
  }

  getGrupo(i: number): FormGroup {
    return this.days.at(i) as FormGroup;
  }

  abrirPopover(event: Event) {
    setTimeout(() => {
      this.eventoPopover = event;
      this.mostrarPopover = true;
    }, 120);
  }

  cerrarPopover() {
    this.mostrarPopover = false;
  }

  seleccionarFecha(valor: any) {
    const fecha = new Date(valor);
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');

    const fechaFormateada = `${yyyy}-${mm}-${dd}`;
    this.createAsistenciaForm.get('date')?.setValue(fechaFormateada);
    this.cerrarPopover();
    const companyId = this.companyService.getSelectedCompany()?.companyId ?? '';
    this.employeeService.getEmployees(companyId).then((employees) => {
      this.employees = employees;
    });
  }

  setEstado(index: number, estado: string) {
    const employees = this.createAsistenciaForm.get('employees') as FormArray;
    if (employees && employees.at(index)) {
      employees.at(index).get('state')?.setValue(estado);
    }
  }

  onSubmit() {
    this.companyService
      .addAttendance(this.companyId, this.createAsistenciaForm.value)
      .then(() => {
        this.utilsService.showToast('Asistencia guardada con éxito ✅');
        this.createAsistenciaForm.reset();
        this.ionViewWillEnter(); // Recargar la lista de empleados después de guardar
      })
      .catch((error) => {
        console.error('Error al guardar la asistencia:', error);
      });
  }
}

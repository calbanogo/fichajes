import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonToolbar, IonButtons, IonTitle, IonList, IonItem, IonInput, IonButton, IonIcon, IonBackButton, IonNote } from '@ionic/angular/standalone';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";
import { CustomFooterButtonComponent } from "src/app/components/custom-footer-button/custom-footer-button.component";
import { CompanyService } from 'src/app/services/company';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EmployeeService } from 'src/app/services/employee';
import { UtilsService } from 'src/app/services/utils-service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.page.html',
  styleUrls: ['./create-employee.page.scss'],
  standalone: true,
  imports: [IonNote, 
    IonItem, IonList, IonTitle, IonButtons, IonToolbar, IonInput, IonIcon,
    IonContent, CommonModule, FormsModule, CustomHeaderComponent, ReactiveFormsModule,
    CustomFooterButtonComponent, IonButton]
})
export class CreateEmployeePage implements OnInit {

  public createEmployeeForm!: FormGroup;
  public employeeId?: string;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit() {
    this.createEmployeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      phone: ['' , Validators.pattern('^[0-9]{10}$')],
      description: [''],
    });
     this.employeeId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.employeeId) {
      this.loadEmployeeData(this.employeeId);
    }
  }

public async onSubmit() {
  const companyId = this.companyService.getSelectedCompany()?.companyId ?? '';
  try {
    if (this.employeeId) {
      await this.employeeService.updateEmployee(this.employeeId, this.createEmployeeForm.value);
      await this.utilsService.showToast('Empleado actualizado con éxito ✅');
    } else {
      await this.employeeService.createEmployee(companyId, this.createEmployeeForm.value);
      await this.utilsService.showToast('Empleado creado con éxito ✅');
    }

    this.createEmployeeForm.reset();
    this.goBack();
  } catch (error) {
    await this.utilsService.showToast('Error al guardar el empleado ❌');
  }
}

  public goBack() {
    this.employeeService.triggerReload();
    this.router.navigate(['/company/tab1']);
  }

  private async loadEmployeeData(id: string) {
    try {
      const employee = await this.employeeService.getEmployeeById(id);
      if (employee) {
        this.createEmployeeForm.patchValue(employee);
      } else {
        await this.utilsService.showToast('Empleado no encontrado ❌');
      }
    } catch (error) {
      await this.utilsService.showToast('Error al cargar el empleado ❌');
    }
  }
}

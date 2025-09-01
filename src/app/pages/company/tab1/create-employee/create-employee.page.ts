import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonToolbar, IonButtons, IonTitle, IonList, IonItem, IonInput, IonButton, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";
import { CustomFooterButtonComponent } from "src/app/components/custom-footer-button/custom-footer-button.component";
import { CompanyService } from 'src/app/services/company';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EmployeeService } from 'src/app/services/employee';
import { UtilsService } from 'src/app/services/utils-service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.page.html',
  styleUrls: ['./create-employee.page.scss'],
  standalone: true,
  imports: [
    IonItem, IonList, IonTitle, IonButtons, IonToolbar, IonInput, IonIcon,
    IonContent, CommonModule, FormsModule, CustomHeaderComponent, ReactiveFormsModule,
    CustomFooterButtonComponent, IonButton]
})
export class CreateEmployeePage implements OnInit {

  public createEmployeeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
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
  }

  public async onSubmit(){
    const companyId = this.companyService.getSelectedCompany()?.companyId ?? '';
    try {
      await this.employeeService.createEmployee( companyId , this.createEmployeeForm.value);
      this.utilsService.showToast('Empleado creado con éxito ✅');
    } catch (error) {
      this.utilsService.showToast('Error al crear el empleado ❌');
    }
     
  }

  public goBack() {
    this.employeeService.triggerReload();
    this.router.navigate(['/company/tab1']);
  }
}

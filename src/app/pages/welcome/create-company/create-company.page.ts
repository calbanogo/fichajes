import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonContent, IonToolbar, IonInput,
  IonButtons, IonBackButton, IonItem,  
  IonTextarea,  IonList, IonTitle, IonLabel, 
  IonToggle } from '@ionic/angular/standalone';

import { CompanyService } from 'src/app/services/company';
import { Router } from '@angular/router';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";
import { CustomFooterButtonComponent } from "src/app/components/custom-footer-button/custom-footer-button.component";
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.page.html',
  styleUrls: ['./create-company.page.scss'],
  standalone: true,
  imports: [IonTitle,
    IonList, IonContent, IonToolbar, CommonModule, ReactiveFormsModule,
    FormsModule, IonButtons, IonBackButton, IonItem, IonTextarea,
    CustomHeaderComponent, CustomFooterButtonComponent, IonInput, IonToggle,
    NgxMaterialTimepickerModule, IonLabel]
})
export class CreateCompanyPage implements OnInit {
  createCompanyForm!: FormGroup;
  hoursForm!: FormGroup;
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(
    private fb: FormBuilder, 
    private companyService: CompanyService,
    private router: Router,
    
  ) {}

  ngOnInit() {
    this.createCompanyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });

    this.hoursForm = this.fb.group({
      days: this.fb.array(
        this.diasSemana.map(day =>
          this.fb.group({
            name: [day],
            active: [false],
            hourInit: [{ value: '09:00', disabled: true }],
            hourFinish: [{ value: '18:00', disabled: true }]
          })
        )
      )
    });

    this.days.controls.forEach((grupo) => {
      grupo.get('active')?.valueChanges.subscribe((activo: boolean) => {
        const horaInicio = grupo.get('hourInit');
        const horaFin = grupo.get('hourFinish');

        if (activo) {
          horaInicio?.enable();
          horaFin?.enable();
        } else {
          horaInicio?.disable();
          horaFin?.disable();
        }
      }); 
    });
  }

  get days(): FormArray {
    return this.hoursForm.get('days') as FormArray;
  }

  getGrupo(i: number): FormGroup {
    return this.days.at(i) as FormGroup;
  }

  async onSubmit() {
    if (this.createCompanyForm.valid) {
      const user = await FirebaseAuthentication.getCurrentUser();
       if (user.user?.uid) {
        const userId = user.user.uid // Obtén el UID del usuario
        await this.companyService.addCompany({...this.createCompanyForm.value, ...this.hoursForm.value}, userId); // Pasa el UID al servicio

        this.router.navigate(['/welcome']);
      } else {
        console.error('No hay un usuario autenticado');
      }
    }
  }
}

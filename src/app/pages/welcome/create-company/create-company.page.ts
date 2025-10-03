import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonToolbar,
  IonInput,
  IonButtons,
  IonBackButton,
  IonItem,
  IonTextarea,
  IonList,
  IonTitle,
  IonLabel,
  IonToggle, IonNote } from '@ionic/angular/standalone';

import { CompanyService } from 'src/app/services/company';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomHeaderComponent } from 'src/app/components/custom-header/custom-header.component';
import { CustomFooterButtonComponent } from 'src/app/components/custom-footer-button/custom-footer-button.component';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { UtilsService } from 'src/app/services/utils-service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.page.html',
  styleUrls: ['./create-company.page.scss'],
  standalone: true,
  imports: [IonNote, 
    IonTitle,
    IonList,
    IonContent,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonButtons,
    IonBackButton,
    IonItem,
    IonTextarea,
    CustomHeaderComponent,
    CustomFooterButtonComponent,
    IonInput,
    IonToggle,
    NgxMaterialTimepickerModule,
    IonLabel,
  ],
})
export class CreateCompanyPage implements OnInit {
  createCompanyForm!: FormGroup;
  hoursForm!: FormGroup;
  diasSemana = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  public companyId?: string;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.createCompanyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      efectiveHours: ['', Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')],
    });

    this.companyId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.companyId) {
      this.loadCompanyData(this.companyId);
    }

    this.hoursForm = this.fb.group({
      days: this.fb.array(
        this.diasSemana.map((day) =>
          this.fb.group({
            name: [day],
            active: [false],
            hourInit: [{ value: '09:00', disabled: true }],
            hourFinish: [{ value: '18:00', disabled: true }],
          })
        )
      ),
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
      if (this.companyId) {
        //Update
        await this.companyService.updateCompany(this.companyId, {
          ...this.createCompanyForm.value,
          ...this.hoursForm.value,
        });
        await this.utilsService.showToast('Empresa actualizada con éxito ✅');
      } else {
        //Create
        const user = await FirebaseAuthentication.getCurrentUser();
        if (user.user?.uid) {
          const userId = user.user.uid;
          await this.companyService.addCompany(
            { ...this.createCompanyForm.value, ...this.hoursForm.value },
            userId
          );

          this.router.navigate(['/welcome']);
        }
      }
    }
  }

  async loadCompanyData(id: string) {
    try {
      const company = await this.companyService.getCompanyById(id);
      if (company) {
        this.createCompanyForm.patchValue(company);
        this.hoursForm.patchValue({ days: company.days || [] });
      } else {
        await this.utilsService.showToast('Empresa no encontrado ❌', 'error');
      }
    } catch (error) {
      await this.utilsService.showToast(
        'Error al cargar el empleado ❌',
        'error'
      );
    }
  }
}

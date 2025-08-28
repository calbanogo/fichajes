import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonItem, IonLabel, 
  IonButton, IonInput, IonTextarea, IonFooter } from '@ionic/angular/standalone';
import { CompanyService } from 'src/app/services/company';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.page.html',
  styleUrls: ['./create-company.page.scss'],
  standalone: true,
  imports: [IonFooter, 
    IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, ReactiveFormsModule,  FormsModule, 
    IonButtons, IonBackButton, IonItem, IonLabel, 
    IonButton, IonInput, IonTextarea
  ]
})
export class CreateCompanyPage implements OnInit {
  createCompanyForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private companyService: CompanyService,
    private auth: Auth,
    private router: Router // Inyecta el servicio Router
  ) {}

  ngOnInit() {
    this.createCompanyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  async onSubmit() {
    if (this.createCompanyForm.valid) {
      const user = this.auth.currentUser;
       if (user) {
        const userId = user.uid; // Obtén el UID del usuario
        await this.companyService.addCompany(this.createCompanyForm.value, userId); // Pasa el UID al servicio
        console.log('Formulario enviado:', this.createCompanyForm.value);
       
        this.router.navigate(['/welcome']);

      } else {
        console.error('No hay un usuario autenticado');
      }
      console.log('Formulario enviado:', this.createCompanyForm.value);
    }
  }
}

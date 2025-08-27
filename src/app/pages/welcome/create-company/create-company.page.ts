import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonItem, IonLabel, 
  IonButton, IonInput, IonTextarea
} from '@ionic/angular/standalone';
import { CompanyService } from 'src/app/services/company';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.page.html',
  styleUrls: ['./create-company.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, ReactiveFormsModule,  FormsModule, 
    IonButtons, IonBackButton, IonItem, IonLabel, 
    IonButton, IonInput, IonTextarea
  ]
})
export class CreateCompanyPage implements OnInit {
  createCompanyForm!: FormGroup;

  constructor(private fb: FormBuilder, private companyService: CompanyService) {}

  ngOnInit() {
    this.createCompanyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      hours: ['', [Validators.required, Validators.min(4)]],
      description: [''],
    });
  }

  async onSubmit() {
    if (this.createCompanyForm.valid) {
      await this.companyService.addCompany(this.createCompanyForm.value);
      console.log('Formulario enviado:', this.createCompanyForm.value);
    }
  }
}

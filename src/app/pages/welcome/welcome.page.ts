import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth';
import { IonContent, IonText, IonToolbar, IonButton, IonFooter, IonList, IonCard, IonCardTitle, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";
import { CommonModule } from '@angular/common';
import { Company } from 'src/app/interfaces/companiesList';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [CommonModule, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonList, IonFooter, IonContent, IonText, IonButton, CustomHeaderComponent, IonToolbar],
})
export class WelcomePage  {
  userData: any = null;
  noCompanyMessage!: string | null;
  companyList!: Company[]; // Lista de empresas del usuario

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    console.log('ionViewWillEnter triggered');
    const user = this.auth.currentUser;
    this.noCompanyMessage = null; 
    if (user) {
    this.userData = await this.authService.getUserData(user.uid);
    console.log('User data:', this.userData);
      if (this.userData && (!this.userData.companies || this.userData.companies.length === 0)) {
        // Verifica si companyId no existe o si el array está vacío
        this.noCompanyMessage = 'No tiene todavía empresa creada';
      } else {
        // Aquí podrías cargar la lista de empresas si es necesario
        this.companyList = this.userData.companies || [];
        console.log('Company list:', this.companyList);
      }
    } 
  }

  navigateTo(path: string) {
    console.log(`Navigating to /${path}`);
    this.router.navigate([`/welcome/${path}`]);
  }

  navigateToCompany(companyId: string) {
    console.log(`Navigating to company with ID: ${companyId}`);
    // Aquí puedes implementar la lógica para navegar a la página de detalles de la empresa
    // Por ejemplo:
    this.router.navigate([`/company/tab1`], { queryParams: { companyId } });
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonToolbar,
  IonContent,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { CustomHeaderComponent } from 'src/app/components/custom-header/custom-header.component';
import { AuthService } from 'src/app/services/auth';
import { CompanyService } from 'src/app/services/company';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonContent,
    CustomHeaderComponent,
  ],
})
export class Tab3Page {
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  updateCompany() {
    const companyValue = this.companyService.getSelectedCompany();
    console.log(companyValue)
    this.router.navigate(['update-company', companyValue?.companyId], {
      relativeTo: this.route,
    });
  }

  createAlert() {
    console.log("Activar notificación")
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

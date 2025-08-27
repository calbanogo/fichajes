import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth';
import { IonHeader, IonContent, IonText, IonToolbar, IonTitle, IonButton } from "@ionic/angular/standalone";
import { Router } from '@angular/router';




@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonHeader, IonContent, IonText, IonToolbar, IonTitle, IonButton],
})
export class WelcomePage implements OnInit {
  userData: any = null;
  noCompanyMessage: string | null = null;

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
    this.userData = await this.authService.getUserData(user.uid);
    if (this.userData && (!this.userData.companyId || this.userData.companyId.length === 0)) {
      // Verifica si companyId no existe o si el array está vacío
      this.noCompanyMessage = 'No tiene todavía empresa creada';
    }
  }
  }

  navigateTo(path: string) {
    console.log(`Navigating to /${path}`);
    this.router.navigate([`/welcome/${path}`]);
  }
}

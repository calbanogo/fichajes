import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { 
  IonContent, IonButton, IonIcon, IonTitle,
  IonToolbar, IonHeader
} from "@ionic/angular/standalone";
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";
import { UtilsService } from 'src/app/services/utils-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule, IonContent,
    CustomHeaderComponent
],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async loginWithGoogle() {
    try {
      const user = await this.authService.loginWithGoogle();
      if(user?.uid) {
        this.router.navigate(['/welcome']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }
}
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const user = await FirebaseAuthentication.getCurrentUser();

      if (user?.user?.uid) {
        return true; // Usuario autenticado
      } else {
        this.router.navigate(['/login']); // Redirige si no está logueado
        return false;
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
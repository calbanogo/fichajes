import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  async canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (user && isLoggedIn === 'true') {
          resolve(true); // Permite el acceso si el usuario está autenticado
        } else {
          this.router.navigate(['/login']); // Redirige al login si no está autenticado
          resolve(false);
        }
      });
    });
  }
}
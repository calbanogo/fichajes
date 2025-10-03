import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private injector: EnvironmentInjector
  ) {}

  // Inicio de sesión con Google
  async loginWithGoogle() {
    try {
      return await runInInjectionContext(this.injector, async () => {
        const firestore = inject(Firestore);
        const result = await FirebaseAuthentication.signInWithGoogle();
        const user = result.user;

        const userRef = doc(firestore, `users/${user?.uid}`);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          await setDoc(userRef, {
            uid: user?.uid,
            email: user?.email,
            companyId: null,
          });
        }

        return user;
      });
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await FirebaseAuthentication.signOut();
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Obtner datos del usuario en Firebase
  async getUserData(uid: string) {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        return userSnapshot.data();
      } else {
        console.error('No se encontraron datos para el usuario');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      throw error;
    }
  }
}

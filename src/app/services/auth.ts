import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) {}

  // Registro de usuario
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario registrado:', userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }
  // Inicio de sesión con Google
  async loginWithGoogle() {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      const user = result.user;

      localStorage.setItem('isLoggedIn', 'true');
      // Guarda los datos del usuario en Firestore
      const userRef = doc(this.firestore, `users/${user?.uid}`);
      const userSnapshot = await getDoc(userRef);
      // console.log('User snapshot:', userSnapshot);
      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          uid: user?.uid,
          email: user?.email,
          companyId: null, // Puedes asignar una empresa aquí si es necesario
        });
      }

      console.log('Usuario autenticado con Google:', user);
      return user;
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('isLoggedIn');
      console.log('Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

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
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  
  constructor(private toastController: ToastController) {}

  public async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      positionAnchor: 'footer',
      color: 'success' // Puedes usar 'danger' para errores
    });
    await toast.present();
  }
}

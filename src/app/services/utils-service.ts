import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ToastController, LoadingController  } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  
  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  public async showToast(message: string, type: 'success' | 'error' = 'success') {
    if(Capacitor.getPlatform() === 'web') {
      const toast = await this.toastController.create({
        message,
        duration: 2000,
        position: 'bottom',
        positionAnchor: 'bottom',
        color: type
      });
      await toast.present();
    } else {
        await Toast.show({
          text: message,
          duration: 'long',
          position: 'bottom'
        });
    }
  }

  public async showLoading(message: string): Promise<any> {
    if(Capacitor.getPlatform() === 'web') {
      const loading = await this.loadingController.create({
        message,
        spinner: 'circles'
      });
      await loading.present();
    }
    else {
      await SplashScreen.show({
        autoHide: false
      });
    }
  }

  async stopLoading() {
    // Oculta el splash
    if(Capacitor.getPlatform() === 'web') {
      await this.loadingController.dismiss();
    }
    else {
      await SplashScreen.hide();
    }
 
  }
}

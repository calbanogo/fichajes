import { Component } from '@angular/core';
import { IonContent, IonToolbar, IonButtons, IonBackButton, IonFab, IonFabButton, IonIcon, IonFabList, IonTitle, IonGrid, IonRow, IonCard, IonCol, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";

@Component({
  selector: 'app-tab0',
  templateUrl: 'tab0.page.html',
  styleUrls: ['tab0.page.scss'],
  imports: [IonCardTitle, IonIcon,  IonCardHeader, IonCol, IonCard, IonRow, IonGrid, IonTitle, IonBackButton, IonButtons, IonToolbar,  IonContent, CustomHeaderComponent],
})
export class Tab0Page {

  constructor() {}

  navigateTo(event: any) {

  }

}

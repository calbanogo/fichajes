import { Component } from '@angular/core';
import { IonContent, IonToolbar, IonButtons, IonBackButton, IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/angular/standalone';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonIcon, IonFabButton, IonFab, IonBackButton, IonButtons, IonToolbar,  IonContent, CustomHeaderComponent],
})
export class Tab1Page {

  constructor() {}

  public addEmployee() {
    console.log("Añadir empleado");
  }
}

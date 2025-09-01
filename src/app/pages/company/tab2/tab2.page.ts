import { Component } from '@angular/core';
import { IonToolbar, IonContent, IonButtons, IonBackButton, IonTitle } from '@ionic/angular/standalone';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonTitle, IonBackButton, IonButtons, IonToolbar, IonContent, CustomHeaderComponent]
})
export class Tab2Page {

  constructor() {}

}

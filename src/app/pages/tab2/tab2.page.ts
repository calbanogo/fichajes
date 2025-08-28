import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CustomHeaderComponent]
})
export class Tab2Page {

  constructor() {}

}

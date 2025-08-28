import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CustomHeaderComponent],
})
export class Tab3Page {
  constructor() {}
}

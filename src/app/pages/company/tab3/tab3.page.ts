import { Component } from '@angular/core';
import { IonToolbar, IonContent, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonBackButton, IonButtons, IonToolbar, IonContent, CustomHeaderComponent],
})
export class Tab3Page {
  constructor() {}
}

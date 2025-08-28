import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { CustomHeaderComponent } from "src/app/components/custom-header/custom-header.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ IonContent, CustomHeaderComponent],
})
export class Tab1Page {

  datos: any = { cosa: "hola"};
  constructor() {}

  nuevoEvento(evento: any) {
    console.log("Nuevo evento", evento)
  }
}

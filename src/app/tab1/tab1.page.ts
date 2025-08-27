import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { FormComponent } from "../components/form/form.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, FormComponent],
})
export class Tab1Page {

  datos: any = { cosa: "hola"};
  constructor() {}

  nuevoEvento(evento: any) {
    console.log("Nuevo evento", evento)
  }
}

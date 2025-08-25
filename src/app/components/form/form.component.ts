import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonInput, IonList, IonButton } from '@ionic/angular/standalone'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [IonInput, IonItem, IonList, IonButton, ReactiveFormsModule]
})
export class FormComponent  implements OnInit {

  @Input() datos!: string;
  @Output() newItemEvent = new EventEmitter<boolean>();

  public profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  constructor() { }

  ngOnInit() {
    console.log("Cuando llega 1");
    console.log(this.datos);
  }

  public changeInput(event: Event): void {
    console.log(event)
  }

  public enviarEvento() {
    console.log(this.profileForm)
    this.newItemEvent.emit(true);
  }
}

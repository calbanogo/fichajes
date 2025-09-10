import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonToolbar, IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
  imports: [IonHeader, IonToolbar, CommonModule],
})
export class CustomHeaderComponent  implements OnInit {

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() little: boolean = false;
  constructor() { }

  ngOnInit() {}

}

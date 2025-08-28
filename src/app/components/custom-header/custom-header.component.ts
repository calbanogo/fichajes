import { Component, Input, OnInit } from '@angular/core';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
  imports: [IonHeader],
})
export class CustomHeaderComponent  implements OnInit {

  @Input() title: string = '';
  @Input() subtitle: string = '';
  constructor() { }

  ngOnInit() {}

}

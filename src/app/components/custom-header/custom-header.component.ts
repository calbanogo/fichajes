import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
  imports: [CommonModule],
})
export class CustomHeaderComponent  implements OnInit {

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() little: boolean = false;
  constructor() { }

  ngOnInit() {}

}

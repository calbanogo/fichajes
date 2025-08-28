import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonFooter, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-custom-footer-button',
  templateUrl: './custom-footer-button.component.html',
  styleUrls: ['./custom-footer-button.component.scss'],
  imports: [IonToolbar, IonFooter, IonButton],
})
export class CustomFooterButtonComponent {

  @Input() disabled = false;
  @Input() buttonText!: string;
  @Output() actionClick = new EventEmitter<void>();

  onClick() {
    this.actionClick.emit();
  }
}

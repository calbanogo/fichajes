import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.page.html',
  styleUrls: ['./edit-company.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EditCompanyPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

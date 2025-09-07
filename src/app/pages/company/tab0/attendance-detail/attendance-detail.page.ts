import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.page.html',
  styleUrls: ['./attendance-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AttendanceDetailPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { add, airplaneOutline, arrowBack, barChartOutline, calendarOutline, checkboxOutline, checkmark, checkmarkCircle, chevronDownOutline, closeOutline, createOutline, ellipsisVertical, listOutline, logoGoogle, peopleCircleOutline, personCircleOutline, removeOutline, settingsOutline, timeOutline, trashOutline } from 'ionicons/icons';
import { setLogLevel, LogLevel } from '@angular/fire';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

setLogLevel(LogLevel.SILENT);

addIcons({
  'logo-google': logoGoogle,
  'people-circle-outline': peopleCircleOutline,
  'calendar-outline': calendarOutline,
  'settings-outline': settingsOutline,
  'add': add,
  'close-outline': closeOutline,
  'bar-chart-outline': barChartOutline,
  'arrow-back': arrowBack,
  'ellipsis-vertical': ellipsisVertical,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'person-circle-outline': personCircleOutline,
  'airplane-outline': airplaneOutline,
  'time-outline': timeOutline,
  'remove-outline': removeOutline,
  'checkmark': checkmark,
  'checkbox-outline': checkboxOutline,
  'chevron-down-outline': chevronDownOutline,
  'list-outline': listOutline
});

initializeApp(environment.firebase);

bootstrapApplication(AppComponent, {
  providers: [
    { 
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy 
    },
    provideIonicAngular({mode: 'md'}),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideCharts(withDefaultRegisterables()),
    {
    provide: Storage,
    useFactory: () => new Storage(),
  
  }
  ],
});
